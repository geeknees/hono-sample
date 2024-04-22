import { Hono } from 'hono'
import { urls as app } from './api'
import { PREFIX, Url, CreateUrl, UpdateUrl } from './model'

const env = getMiniflareBindings()
const seed = async () => {
  const urlList: Url[] = [
    { id: '1', originalUrl: 'https://google.com', shortUrl: 'fdsafda' },
    { id: '2', originalUrl: 'https://apple.com', shortUrl: 'fsadsafd' },
    { id: '3', originalUrl: 'https://microsoft.com', shortUrl: 'adfsaf' }
  ]
  for (const url of urlList) {
    await env.HONO_QRTLY.put(`${PREFIX}${url.id}`, JSON.stringify(url))
  }
}

describe('Urls API', () => {
  beforeEach(() => {
    seed()
  })

  test('一覧を取得する', async () => {
    const res = await app.fetch(new Request('http://localhost'), env)
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toEqual([
      { id: '1', originalUrl: 'https://google.com', shortUrl: 'fdsafda' },
      { id: '2', originalUrl: 'https://apple.com', shortUrl: 'fsadsafd' },
      { id: '3', originalUrl: 'https://microsoft.com', shortUrl: 'adfsaf' }
    ])
  })

  test('作成する', async () => {
    const newUrl: CreateUrl = { originalUrl: 'https://', shortUrl: 'fdsafd' }
    const res1 = await app.fetch(
      new Request('http://localhost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUrl)
      }),
      env
    )
    expect(res1.status).toBe(201)
    const body = await res1.json()
    expect(body).toEqual({
      id: expect.any(String),
      originalUrl: 'https://',
      shortUrl: 'fdsafd'
    })

    const res2 = await app.fetch(new Request('http://localhost'), env)
    const list = await res2.json()
    expect(list).toEqual([
      { id: '1', originalUrl: 'https://google.com', shortUrl: 'fdsafda' },
      { id: '2', originalUrl: 'https://apple.com', shortUrl: 'fsadsafd' },
      { id: '3', originalUrl: 'https://microsoft.com', shortUrl: 'adfsaf' },
      { id: expect.any(String), originalUrl: 'https://', shortUrl: 'fdsafd' }
    ])
  })

  test('Todo を更新する', async () => {
    const updateUrl: UpdateUrl = { shortUrl: 'hey' }
    const res1 = await app.fetch(
      new Request('http://localhost/3', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateUrl)
      }),
      env
    )
    expect(res1.status).toBe(204)

    const res2 = await app.fetch(new Request('http://localhost'), env)
    const list = await res2.json()
    expect(list).toEqual([
      { id: '1', originalUrl: 'https://google.com', shortUrl: 'fdsafda' },
      { id: '2', originalUrl: 'https://apple.com', shortUrl: 'fsadsafd' },
      { id: '3', originalUrl: 'https://microsoft.com', shortUrl: 'hey' }
    ])
  })

  test('削除する', async () => {
    const res1 = await app.fetch(
      new Request('http://localhost/2', {
        method: 'DELETE'
      }),
      env
    )
    expect(res1.status).toBe(204)

    const res2 = await app.fetch(new Request('http://localhost'), env)
    const list = await res2.json()
    expect(list).toEqual([
      { id: '1', originalUrl: 'https://google.com', shortUrl: 'fdsafda' },
      { id: '3', originalUrl: 'https://microsoft.com', shortUrl: 'adfsaf' }
    ])
  })
})
