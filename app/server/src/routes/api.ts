import { Hono } from "hono"
import data from "../../data.json"
import { z } from "zod"

const contentsSchema = z.object({
  name: z.string(),
  content: z.string().array(),
})

const apiRouter = new Hono()

apiRouter.get("/contents", (c) => {
  return c.json(data)
})

apiRouter.get("/contents/:keyword", (c) => {
  const keyword = c.req.param("keyword")
  const result = data.find((item) => item.keyword === keyword)

  if (!result) {
    return c.json("Not found", 404)
  }

  return c.json(result)
})

export default apiRouter
