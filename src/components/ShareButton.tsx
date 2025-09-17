// src/components/ShareButton.tsx

import React from "react";
import html2canvas from "html2canvas";

interface ShareButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
  shareText: string;
  shareUrl: string;
}

export default function ShareButton({
  targetRef,
  shareText,
  shareUrl,
}: ShareButtonProps) {
  const handleShare = async () => {
    // 1. Check for basic Web Share API support
    if (!navigator.share) {
      alert("Sharing is not supported on your browser.");
      return;
    }

    const element = targetRef.current;
    if (!element) {
      console.error("Target element for screenshot not found.");
      return;
    }

    let imageFile: File | null = null;

    // 2. Try to generate a screenshot
    try {
      const canvas = await html2canvas(element, {
        // Optional: Improve image quality
        scale: 2,
        backgroundColor: "#f3f3f7", // Match the section's background
      });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (blob) {
        imageFile = new File([blob], "graph-share.png", { type: "image/png" });
      }
    } catch (error) {
      console.error("Error generating screenshot:", error);
      // Continue without an image if screenshot fails
    }

    const shareData: ShareData = {
      title: "My Progress",
      text: shareText,
      url: shareUrl,
    };

    // 3. Attempt to share WITH the image first
    if (
      imageFile &&
      navigator.canShare &&
      navigator.canShare({ files: [imageFile] })
    ) {
      try {
        await navigator.share({
          ...shareData,
          files: [imageFile],
        });
        console.log("Shared successfully with image!");
        return; // Exit after successful share
      } catch (error) {
        // If sharing with an image fails (e.g., user cancels),
        // we'll fall through to the text-only share below.
        if ((error as DOMException).name === "AbortError") {
          console.log("Share canceled by user.");
          return; // Don't proceed to text-only share if user explicitly canceled
        }
        console.warn(
          "Could not share with image, falling back to text only.",
          error
        );
      }
    }

    // 4. Fallback: If image sharing isn't possible or failed, share text only
    try {
      await navigator.share(shareData);
      console.log("Shared successfully (text only)!");
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") {
        console.error("Error sharing text only:", error);
        alert("Sharing failed. Please try again.");
      } else {
        console.log("Share canceled by user.");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-[#f3f3f7] p-2.5 rounded-lg flex items-center gap-2"
    >
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-share2-icon lucide-share-2 size-5"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
      </span>
    </button>
  );
}
