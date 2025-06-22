import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import {
  signUpInput,
  signInInput,
  createBlogInput,
  changeBlogInput,
} from "@souhardyak/project-medium";

const book = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    userName : string;
  };
}>();

book.get("/user/me", async (c) => {
  try {
    const authHeader = c.req.header("Authorization") || "";
    const token = authHeader.split(" ")[1];

    const payload = await verify(token, c.env.JWT_SECRET) as { id: string; name: string };

    return c.json({ name: payload.name });
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
});


book.use("/blog/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";

  if (!authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized: No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verify(token, c.env.JWT_SECRET) as { id: string; name: string };

    if (!payload?.id) {
      return c.json({ error: "Unauthorized: Invalid token payload" }, 401);
    }

    c.set("userId", payload.id);
    c.set("userName", payload.name); 

    await next();
  } catch (err) {
    return c.json({ error: "Unauthorized: Invalid or expired token" }, 403);
  }
});


function getPrismaClient(env: { DATABASE_URL: string }) {
  return new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());
}

let prisma: ReturnType<typeof getPrismaClient>;

book.post("/signup", async (c) => {
  const body = await c.req.json();
  const success = signUpInput.safeParse(body);

  if (!success) return c.json({ message: "Invalid Inputs" }, 411);

  if (!prisma) prisma = getPrismaClient(c.env);

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
    },
  });

  const token = await sign({ id: user.id, name: user.name }, c.env.JWT_SECRET);

  return c.json({ jwt: token });
});



book.post("/signin", async (c) => {
  const body = await c.req.json();
  const success = signInInput.safeParse(body);

  if (!success) return c.json({ message: "Invalid Inputs" }, 411);
  const prisma = getPrismaClient(c.env);

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    c.status(403);
    return c.json({ error: "user not found" });
  }

  const token = await sign({ id: user.id, name: user.name }, c.env.JWT_SECRET);
  return c.json({ token });
});
book.get("/blog/bulk", async (c) => {
  const prisma = getPrismaClient(c.env);
  const page = parseInt(c.req.query("page") || "1");
  const limit = 10;
  const skip = (page - 1) * limit;

  const blogs = await prisma.post.findMany({
    take: limit,
    skip: skip,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return c.json({ blogs: blogs });
});

book.get("/blog/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = getPrismaClient(c.env);
  const blog = await prisma.post.findFirst({
    where: {
      id: id,
    },
    select: {
      title: true,
      content: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  return c.json({ blog: blog });
});

book.post("/blog", async (c) => {
  const body = await c.req.json();
  const success = createBlogInput.safeParse(body);

  if (!success) return c.json({ message: "Invalid Inputs" }, 411);
  const prisma = getPrismaClient(c.env);

  const blog = await prisma.post.create({
    data: {
      authorId: c.get("userId"),
      title: body.title,
      content: body.content,
    },
  });
  return c.json({
    id: blog.id,
  });
});

book.put("/blog", async (c) => {
  const body = await c.req.json();
  const success = changeBlogInput.safeParse(body);

  if (!success) return c.json({ message: "Invalid Inputs" }, 411);
  const prisma = getPrismaClient(c.env);
  const blog = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.json({
    id: blog.id,
  });
});

export default book;
