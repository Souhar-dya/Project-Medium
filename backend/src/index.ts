import { Hono } from "hono";
import book from "./routes/route";
import env from "dotenv";
import { cors } from "hono/cors";

const app = new Hono();
app.use("/*", cors());

app.route("/app/v1", book);

app.notFound((c) => {
  return c.html(
    `
    <html>
  <head><title>404 Not Found</title></head>
  <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; flex-direction: column; text-align: center;">
    <h1>404</h1>
    <p>The page you're looking for doesn't exist.</p>
  </body>
</html>

  `,
    404
  );
});

export default app;
