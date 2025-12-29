import type { LucideProps } from "lucide-react";

export function CarabinerIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* D-shaped carabiner body */}
      <path d="M7 5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V5Z" />
      {/* Gate - the spring-loaded opening mechanism */}
      <path d="M17 6v6" />
      <path d="M17 6c1.5 0 2 1 2 2v2c0 1-0.5 2-2 2" />
      {/* Gate hinge indicator */}
      <circle cx="17" cy="6" r="0.5" fill="currentColor" />
    </svg>
  );
}
