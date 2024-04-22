import { Hono } from 'hono'
import { urls as app } from './api'

describe('Urls API', () => {
  test('一覧を取得する', async () => {
    const res = await app.fetch(new Request('http://localhost'))
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toEqual([
      { id: '1', originalUrl: 'https://google.com', shortUrl: 'fdsafda' },
      { id: '2', originalUrl: 'https://apple.com', shortUrl: 'fsadsafd' },
      { id: '3', originalUrl: 'https://microsoft.com', shortUrl: 'adfsaf' }
    ])
  })

  // test('更新する', async () => {
  //   const updateUrl = { shortUrl: 'hey' }
  //   const res1 = await app.fetch(
  //     new Request('http://localhost/3', {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(updateUrl)
  //     })
  //   )
  //   expect(res1.status).toBe(204)

  //   const res2 = await app.fetch(new Request('http://localhost'))
  //   const list = await res2.json()
  //   expect(list).toEqual([
  //     { id: '1', originalUrl: 'https://google.com', shortUrl: 'fdsafda' },
  //     { id: '2', originalUrl: 'https://apple.com', shortUrl: 'fsadsafd' },
  //     { id: '3', originalUrl: 'https://microsoft.com', shortUrl: 'hey' }
  //   ])
  // })

  test('削除する', async () => {
    const res1 = await app.fetch(
      new Request('http://localhost/2', {
        method: 'DELETE'
      })
    )
    expect(res1.status).toBe(204)

    const res2 = await app.fetch(new Request('http://localhost'))
    const list = await res2.json()
    expect(list).toEqual([
      { id: '1', originalUrl: 'https://google.com', shortUrl: 'fdsafda' },
      { id: '3', originalUrl: 'https://microsoft.com', shortUrl: 'adfsaf' }
    ])
  })
})
