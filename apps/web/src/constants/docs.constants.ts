import { SiExpress, SiFastify, SiHono, SiNestjs } from "react-icons/si";
import { LuZap } from "react-icons/lu";

import type { FrameworkType } from "@/types/docs";

export const FRAMEWORKS = [
  { id: "express" as FrameworkType, label: "Express", icon: SiExpress },
  { id: "hono" as FrameworkType, label: "Hono", icon: SiHono },
  { id: "elysia" as FrameworkType, label: "Elysia", icon: LuZap },
  { id: "fastify" as FrameworkType, label: "Fastify", icon: SiFastify },
  { id: "nest" as FrameworkType, label: "NestJS", icon: SiNestjs },
] as const;

export const TEMPLATE_FRAMEWORKS = [
  { id: "express" as FrameworkType, label: "Express", icon: SiExpress },
  { id: "hono" as FrameworkType, label: "Hono", icon: SiHono },
  { id: "elysia" as FrameworkType, label: "Elysia", icon: LuZap },
] as const;

export type FrameworkConfig = (typeof FRAMEWORKS)[number];
