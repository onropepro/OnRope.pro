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
      <path d="M17 6a5 5 0 0 0-5-5 5 5 0 0 0-5 5v10a5 5 0 0 0 5 5 5 5 0 0 0 5-5V6Z" />
      <path d="M17 16V6a5 5 0 0 1-5 5" />
      <line x1="19" y1="8" x2="22" y2="8" />
      <line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  );
}
