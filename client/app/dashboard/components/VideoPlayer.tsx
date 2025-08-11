"use client";
import React, { useEffect, useRef } from "react";

type VideoPlayerProps = {
  src: string;
  poster?: string;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      console.log("Video Duration: ", videoElement.duration);
    };

    videoElement?.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      videoElement?.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
      <video ref={videoRef} controls className="w-full h-full" poster={poster}>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
