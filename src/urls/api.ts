import { Hono } from 'hono'
import {
  createUrl,
  CreateUrl,
  deleteUrl,
  getUrl,
  getUrls,
  updateUrl,
  UpdateUrl
} from './model'
import { Bindings } from '../bindings'

const urls = new Hono<{ Bindings: Bindings }>()

urls.get('/', async (c) => {
  const urls = await getUrls(c.env.HONO_QRTLY)
  return c.json(urls)
})

urls.post('/', async (c) => {
  const param = await c.req.json<CreateUrl>()
  const newUrl = await createUrl(c.env.HONO_QRTLY, param)

  return c.json(newUrl, 201)
})

urls.put('/:id', async (c) => {
  const id = c.req.param('id')
  const url = await getUrl(c.env.HONO_QRTLY, id)
  if (!url) {
    return c.json({ message: 'not found' }, 404)
  }
  const param = await c.req.json<UpdateUrl>()
  await updateUrl(c.env.HONO_QRTLY, id, param)
  return new Response(null, { status: 204 })
})

urls.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const url = await getUrl(c.env.HONO_QRTLY, id)
  if (!url) {
    return c.json({ message: 'not found' }, 404)
  }
  await deleteUrl(c.env.HONO_QRTLY, id)

  return new Response(null, { status: 204 })
})

export { urls }
