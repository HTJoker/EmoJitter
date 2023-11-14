import { postRouter } from "./routers/post";
import { profileRouter } from "./routers/profile";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  profile: profileRouter
});

export type AppRouter = typeof appRouter;
