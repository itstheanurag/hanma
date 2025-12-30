import { BiHeart, BiUser } from "react-icons/bi";
import { FiMessageCircle } from "react-icons/fi";

export const communityMeta = {
  badge: {
    label: "Open Source Community",
    icon: BiHeart,
    iconClass: "text-red-500",
  },
  heading: "Join the developers building the future.",
  description:
    "Hanma is community-driven. Join our Discord to discuss architecture, request snippets, or show off what you've built.",
};

export const communityActions = [
  {
    id: "discord",
    label: "Discord (soon)",
    icon: FiMessageCircle,
    className:
      "bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-indigo-500/20",
  },
  {
    id: "contributors",
    label: "View Contributors",
    icon: BiUser,
    path: "/contributors",
    className:
      "bg-background text-foreground border border-border hover:bg-surface-hover",
  },
];

export const communityMessages = [
  {
    id: 1,
    user: {
      name: "John Doe",
      initials: "JD",
      avatarColor: "bg-blue-500",
    },
    time: "Today at 10:42 AM",
    message: "Has anyone tried the new Rate Limiter with Redis Cluster?",
    reactions: [],
  },
  {
    id: 2,
    user: {
      name: "Sarah A.",
      initials: "SA",
      avatarColor: "bg-green-500",
    },
    time: "Today at 10:45 AM",
    message:
      "Yes! It works seamlessly. The new adapter pattern makes it super easy to switch.",
    reactions: [
      { label: "Upvotes", count: 2 },
      { label: "Highlights", count: 1 },
    ],
  },
];
