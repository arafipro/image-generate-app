import { getRequestContext } from "@cloudflare/next-on-pages";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

type Input = {
  prompt: string;
};

const app = new Hono<{ Bindings: CloudflareEnv }>().basePath("/api");

app.post("/", async (c) => {
  const { env } = getRequestContext();
  const { prompt } = await c.req.json<Input>();
  const inputs = {
    prompt: prompt,
  };
  const response = await env.AI.run(
    "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    inputs
  );
  return new Response(response, {
    headers: {
      "content-type": "image/png",
    },
  });
});

export const POST = handle(app);
