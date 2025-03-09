import { ReadStream } from 'node:fs'
import http from 'node:http'

import { StatusCodes } from '@/common/contracts/http'

import { MOCK_SERVER_DEFAULT_HEADERS, MOCK_SERVER_HOST, MOCK_SERVER_PORT } from './constants'
import { delay, matchRouteAndNormalize } from './helpers/server'
import { routes } from './routes'
import { Request, Route } from './types'

const server = http.createServer(async (request, response) => {
  const requestMethod = request.method?.toLowerCase()
  const chunk: any[] = []
  const requestBody = await new Promise((resolve, reject) => {
    request
      .on('error', (error) => {
        console.error('Mock server error:', error)
        reject(error)
      })
      .on('data', (dataChunk) => {
        chunk.push(dataChunk)
      })
      .on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunk).toString() || '{}'))
        } catch {
          resolve(JSON.parse('{}'))
        }
      })
  })

  let routeFound!: (Pick<Request, 'pathParams' | 'queryParams'> & Route) | undefined
  routes.some((route) => {
    const routeNormalized = matchRouteAndNormalize(route.path, request.url ?? '/')
    if (routeNormalized && requestMethod === route.method) {
      routeFound = { ...route, ...routeNormalized }
      return true
    }
    return false
  })

  Object.entries(MOCK_SERVER_DEFAULT_HEADERS).forEach(([key, value]) => {
    response.setHeader(key, value)
  })

  if (!routeFound) {
    response.statusCode = requestMethod === 'options' ? StatusCodes.OK : StatusCodes.NOT_FOUND
    response.end(JSON.stringify({ message: 'Mock route not found' }))
    return
  }

  await delay()

  const result = routeFound.handle({
    headers: request.headers as Record<string, string>,
    pathParams: routeFound.pathParams,
    queryParams: routeFound.queryParams,
    body: requestBody,
  })

  response.statusCode = result.status
  Object.entries(result.headers).forEach(([key, value]) => {
    response.setHeader(key, value)
  })
  if (result.body instanceof ReadStream) {
    return result.body.pipe(response)
  }
  response.end(JSON.stringify(result.body))
})

server.listen(MOCK_SERVER_PORT, MOCK_SERVER_HOST, () => {
  const reset = '\x1b[0m'
  const bold = '\x1b[1m'
  const green = '\x1b[32m'
  const cyan = '\x1b[36m'
  console.info(
    ` ${green}➜${reset}  ${bold}Mock server${reset}: ${cyan}http://${MOCK_SERVER_HOST}:${bold}${MOCK_SERVER_PORT}${reset}${cyan}/${reset}`,
  )
})
