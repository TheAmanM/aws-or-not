// src/components/GenericShareButton.tsx

import React, { useState } from "react";
import html2canvas from "html2canvas";
import ShareModal from "./ShareModal";

interface GenericShareButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
}

export default function GenericShareButton({
  targetRef,
}: GenericShareButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const shareText = "How well do you know AWS? https://aws.amanmeherally.com";
  const shareUrl = "https://aws.amanmeherally.com";
  const shareTitle = "How well do you know AWS?";

  const handleShare = async () => {
    if (navigator.share) {
      const element = targetRef.current;
      let imageFile: File | null = null;

      if (element) {
        try {
          const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: "#f3f3f7",
          });
          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/png")
          );
          if (blob) {
            imageFile = new File([blob], "share-screenshot.png", {
              type: "image/png",
            });
          }
        } catch (error) {
          console.error("Screenshot failed:", error);
        }
      }

      if (
        imageFile &&
        navigator.canShare &&
        navigator.canShare({ files: [imageFile] })
      ) {
        try {
          await navigator.share({
            title: shareTitle,
            url: shareUrl,
            files: [imageFile],
          });
          console.log("Shared successfully with image!");
          return;
        } catch (error) {
          if ((error as DOMException).name === "AbortError")
            return console.log("Share cancelled.");
          console.warn("Sharing with image failed, falling back.", error);
        }
      }

      try {
        await navigator.share({
          url: shareUrl,
        });
        console.log("Shared successfully without image!");
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") {
          console.error("Final share attempt failed:", error);
        } else {
          console.log("Share cancelled.");
        }
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="bg-[#f3f3f7] p-2.5 rounded-lg flex items-center gap-2 dark:bg-[#2a2a36] dark:text-white"
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
            className="lucide lucide-share2-icon lucide-share-2"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
          </svg>
        </span>
      </button>

      {isModalOpen && (
        <ShareModal
          url={shareUrl}
          title={shareTitle}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
