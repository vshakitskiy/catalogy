import { serve } from "@hono/node-server"
import { Hono } from "hono"
import apiRouter from "./routes/api"
import { cors } from "hono/cors"

const app = new Hono()

app.use("/api/*", cors())

app.use(async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  console.log(`${c.req.method} ${c.req.url} ${end - start}ms - ${c.res.status}`)
  c.res.headers.set("X-Response-Time", `${end - start}`)
})

app.route("/api", apiRouter)

app.use(async (c) => {
  return c.json(
    {
      message: "Not found",
    },
    404
  )
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
