import React from "react";
import { usePosthog } from "../hooks/usePosthog";

type FooterLink = {
  label: string;
  href: string;
};

type FooterProps = {
  links?: FooterLink[];
  className?: string;
};

const defaultLinks: FooterLink[] = [
  { label: "portfolio", href: "https://amanmeherally.com" },
  { label: "github", href: "https://github.com/TheAmanM/docs" },
  { label: "linkedin", href: "https://linkedin.com/in/aman-meherally" },
];

export default function Footer({
  links = defaultLinks,
  className = "flex items-center justify-center gap-2.5 py-2 lg:py-3 text-[#888] lg:text-xl",
}: FooterProps) {
  const { captureLinkClick } = usePosthog();
  return (
    <footer className={className}>
      {links.map((link, idx) => (
        <React.Fragment key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              captureLinkClick(link.label);
            }}
          >
            {link.label}
          </a>
          {idx < links.length - 1 && " • "}
        </React.Fragment>
      ))}
    </footer>
  );
}
