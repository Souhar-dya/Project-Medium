import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify } from 'hono/jwt'

const book = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET : string
  },Variables:{
	userId : string
  }
}>()



book.use('/blog/*', async (c, next) => {
  const authHeader = c.req.header('Authorization') || "";

  if (!authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verify(token, c.env.JWT_SECRET) as { id: string };

    if (!payload?.id) {
      return c.json({ error: 'Unauthorized: Invalid token payload' }, 401);
    }

    c.set('userId', payload.id);

    await next(); // Proceed to the actual route
  } catch (err) {
    return c.json({ error: 'Unauthorized: Invalid or expired token' }, 403);
  }
});


function getPrismaClient(env: { DATABASE_URL: string }) {
  return new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate())
}

let prisma: ReturnType<typeof getPrismaClient>



book.post('/signup', async (c) => {
  const body = await c.req.json()

  if (!prisma) prisma = getPrismaClient(c.env)

  const user = await prisma.user.create({
    data: {
      name : body.username,
      email: body.email,
      password: body.password,
    },
  })

  const token = await sign({ id: user.id }, c.env.JWT_SECRET)

  return c.json({ jwt: token })
})

book.post('/signin', async (c) => {
  const body = await c.req.json()
  const prisma = getPrismaClient(c.env)

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  })

  if (!user) {
    c.status(403)
    return c.json({ error: 'user not found' })
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
  return c.json({ jwt })
})
book.get('/blog/bulk', async (c) => {
  const prisma = getPrismaClient(c.env);
  const page = parseInt(c.req.query('page') || '1');
  const limit = 10;
  const skip = (page - 1) * limit;

  const blogs = await prisma.post.findMany({
    take: limit,
    skip: skip,
    
  });

  return c.json({ blogs : blogs });
});

book.get('/blog/:id', async (c) => {
  const id = c.req.param('id')
  const prisma = getPrismaClient(c.env)
  const blog = await prisma.post.findFirst({
    where :{
      id : id
    }
  })
  return c.json({blog : blog})
})

book.post('/blog', async (c) => {
  const body = await c.req.json();
  const prisma = getPrismaClient(c.env);

  const blog = await prisma.post.create({
    data: {
      authorId: c.get('userId'),
      title: body.title,
      content: body.content,
    },
  });
  return c.json({
    id: blog.id,
  });
});

book.put('/blog', async(c) => {
  const body = await c.req.json()
  const prisma = getPrismaClient(c.env)
  const blog = await prisma.post.update({
  where: {
    id: body.id,
  },
  data: {
    title: body.title,
    content: body.content,

  },
})
  return c.json({
    id : blog.id
  })

})



export default book
