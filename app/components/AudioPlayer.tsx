"use client";

import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store"; // For TypeScript
import { openLoginModal } from "@/app/redux/modalSlice";

interface AudioPlayerProps {
  audioLink: string;
  imageLink: string;
  title: string;
  author: string;
  isLoading: boolean;
}

export default function AudioPlayer({
  audioLink,
  imageLink,
  title,
  author,
  isLoading,
}: AudioPlayerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn); // Check if user is logged in
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref for the audio element
  const [isPlaying, setIsPlaying] = useState(false); // State to track if audio is playing
  const [currentTime, setCurrentTime] = useState(0); // State for current time
  const [duration, setDuration] = useState(0); // State for total duration

  const handleOpenLoginModal = () => {
    dispatch(openLoginModal()); // Dispatch the action to open the login modal
  };

  const handlePlayPause = () => {
    if (!isLoggedIn) {
      handleOpenLoginModal();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = (seconds: number) => {
    if (!isLoggedIn) {
      handleOpenLoginModal();
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        Math.max(audioRef.current.currentTime + seconds, 0),
        duration
      );
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoggedIn) {
      handleOpenLoginModal();
      return;
    }

    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);

      // Update progress bar color
      const progressPercentage = (newTime / duration) * 100;
      e.target.style.setProperty("--range-progress", `${progressPercentage}%`);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // if (isLoading) {

  return (
    <div className="audio__wrapper">
      
      <audio
        ref={audioRef}
        src={audioLink}
        onTimeUpdate={() =>
          setCurrentTime(audioRef.current ? audioRef.current.currentTime : 0)
        }
        onLoadedMetadata={() =>
          setDuration(audioRef.current ? audioRef.current.duration : 0)
        }
      ></audio>

      {isLoading ? (
        <div className="audio__track--wrapper">
          <figure className="audio__track--image-mask">
            <div
              className="skeleton"
              style={{ width: "48px", height: "48px" }}
            ></div>
          </figure>
          <div className="audio__track--details-wrapper">
            <div
              className="skeleton"
              style={{
                width: "50px",
                height: "16px",
                marginBottom: "8px",
              }}
            ></div>
            <div
              className="skeleton"
              style={{
                width: "100px",
                height: "16px",
              }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="audio__track--wrapper">
          <figure className="audio__track--image-mask">
            <figure className="h-[48px] w-[48px] min-w-[48px]">
              <img src={imageLink || "/placeholder-image.png"} />
            </figure>
          </figure>
          <div className="audio__track--details-wrapper">
            <div className="audio__track--title">{title || "Loading..."}</div>
            <div className="audio__track--author">{author || "Loading..."}</div>
          </div>
        </div>
      )}

      <div className="audio__controls--wrapper">
        <div className="audio__controls">
          <button
            className="audio__controls--btn 10secs-backward"
            onClick={() => handleSkip(-10)}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="#000"
                strokeWidth="2"
                d="M3.11111111,7.55555556 C4.66955145,4.26701301 8.0700311,2 12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 L12,22 C6.4771525,22 2,17.5228475 2,12 M2,4 L2,8 L6,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"
              ></path>
            </svg>
          </button>
          <button
            className="audio__controls--btn audio__controls--btn-play"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M224 432h-80V80h80zm144 0h-80V80h80z"></path>
              </svg>
            ) : (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className="audio__controls--play-icon"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M96 448l320-192L96 64v384z"></path>
              </svg>
            )}
          </button>
          <button
            className="audio__controls--btn 10secs-forward"
            onClick={() => handleSkip(10)}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="#000"
                strokeWidth="2"
                d="M20.8888889,7.55555556 C19.3304485,4.26701301 15.9299689,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 L12,22 C17.5228475,22 22,17.5228475 22,12 M22,4 L22,8 L18,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="audio__progress--wrapper">
        <div className="audio__time place">{formatTime(currentTime)}</div>
        <input
          type="range"
          className="audio__progress--bar"
          value={currentTime}
          max={duration}
          onChange={handleProgressChange}
        />
        <div className="audio__time total">{formatTime(duration)}</div>
      </div>
    </div>
  );
}
