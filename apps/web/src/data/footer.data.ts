import { FaDiscord } from "react-icons/fa";
import { LuGithub, LuTwitter } from "react-icons/lu";

export const footerMeta = {
  brand: {
    name: "Hanma",
    description:
      "The backend component library for modern developers. Built to help you ship faster without compromising on code quality or security.",
  },
  copyright: "© 2025 Hanma Inc. All rights reserved.",
};

export const footerLinks = [
  {
    id: "resources",
    title: "Resources",
    links: [
      { label: "Snippets", to: "/docs/snippets/express", type: "internal" },
      { label: "Templates", to: "/docs/templates", type: "internal" },
      { label: "Documentation", to: "/docs", type: "internal" },
      { label: "Blog", href: "#", type: "external" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { label: "About", href: "#", type: "external" },
      {
        label: "Contact",
        href: "https://twitter.com/itstheanurag",
        type: "external",
      },
    ],
  },
];

export const footerSocials = [
  {
    id: "github",
    label: "GitHub",
    icon: LuGithub,
    href: "https://github.com/itstheanurag/hanma",
  },
  {
    id: "twitter",
    label: "Twitter",
    icon: LuTwitter,
    href: "https://twitter.com/itstheanurag",
  },
  {
    id: "discord",
    label: "Discord",
    icon: FaDiscord,
    href: "#",
  },
];
