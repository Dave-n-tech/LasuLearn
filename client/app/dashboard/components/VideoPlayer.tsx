"use client";
import axios from "@/app/api/axios";
import { CourseLecture } from "@/app/types";
import React, { useEffect, useRef, useState } from "react";
import { useStudentDashboard } from "../student/context/studentContext";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  lecture: CourseLecture;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, lecture }) => {
  const { setShouldRefetch } = useStudentDashboard();
  const videoRef = useRef<HTMLVideoElement>(null);

  const watchTimeRef = useRef(0);
  const skippedTimeRef = useRef(0);
  const playbackSpeedRef = useRef(1.0);
  const rewatchTimeRef = useRef(0);

  const lastTimeRef = useRef(0);
  const isTabActiveRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastSentRef = useRef(Date.now());

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video?.currentTime;
      const delta = currentTime - lastTimeRef.current;

      if (delta > 0 && delta < 2) {
        watchTimeRef.current += delta;
      } else if (delta >= 2) {
        skippedTimeRef.current += delta;
      } else if (delta < 0) {
        rewatchTimeRef.current += -delta;
      }

      lastTimeRef.current = currentTime;
    };

    const handleRateChange = () => {
      playbackSpeedRef.current = video.playbackRate;
    };

    const handleVisibilityChange = () => {
      isTabActiveRef.current = !document.hidden;
      if (document.hidden) video.pause();
    };

    video?.addEventListener("timeupdate", handleTimeUpdate);
    video?.addEventListener("ratechange", handleRateChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      video?.removeEventListener("timeupdate", handleTimeUpdate);
      video?.removeEventListener("ratechange", handleRateChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!videoRef.current) return;

      if (Date.now() - lastSentRef.current >= 10000) {
        sendProgressToBackend();
        lastSentRef.current = Date.now();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

      console.log("Progress sent to backend:", res.data);
      console.log(duration);
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

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
      <video
        ref={videoRef}
        controls
        className="w-full h-full"
        poster={poster}
        onEnded={sendProgressToBackend}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
