import { Hono } from 'hono'
import { urls } from './urls/api'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/urls', urls)

export default app
