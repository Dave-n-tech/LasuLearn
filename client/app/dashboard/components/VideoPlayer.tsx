"use client";
import React from "react";

type VideoPlayerProps = {
  src: string;
  poster?: string;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
      <video
        controls
        className="w-full h-full"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
