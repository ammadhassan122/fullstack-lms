"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { VideoOff } from "lucide-react";
import { getMuxSignedTokens } from "@/lib/actions/mux";

interface MuxVideoPlayerProps {
  playbackId: string | null | undefined;
  title?: string;
  className?: string;
}

interface MuxTokens {
  playback: string;
  thumbnail: string;
  storyboard: string;
}

export function MuxVideoPlayer({
  playbackId,
  title,
  className,
}: MuxVideoPlayerProps) {
  const [tokens, setTokens] = useState<MuxTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log("DEBUG - MuxVideoPlayer initialized with playbackId:", playbackId);
  }, [playbackId]);

  useEffect(() => {
    if (!playbackId) {
      console.warn("DEBUG - No playbackId provided to MuxVideoPlayer");
      setIsLoading(false);
      return;
    }

    async function fetchTokens() {
      console.log("DEBUG - Fetching tokens for playbackId:", playbackId);
      try {
        const result = await getMuxSignedTokens(playbackId as string);
        console.log("DEBUG - Token fetch result:", {
          hasPlaybackToken: !!result.playbackToken,
          error: result.error,
          debug: result.debug,
        });

        if (
          result.playbackToken &&
          result.thumbnailToken &&
          result.storyboardToken
        ) {
          console.log("DEBUG - Tokens generated successfully");
          setTokens({
            playback: result.playbackToken,
            thumbnail: result.thumbnailToken,
            storyboard: result.storyboardToken,
          });
        } else {
          const errorMsg =
            [result.error, result.debug].filter(Boolean).join("\n") ||
            "Failed to generate playback tokens.";
          console.error("DEBUG - Token generation failed:", errorMsg);
          setTokenError(errorMsg);
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to generate playback tokens.";
        console.error("DEBUG - Token fetch error:", errorMsg);
        setTokenError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokens();
  }, [playbackId]);

  if (!playbackId) {
    return (
      <div
        className={`aspect-video bg-zinc-900 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">No video available</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`aspect-video bg-zinc-900 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-3 animate-pulse" />
          <p className="text-zinc-500">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!tokens) {
    return (
      <div
        className={`aspect-video bg-zinc-900 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center max-w-lg px-4">
          <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500 mb-2">
            Video unavailable. Playback token could not be generated.
          </p>
          {tokenError && (
            <p className="text-xs text-red-400 whitespace-pre-wrap">
              {tokenError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MuxPlayer
        playbackId={playbackId}
        tokens={tokens}
        metadata={{
          video_title: title ?? "Lesson video",
        }}
        streamType="on-demand"
        autoPlay={false}
        className="w-full aspect-video rounded-xl overflow-hidden"
        accentColor="#8b5cf6"
        onError={() => {
          // Error handling - player will show its own error UI
        }}
      />
    </div>
  );
}
