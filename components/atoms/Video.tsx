import { pegasusVideos, structureVideos, vomeroVideos } from "@/utils/data";
import { cn, maximumValue } from "@/utils/helper";
import React, { useEffect, useMemo, useRef, useState } from "react";

type videoPropsType = {
  height?: string;
  width?: string;
  values: {
    comfort: number;
    energy: number;
    response: number;
  };
};

const Video = ({ height, width, values }: videoPropsType) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const renderVideo = useMemo(() => {
    const videos: string[] = [];
    const dominantType = maximumValue(values);

    dominantType.forEach((item: string) => {
      if (item === "Structure") {
        videos.push(...structureVideos);
      } else if (item === "Pegasus") {
        videos.push(...pegasusVideos);
      } else {
        videos.push(...vomeroVideos);
      }
    });

    return videos;
  }, [values, currentVideoIndex]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    const handleEnded = () => {
      if (currentVideoIndex < structureVideos.length - 1) {
        setCurrentVideoIndex((prev) => prev + 1);
      } else {
        setCurrentVideoIndex(0);
      }
    };

    videoElement.addEventListener("ended", handleEnded);
    return () => {
      videoElement.removeEventListener("ended", handleEnded);
    };
  }, [currentVideoIndex]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    videoElement.load();
    videoElement.play();
  }, [currentVideoIndex]);

  return (
    <div className="border-2 border-white ">
      <video
        ref={videoRef}
        autoPlay
        muted
        id="myVideo"
        className={cn("h-[180px] w-[320px]", height, width)}
      >
        <source
          src={
            (renderVideo.length > 0 ? renderVideo : structureVideos)[
              currentVideoIndex
            ]
          }
          type="video/mp4"
        />
        ;
      </video>
    </div>
  );
};

export default Video;
