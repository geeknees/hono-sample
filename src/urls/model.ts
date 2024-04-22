export interface Url {
  id: string
  originalUrl: string
  shortUrl: string
}

export interface CreateUrl {
  originalUrl: string
  shortUrl: string
}

export interface UpdateUrl {
  originalUrl?: string
  shortUrl?: string
}

export const PREFIX = 'v1:url:'

export const getUrls = async (KV: KVNamespace): Promise<Url[]> => {
  const list = await KV.list({ prefix: PREFIX })
  const urls: Url[] = []

  for (const key of list.keys) {
    const value = await KV.get<Url>(key.name, 'json')
    if (value) {
      urls.push(value)
    }
  }

  return urls
}

export const getUrl = (KV: KVNamespace, id: string): Promise<Url | null> => {
  return KV.get<Url>(`${PREFIX}${id}`, 'json')
}

export const createUrl = async (
  KV: KVNamespace,
  param: CreateUrl
): Promise<Url> => {
  const id = crypto.randomUUID()
  const newUrl: Url = {
    id,
    originalUrl: param.originalUrl,
    shortUrl: param.shortUrl
  }
  await KV.put(`${PREFIX}${id}`, JSON.stringify(newUrl))

  return newUrl
}

export const updateUrl = async (
  KV: KVNamespace,
  id: string,
  param: UpdateUrl
): Promise<void> => {
  const url = await getUrl(KV, id)
  if (!url) {
    return
  }

  const updateUrl = {
    ...url,
    ...param
  }

  await KV.put(`${PREFIX}${id}`, JSON.stringify(updateUrl))
}

export const deleteUrl = (KV: KVNamespace, id: string) => {
  return KV.delete(`${PREFIX}${id}`)
}
