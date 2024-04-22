import { Hono } from 'hono'
import { validator } from 'hono/validator'

let urlList = [
  { id: '1', originalUrl: 'https://google.com', shortUrl: 'fdsafda' },
  { id: '2', originalUrl: 'https://apple.com', shortUrl: 'fsadsafd' },
  { id: '3', originalUrl: 'https://microsoft.com', shortUrl: 'adfsaf' }
]

const urls = new Hono()

urls.get('/', (c) => c.json(urlList))

urls.post(
  '/',
  validator('form', (value, c) => {
    const body = value['body']
    if (!body || typeof body !== 'string') {
      return c.text('Invalid!', 400)
    }
    return {
      body: body
    }
  }),
  async (c) => {
    const param = await c.req.json<{ originalUrl: string }>()
    const newUrl = {
      id: String(urlList.length + 1),
      originalUrl: param.originalUrl,
      shortUrl: ''
    }
    urlList = [...urlList, newUrl]

    return c.json(newUrl, 201)
  }
)

urls.put('/:id', async (c) => {
  const id = c.req.param('id')
  const url = urlList.find((url) => url.id === id)
  if (!url) {
    return c.json({ message: 'not found' }, 404)
  }
  const param = (await c.req.parseBody()) as {
    originalUrl?: string
    shortUrl?: string
  }
  urlList = urlList.map((url) => {
    if (url.id === id) {
      return {
        ...url,
        ...param
      }
    } else {
      return url
    }
  })
  return new Response(null, { status: 204 })
})

urls.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const url = urlList.find((url) => url.id === id)
  if (!url) {
    return c.json({ message: 'not found' }, 404)
  }
  urlList = urlList.filter((url) => url.id !== id)

  return new Response(null, { status: 204 })
})

export { urls }
