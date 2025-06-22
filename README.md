# 🌟 Project: Medium

Welcome to the documentation of this full-stack project built using **Hono**, **Cloudflare Workers**, and **Prisma**. This project is optimized for **speed**, **scalability**, and a **modern developer experience**.

---

## 🚀 Tech Stack

| Technology                | Purpose                                                                  |
|---------------------------|--------------------------------------------------------------------------|
| **Hono**                  | A fast, lightweight, and expressive web framework for Cloudflare Workers. |
| **Cloudflare Workers**    | Serverless backend logic at the edge — ultra low latency, auto-scaled.   |
| **Prisma ORM**            | Type-safe and performant database access layer.                         |
| **prisma-client-clearate** | Lightweight Prisma client variant ideal for edge environments like Workers. |

---

## ⚙️ Why Prisma + `prisma-client-clearate`?

Prisma is known for:

- ✅ Type-safety  
- ✅ Clean schema modeling  
- ✅ Powerful migrations and introspection  

But in **Cloudflare Workers**, the full Prisma client can be **too heavy**.  
That’s where `prisma-client-clearate` comes in:

- Uses `@prisma/client/edge`  
- Optimized for **cold starts** and edge performance  
- Reduces bundle size drastically  
- Works seamlessly with **SQLite** or edge-compatible DBs  

---

## ✨ Why Hono?

- 🚀 Superfast (often faster than Express or Koa)  
- 🌐 Built for the Edge runtime  
- 🧱 Simple and clean middleware support  
- 🧠 Native TypeScript  
- 🧩 Compact syntax  

How to install:

```

git clone https://github.com/Souhar-dya/Project-Medium.git

cd Project-Medium

npm install

npm run dev
