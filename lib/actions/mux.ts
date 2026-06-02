"use server";

import Mux from "@mux/mux-node";
import { writeClient } from "@/sanity/lib/client";

const MUX_TOKEN_ID =
  process.env.MUX_TOKEN_ID || process.env.SANITY_STUDIO_MUX_TOKEN_ID;
const MUX_TOKEN_SECRET =
  process.env.MUX_TOKEN_SECRET || process.env.SANITY_STUDIO_MUX_SECRET_KEY;

const mux = new Mux({
  tokenId: MUX_TOKEN_ID,
  tokenSecret: MUX_TOKEN_SECRET,
});

interface CreateUploadResult {
  uploadUrl: string | null;
  uploadId: string | null;
  error?: string;
}

export async function createMuxUploadUrl(): Promise<CreateUploadResult> {
  if (!MUX_TOKEN_ID) {
    return {
      uploadUrl: null,
      uploadId: null,
      error: "Mux token ID is not configured",
    };
  }

  if (!MUX_TOKEN_SECRET) {
    return {
      uploadUrl: null,
      uploadId: null,
      error: "Mux secret key is not configured",
    };
  }

  try {
    const upload = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["signed"],
        video_quality: "plus",
        inputs: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English CC",
              },
            ],
          },
        ],
      },
    });

    return {
      uploadUrl: (upload.url ?? null) as string | null,
      uploadId: (upload.id ?? null) as string | null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create upload URL";

    console.error("Mux upload URL creation error:", error);
    return { uploadUrl: null, uploadId: null, error: errorMessage };
  }
}

interface MuxAssetStatus {
  status: "waiting" | "preparing" | "ready" | "errored" | null;
  playbackId: string | null;
  assetId: string | null;
  sanityAssetId: string | null;
  error?: string;
}

