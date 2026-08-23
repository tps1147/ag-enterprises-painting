"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const MASTER_VIDEO = "/scroll-world/ag-paint-world-v1.mp4";
const MOBILE_VIDEO = "/scroll-world/ag-paint-world-mobile-v1.mp4";
const POSTER_IMAGE = "/world/v1/01-arrival.webp";
const MOBILE_POSTER_IMAGE = "/world/v1/01-arrival-mobile.webp";

const worldCues = [
  { key: "arrival", fraction: 0 },
  { key: "services", fraction: 1 / 9 },
  { key: "inspection", fraction: 2 / 9 },
  { key: "repair", fraction: 4 / 9 },
  { key: "paint", fraction: 5 / 9 },
  { key: "gallery", fraction: 6 / 9 },
  { key: "andrew", fraction: 7 / 9 },
  { key: "neighborhood", fraction: 8 / 9 },
  { key: "questions", fraction: 8 / 9 },
  { key: "closing", fraction: 1 },
] as const;

type ConnectionWithDataSaver = {
  effectiveType?: string;
  saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

type MeasuredCue = {
  fraction: number;
  scrollPoint: number;
};

function getConnection(): ConnectionWithDataSaver | undefined {
  return (navigator as Navigator & {
    connection?: ConnectionWithDataSaver;
    mozConnection?: ConnectionWithDataSaver;
    webkitConnection?: ConnectionWithDataSaver;
  }).connection
    ?? (navigator as Navigator & { mozConnection?: ConnectionWithDataSaver }).mozConnection
    ?? (navigator as Navigator & { webkitConnection?: ConnectionWithDataSaver }).webkitConnection;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function interpolateFraction(scrollY: number, cues: MeasuredCue[]) {
  if (!cues.length || scrollY <= cues[0].scrollPoint) return cues[0]?.fraction ?? 0;

  for (let index = 1; index < cues.length; index += 1) {
    const previous = cues[index - 1];
    const next = cues[index];
    if (scrollY <= next.scrollPoint) {
      const distance = Math.max(1, next.scrollPoint - previous.scrollPoint);
      const localProgress = clamp((scrollY - previous.scrollPoint) / distance, 0, 1);
      return previous.fraction + (next.fraction - previous.fraction) * localProgress;
    }
  }

  return cues.at(-1)?.fraction ?? 1;
}

export default function ContinuousWorldStage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cuePointsRef = useRef<MeasuredCue[]>([]);
  const targetTimeRef = useRef(0);
  const metadataReadyRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedDataQuery = window.matchMedia("(prefers-reduced-data: reduce)");
    const portraitQuery = window.matchMedia("(max-width: 900px) and (orientation: portrait)");
    const connection = getConnection();

    const markerByKey = new Map<string, HTMLElement>();
    document.querySelectorAll<HTMLElement>("[data-world-frame]").forEach((marker) => {
      const key = marker.dataset.worldFrame;
      if (key && !markerByKey.has(key)) markerByKey.set(key, marker);
    });

    const measureCues = () => {
      const headerHeight = document.querySelector<HTMLElement>(".site-header")?.getBoundingClientRect().height ?? 0;
      const readingLine = headerHeight + Math.max(0, window.innerHeight - headerHeight) * 0.48;

      cuePointsRef.current = worldCues.flatMap((cue, index) => {
        const marker = markerByKey.get(cue.key);
        if (!marker) return [];
        const rect = marker.getBoundingClientRect();
        const documentTop = window.scrollY + rect.top;
        const chapterFocus = index === 0 ? documentTop : documentTop + rect.height * 0.5;
        return [{
          fraction: cue.fraction,
          scrollPoint: index === 0 ? 0 : Math.max(0, chapterFocus - readingLine),
        }];
      });
    };

    let scrollFrame = 0;
    let seekFrame = 0;
    let resizeFrame = 0;
    let revealFrame = 0;
    let lastSeekAt = 0;
    let activeVideoSource: string | null = null;
    const failedSources = new Set<string>();

    const hideVideo = () => {
      root.dataset.ready = "false";
    };

    const revealVideo = () => {
      if (root.dataset.ready === "true" || revealFrame) return;
      revealFrame = window.requestAnimationFrame(() => {
        revealFrame = 0;
        if (metadataReadyRef.current) root.dataset.ready = "true";
      });
    };

    const calculateTargetTime = () => {
      const fraction = interpolateFraction(window.scrollY, cuePointsRef.current);
      return clamp(fraction * Math.max(0, video.duration - 1 / 24), 0, video.duration);
    };

    const seekTowardTarget = (timestamp: number) => {
      seekFrame = 0;
      if (!metadataReadyRef.current || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const difference = targetTimeRef.current - video.currentTime;
      if (Math.abs(difference) <= 1 / 120) return;

      if (timestamp - lastSeekAt >= 30) {
        const nextTime = Math.abs(difference) < 1 / 24
          ? targetTimeRef.current
          : video.currentTime + difference * 0.24;
        video.currentTime = clamp(nextTime, 0, Math.max(0, video.duration - 1 / 24));
        lastSeekAt = timestamp;
      }

      seekFrame = window.requestAnimationFrame(seekTowardTarget);
    };

    const updateTarget = () => {
      scrollFrame = 0;
      if (!metadataReadyRef.current || !Number.isFinite(video.duration)) return;
      targetTimeRef.current = calculateTargetTime();
      if (!seekFrame) seekFrame = window.requestAnimationFrame(seekTowardTarget);
    };

    const queueTargetUpdate = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateTarget);
    };

    const queueMeasurement = () => {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        measureCues();
        updateTarget();
      });
    };

    const handleMetadata = () => {
      metadataReadyRef.current = true;
      measureCues();
      root.dataset.motion = "video";
      targetTimeRef.current = calculateTargetTime();

      if (Math.abs(video.currentTime - targetTimeRef.current) > 1 / 120) {
        video.currentTime = targetTimeRef.current;
      } else if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        revealVideo();
      }
    };

    const revealIfTargetFrameIsReady = () => {
      if (
        metadataReadyRef.current
        && Math.abs(video.currentTime - targetTimeRef.current) <= 1 / 12
      ) {
        revealVideo();
      }
    };

    const handleVideoError = () => {
      if (activeVideoSource) failedSources.add(activeVideoSource);
      activeVideoSource = null;
      metadataReadyRef.current = false;
      hideVideo();
      root.dataset.motion = "static";
      video.removeAttribute("src");
      video.load();
    };

    const shouldUseStaticFallback = () => {
      const constrainedConnection = ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
      return reducedMotionQuery.matches
        || reducedDataQuery.matches
        || connection?.saveData === true
        || constrainedConnection;
    };

    const syncPlaybackPolicy = () => {
      if (shouldUseStaticFallback()) {
        if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
        if (seekFrame) window.cancelAnimationFrame(seekFrame);
        scrollFrame = 0;
        seekFrame = 0;
        activeVideoSource = null;
        metadataReadyRef.current = false;
        targetTimeRef.current = 0;
        hideVideo();
        root.dataset.motion = "static";
        video.pause();
        video.removeAttribute("src");
        video.load();
        return;
      }

      const nextSource = portraitQuery.matches ? MOBILE_VIDEO : MASTER_VIDEO;
      if (activeVideoSource === nextSource || failedSources.has(nextSource)) {
        if (failedSources.has(nextSource)) root.dataset.motion = "static";
        return;
      }

      activeVideoSource = nextSource;
      metadataReadyRef.current = false;
      hideVideo();
      root.dataset.motion = "loading";
      video.src = nextSource;
      video.load();
    };

    const resizeObserver = typeof window.ResizeObserver === "function"
      ? new ResizeObserver(queueMeasurement)
      : null;

    markerByKey.forEach((marker) => resizeObserver?.observe(marker));
    const journey = document.querySelector<HTMLElement>(".world-journey");
    if (journey) resizeObserver?.observe(journey);

    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("loadeddata", revealIfTargetFrameIsReady);
    video.addEventListener("seeked", revealIfTargetFrameIsReady);
    video.addEventListener("error", handleVideoError);
    window.addEventListener("scroll", queueTargetUpdate, { passive: true });
    window.addEventListener("resize", queueMeasurement);
    window.addEventListener("orientationchange", queueMeasurement);
    window.addEventListener("hashchange", queueMeasurement);
    reducedMotionQuery.addEventListener("change", syncPlaybackPolicy);
    reducedDataQuery.addEventListener("change", syncPlaybackPolicy);
    portraitQuery.addEventListener("change", syncPlaybackPolicy);
    connection?.addEventListener?.("change", syncPlaybackPolicy);

    syncPlaybackPolicy();

    return () => {
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (seekFrame) window.cancelAnimationFrame(seekFrame);
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      if (revealFrame) window.cancelAnimationFrame(revealFrame);
      resizeObserver?.disconnect();
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("loadeddata", revealIfTargetFrameIsReady);
      video.removeEventListener("seeked", revealIfTargetFrameIsReady);
      video.removeEventListener("error", handleVideoError);
      window.removeEventListener("scroll", queueTargetUpdate);
      window.removeEventListener("resize", queueMeasurement);
      window.removeEventListener("orientationchange", queueMeasurement);
      window.removeEventListener("hashchange", queueMeasurement);
      reducedMotionQuery.removeEventListener("change", syncPlaybackPolicy);
      reducedDataQuery.removeEventListener("change", syncPlaybackPolicy);
      portraitQuery.removeEventListener("change", syncPlaybackPolicy);
      connection?.removeEventListener?.("change", syncPlaybackPolicy);
      metadataReadyRef.current = false;
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  return (
    <div
      className="world-stage continuous-world-stage"
      data-motion="checking"
      data-ready="false"
      aria-hidden="true"
      ref={rootRef}
    >
      <picture className="world-video-poster">
        <source media="(max-width: 900px) and (orientation: portrait)" srcSet={MOBILE_POSTER_IMAGE} />
        <Image
          className="world-video-poster-image"
          src={POSTER_IMAGE}
          alt=""
          fill
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
        />
      </picture>
      <video
        className="world-master-video"
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
      />
      <div className="world-frame-wash" />
      <div className="world-frame-grain" />
    </div>
  );
}
