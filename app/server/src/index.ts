import { serve } from "@hono/node-server"
import { Hono } from "hono"
import apiRouter from "./routes/api"

const app = new Hono()

app.use(async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  c.res.headers.set("X-Response-Time", `${end - start}`)
})

app.route("/api", apiRouter)

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