export async function getMuxUploadStatus(
  uploadId: string
): Promise<MuxAssetStatus> {
  if (!MUX_TOKEN_ID) {
    return {
      status: null,
      playbackId: null,
      assetId: null,
      sanityAssetId: null,
      error: "Mux token ID is not configured",
    };
  }

  if (!MUX_TOKEN_SECRET) {
    return {
      status: null,
      playbackId: null,
      assetId: null,
      sanityAssetId: null,
      error: "Mux secret key is not configured",
    };
  }

  try {
    const upload = await mux.video.uploads.retrieve(uploadId);

    if (upload.asset_id) {
      const asset = await mux.video.assets.retrieve(upload.asset_id);
      const signedPlayback = asset.playback_ids?.find(
        (p) => p.policy === "signed"
      );

      // If asset is ready, create/update the Sanity mux.videoAsset document
      if (asset.status === "ready" && signedPlayback) {
        // Generate a UUID for the Sanity document (matching plugin format)
        const sanityAssetId = crypto.randomUUID();

        // Create the mux.videoAsset document in Sanity
        // Structure matches what sanity-plugin-mux-input creates
        await writeClient.createOrReplace({
          _id: sanityAssetId,
          _type: "mux.videoAsset",
          status: asset.status,
          assetId: asset.id,
          playbackId: signedPlayback.id,
          uploadId: asset.upload_id,
          data: {
            aspect_ratio: asset.aspect_ratio,
            created_at: asset.created_at,
            duration: asset.duration,
            encoding_tier: asset.encoding_tier,
            id: asset.id,
            ingest_type: asset.ingest_type,
            master_access: asset.master_access,
            max_resolution_tier: asset.max_resolution_tier,
            max_stored_frame_rate: asset.max_stored_frame_rate,
            max_stored_resolution: asset.max_stored_resolution,
            mp4_support: asset.mp4_support,
            passthrough: sanityAssetId,
            playback_ids: asset.playback_ids?.map((p) => ({
              id: p.id,
              policy: p.policy,
            })),
            resolution_tier: asset.resolution_tier,
            status: asset.status,
            tracks: asset.tracks,
            upload_id: asset.upload_id,
            video_quality: asset.video_quality,
          },
        });

        return {
          status: asset.status as MuxAssetStatus["status"],
          playbackId: signedPlayback.id,
          assetId: asset.id,
          sanityAssetId,
        };
      }

      return {
        status: asset.status as MuxAssetStatus["status"],
        playbackId: signedPlayback?.id ?? null,
        assetId: asset.id,
        sanityAssetId: null,
      };
    }

    return {
      status: "waiting",
      playbackId: null,
      assetId: null,
      sanityAssetId: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get upload status";

    return {
      status: null,
      playbackId: null,
      assetId: null,
      sanityAssetId: null,
      error: errorMessage,
    };
  }
}

interface MuxTokensResult {
  playbackToken: string | null;
  thumbnailToken: string | null;
  storyboardToken: string | null;
  error?: string;
  debug?: string;
}

export async function getMuxSignedTokens(
  playbackId: string | null | undefined
): Promise<MuxTokensResult> {
  const signingKey =
    process.env.MUX_SIGNING_KEY || process.env.SANITY_STUDIO_MUX_SIGNING_KEY;
  const signingKeyId =
    process.env.MUX_SIGNING_KEY_ID || process.env.SANITY_STUDIO_MUX_SIGNING_KEY_ID;

  if (!signingKey || !signingKeyId) {
    return {
      playbackToken: null,
      thumbnailToken: null,
      storyboardToken: null,
      error: "Mux signing keys are not configured",
      debug:
        `Missing: ${!signingKey ? "MUX_SIGNING_KEY" : ""} ${!signingKeyId ? "MUX_SIGNING_KEY_ID" : ""}`.trim(),
    };
  }

  if (!playbackId) {
    return {
      playbackToken: null,
      thumbnailToken: null,
      storyboardToken: null,
      error: "playbackId is required",
    };
  }

  try {
    console.log("DEBUG - generateSignedTokens: Starting token generation for playbackId:", playbackId);
    console.log("DEBUG - Signing key ID:", signingKeyId);

    // Decode the Base64 signing key to get the PEM-formatted private key
    let decodedKey: string;
    try {
      const cleanSigningKey = signingKey.replace(/['"]+/g, "").trim();
      decodedKey = Buffer.from(cleanSigningKey, "base64").toString("utf-8");
      console.log("DEBUG - Successfully decoded Base64 signing key");
    } catch (decodeError) {
      console.error("DEBUG - Failed to decode Base64 signing key:", decodeError);
      decodedKey = signingKey;
    }

    // Use the already-initialized Mux client
    const playbackToken = mux.jwt.signPlaybackId(playbackId, {
      keyId: signingKeyId,
      keySecret: decodedKey,
      type: "video",
    });

    console.log("DEBUG - Playback token generated successfully, length:", playbackToken.length);

    // Generate thumbnail token (same playback ID with different audience)
    const thumbnailToken = mux.jwt.signPlaybackId(playbackId, {
      keyId: signingKeyId,
      keySecret: decodedKey,
      type: "thumbnail",
    });

    console.log("DEBUG - Thumbnail token generated successfully, length:", thumbnailToken.length);

    // Generate storyboard token (same playback ID with different audience)
    const storyboardToken = mux.jwt.signPlaybackId(playbackId, {
      keyId: signingKeyId,
      keySecret: decodedKey,
      type: "storyboard",
    });

    console.log("DEBUG - Storyboard token generated successfully, length:", storyboardToken.length);

    return { playbackToken, thumbnailToken, storyboardToken };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to generate signed tokens";

    console.error("DEBUG - Token generation error:", errorMessage);
    console.error("DEBUG - Full error:", error);

    return {
      playbackToken: null,
      thumbnailToken: null,
      storyboardToken: null,
      error: errorMessage,
      debug: error instanceof Error ? error.stack : String(error),
    };
  }
}

// Legacy function for backwards compatibility
export async function getMuxSignedToken(
  playbackId: string | null | undefined
): Promise<{ token: string | null; error?: string; debug?: string }> {
  const result = await getMuxSignedTokens(playbackId);
  return {
    token: result.playbackToken,
    error: result.error,
    debug: result.debug,
  };
}
