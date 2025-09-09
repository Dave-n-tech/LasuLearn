"use client";
import axios from "@/app/api/axios";
import { CourseLecture } from "@/app/types";
import React, { useEffect, useRef, useState } from "react";
import { useStudentDashboard } from "../student/context/studentContext";
import QuizModal from "./QuizModal";
import { Fullscreen, Pause, Play, Volume2, VolumeX } from "lucide-react";
import toast from "react-hot-toast";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  lecture: CourseLecture;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, lecture }) => {
  const { setShouldRefetch } = useStudentDashboard();
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // engagement trackers
  const watchTimeRef = useRef(0);
  const skippedTimeRef = useRef(0);
  const rewatchTimeRef = useRef(0);
  const playbackSpeedRef = useRef(1.0);

  const lastTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const seekFromRef = useRef<number | null>(null);
  const seekTargetRef = useRef<number | null>(null);

  const skippedSoFar = useRef(0);
  const rewatchedSoFar = useRef(0);
  const skipLimitRef = useRef(0);
  const warnedRef = useRef(false);

  const isTabActiveRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastSentRef = useRef(Date.now());

  const [showQuiz, setShowQuiz] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [maxWatched, setMaxWatched] = useState(0);

  // states for custom controls
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const quizzes = lecture.quizzes.map((q) => ({
    ...q,
    options: JSON.parse(q.options) as string[],
  }));

  useEffect(() => {
    setQuizCompleted(false);
  }, [lecture.id]);

  useEffect(() => {
    if (progress > maxWatched) {
      setMaxWatched(progress);
    }
  }, [progress]);

  // Video lifecycle + seeking math
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // set skip limit after metadata loads
    const onMeta = () => {
      skipLimitRef.current = video.duration * 0.1; // 10% of duration
      lastTimeRef.current = video.currentTime || 0;
      console.log("duration:", video.duration);
    };

    const onSeeking = () => {
      // Freeze accounting until seek completes
      isSeekingRef.current = true;
      seekFromRef.current = lastTimeRef.current;
      seekTargetRef.current = video.currentTime;
    };

    const handleSeeked = () => {
      const from = seekFromRef.current ?? lastTimeRef.current;
      const target = seekTargetRef.current ?? video.currentTime; // use intended target
      const to = video.currentTime;

      // Ensure we catch direct "click-to-jump" skips
      if (
        seekFromRef.current === null &&
        Math.abs(to - lastTimeRef.current) > 0.25
      ) {
        seekFromRef.current = lastTimeRef.current;
      }

      // Use the larger jump: either where the scrubber was dragged (target) or where it resumed (to)
      const effectiveTo =
        Math.abs(target - from) > Math.abs(to - from) ? target : to;
      const signedDelta = effectiveTo - from;
      const delta = Math.abs(signedDelta);

      if (delta > 0.25) {
        if (signedDelta > 0) {
          skippedSoFar.current += delta;
          skippedTimeRef.current += delta;
        } else {
          rewatchedSoFar.current += delta;
          rewatchTimeRef.current += delta;
        }
      }

      if (
        (skippedSoFar.current > skipLimitRef.current ||
          skippedTimeRef.current > skipLimitRef.current) &&
        !warnedRef.current
      ) {
        warnedRef.current = true;
        alert("⚠️ Too much skipping detected. Attendance may not be counted.");
        video.currentTime = from;
      }

      console.log("from:", from, "target:", target, "to:", to);
      console.log("delta:", delta);
      console.log("skipped so far: ", skippedSoFar.current);
      console.log("skiplimit: ", skipLimitRef.current);

      seekFromRef.current = null;
      seekTargetRef.current = null;
      isSeekingRef.current = false;
      lastTimeRef.current = to;
    };

    const handleTimeUpdate = () => {
      if (isSeekingRef.current) return;

      const currentTime = video?.currentTime;
      const delta = currentTime - lastTimeRef.current;

      if (delta > 0 && delta < 2) {
        watchTimeRef.current += delta;
      } else if (delta >= 2) {
        skippedTimeRef.current += delta;
      } else if (delta < 0) {
        rewatchTimeRef.current += -delta;
      }

      setProgress((currentTime / video.duration) * 100);

      // trigger quiz when progress is at 95%
      if (
        !quizCompleted &&
        !showQuiz &&
        video.duration &&
        currentTime >= video.duration * 0.95 &&
        quizzes.length > 0
      ) {
        video.pause();
        setShowQuiz(true);
        setIsQuizOpen(true);
      }

      lastTimeRef.current = currentTime;
    };

    const handleRateChange = () => {
      playbackSpeedRef.current = video.playbackRate;
      if (video.playbackRate > 1.25) {
        video.playbackRate = 1.25; // enforce cap
        alert("⚠️ Playback speed limited to 1.25x for attendance tracking.");
      }
    };

    const handleVisibilityChange = () => {
      isTabActiveRef.current = !document.hidden;
      if (document.hidden) video.pause();
    };

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ratechange", handleRateChange);
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("seeked", handleSeeked);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ratechange", handleRateChange);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("seeked", handleSeeked);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [showQuiz, quizzes, quizCompleted]);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      videoRef.current?.play();
    };
    const handleOffline = () => {
      setIsOnline(false);
      videoRef.current?.pause();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (!videoRef.current) return;

      if (
        videoRef.current.ended ||
        videoRef.current.currentTime >= videoRef.current.duration
      ) {
        clearInterval(interval);
        return;
      }

      if (Date.now() - lastSentRef.current >= 10000) {
        sendProgressToBackend();
        lastSentRef.current = Date.now();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Custom Control Handlers
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      video.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newValue = parseFloat(e.target.value);
    if (newValue <= maxWatched) {
      const duration = videoRef.current?.duration || 0;
      if (videoRef.current) {
        videoRef.current.currentTime = (newValue / 100) * duration;
      }
      setProgress(newValue);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVol = Number(e.target.value);
    setVolume(newVol);
    video.volume = newVol;
    setMuted(newVol === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
  };

  const handleFullscreen = () => {
    if (videoContainerRef.current && !document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen();
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // calls to server
  const sendProgressToBackend = async () => {
    const token = localStorage.getItem("authToken");
    if (!videoRef.current) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const duration = videoRef.current.duration || 0;
    const currentTime = videoRef.current.currentTime;

    try {
      const res = await axios.patch(
        `/students/lectures/${lecture.id}/progress`,
        {
          watched: currentTime >= duration * 0.95,
          watchTime: Math.floor(watchTimeRef.current),
          skippedTime: Math.floor(skippedTimeRef.current),
          rewatchTime: Math.floor(rewatchTimeRef.current),
          playbackSpeed: playbackSpeedRef.current,
          videoDuration: duration,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }
      );

      // console.log("Progress sent to backend:", res.data);
    } catch (err) {
      if ((err as any).name === "CanceledError") {
        console.log("Previous request canceled.");
      } else {
        console.error("Failed to send progress:", err);
      }
    } finally {
      setShouldRefetch((prev) => !prev);
    }
  };

  const markAttendance = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await axios.post(
        `/students/lectures/${lecture.id}/attendance`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Attendance marked:", res.data);
      console.log("message:", res.data.message);

      if (res.data.success) {
        toast.success(res.data.message || "✅ Attendance marked successfully");
      } else {
        toast.error(res.data.message || "❌ Attendance not marked. Try again.");
      }
    } catch (error: any) {
      console.error("Error marking attendance:", error);
      toast.error(
        `⚠️ Error marking attendance: ${error.response.data.message}`
      );
    }
  };

  const handleQuizSubmit = async (
    responses: { quizId: number; answer: string }[]
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `/students/lectures/${lecture.id}/quizzes/submit`,
        { responses },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Quiz submitted:", res.data);

      // if results.reason == already submitted? don't show the quiz

      if (res.data.results.isCorrect) {
        setQuizCompleted(true);
        toast.success("Quiz passed 🎉");
      } else if (res.data.results[0].reason === "Already submitted") {
        setQuizCompleted(true);
        toast.success("Quiz previously completed");
      } else {
        setQuizCompleted(false);
        toast.error("You must pass the quiz to get attendance.");
      }

      setShowQuiz(false);
      setIsQuizOpen(false);
      videoRef.current?.play();
    } catch (error) {
      console.error("Quiz submission failed:", error);
      toast.error("Quiz submission failed, try again.");
      setIsQuizOpen(false);
      setShowQuiz(false);
      videoRef.current?.play();
    }
  };

  return (
    <>
      {!isOnline && (
        <div className="w-full bg-red-200 text-red-500 text-center p-2 z-50 m-auto">
          ⚠️ You are currently offline, check your internet connection.
        </div>
      )}

      {!loaded && !error && (
        <p className="absolute inset-0 flex items-center justify-center text-white">
          Loading video...
        </p>
      )}
      {error && (
        <p className="absolute inset-0 flex items-center justify-center text-red-500">
          Failed to load video. Please try again later.
        </p>
      )}

      <div
        ref={videoContainerRef}
        className="mt-4 w-full aspect-video rounded-lg overflow-hidden bg-black relative group"
      >
        <video
          ref={videoRef}
          className="w-full h-full"
          poster={poster}
          onLoadedData={() => setLoaded(true)}
          onError={() => setError(true)}
          onEnded={() => {
            sendProgressToBackend();
            setIsPlaying(false);
            markAttendance();
          }}
          onSeeked={() => {
            const now = Date.now();
            if (now - lastSentRef.current >= 3000) {
              sendProgressToBackend();
              lastSentRef.current = now;
            }
          }}
          onPlay={() => setIsPaused(false)}
          onPause={() => setIsPaused(true)}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 🔹 Custom Controls */}
        <div
          className="absolute bottom-0 left-0 w-full bg-black/60 
                p-2 sm:p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 
                md:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {/* Top Row (Buttons + Volume) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white">
              {isPaused ? (
                <Play size={18} className="sm:size-8" />
              ) : (
                <Pause size={18} className="sm:size-8" />
              )}
            </button>

            {/* Volume */}
            <button onClick={toggleMute} className="text-white">
              {muted || volume === 0 ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>

            {/* Volume Slider (hidden on very small screens, shown from sm up) */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="hidden sm:block w-20"
            />

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="text-white ml-auto sm:ml-2"
            >
              <Fullscreen size={18} className="sm:size-8" />
            </button>
          </div>

          {/* Progress Bar (full width on mobile) */}
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={handleProgressChange}
            className="w-full cursor-pointer h-1 sm:h-2"
          />
        </div>

        {showQuiz && (
          <QuizModal
            questions={quizzes}
            isOpen={isQuizOpen}
            setQuizCompleted={setQuizCompleted}
            onClose={() => setIsQuizOpen(false)}
            onSubmit={handleQuizSubmit}
          />
        )}
      </div>
    </>
  );
};

export default VideoPlayer;
