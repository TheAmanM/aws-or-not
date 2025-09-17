// src/components/ShareModal.tsx

import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  XIcon,
  LinkedinIcon,
  EmailIcon,
} from "react-share";

// Basic styling for the modal
const modalStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyles: React.CSSProperties = {
  background: "white",
  padding: "20px 40px",
  borderRadius: "12px",
  textAlign: "center",
};

const iconContainerStyles: React.CSSProperties = {
  display: "flex",
  gap: "15px",
  marginTop: "20px",
};

interface ShareModalProps {
  url: string;
  title: string;
  onClose: () => void; // Function to close the modal
}

export default function ShareModal({ url, title, onClose }: ShareModalProps) {
  const iconSize = 48;

  return (
    <div style={modalStyles} onClick={onClose}>
      <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
        <h3>Share this page</h3>
        <div style={iconContainerStyles}>
          <WhatsappShareButton url={url} title={title} separator=" :: ">
            <WhatsappIcon size={iconSize} round />
          </WhatsappShareButton>
          <FacebookShareButton url={url}>
            <FacebookIcon size={iconSize} round />
          </FacebookShareButton>
          <TwitterShareButton url={url} title={title}>
            <XIcon size={iconSize} round />
          </TwitterShareButton>
          <LinkedinShareButton url={url} title={title}>
            <LinkedinIcon size={iconSize} round />
          </LinkedinShareButton>
          <EmailShareButton url={url} subject={title}>
            <EmailIcon size={iconSize} round />
          </EmailShareButton>
        </div>
      </div>
    </div>
  );
}
