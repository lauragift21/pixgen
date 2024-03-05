import { Hono } from "hono";
import { Ai } from "@cloudflare/ai";
import template from "./template.html";

type Bindings = {
  AI: any;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.html(template);
});

app.post("/generate", async (c) => {
  const body = await c.req.json();
  const prompt = body.prompt;
  console.log(prompt);
  const ai = new Ai(c.env.AI);

  const inputs = {
    prompt: prompt,
  };

  try {
    const response = await ai.run('@cf/lykon/dreamshaper-8-lcm',
      inputs
    );

     const buffer = response.buffer;
     // Set the content type to image/png
     c.res.headers.set('Content-Type', 'image/png');
     return new Response(buffer);
  } catch (err: any) {
    console.error("Error:", err);
    return c.json({ ...err, success: false });
  }
});

app.notFound((c) => {
  return c.text("404: The page you requested does not exist", 404);
});

export default app;
