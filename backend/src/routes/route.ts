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



book.use('/blog/*',async(c,next)=>{
	const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = await verify(token, c.env.JWT_SECRET) as { id: string }
	if(!payload){
		c.status(404)
		return c.json({error:'Unauthorized'})
	
	}
	
	c.set('userId', payload.id)

	await next()
  } catch (err) {
    return c.json({ error: 'Unauthorized: Invalid token' }, 403)
  }
})

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

book.get('/blog/:id', (c) => {
  const id = c.req.param('id')
  return c.text(`get blog route: ${id}`)
})

book.post('/blog', (c) => c.text('create blog route'))
book.put('/blog', (c) => c.text('update blog route'))




export default book
