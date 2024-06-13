import { Hono } from "hono"
import { handle } from "hono/vercel"
import { serve } from "@hono/node-server"
import { cors } from "hono/cors"
import data from "./data.json"
import axios from "axios"
import * as cheerio from "cheerio"

export const config = {
  runtime: "edge",
}
// Helper func
const findByKeyword = (keyword: string) => {
  return data.find((item) => item.keyword === keyword)
}

const app = new Hono()

// CORS
app.use(cors())

// Custom logs
app.use(async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  console.log(`${c.req.method} ${c.req.url} ${end - start}ms - ${c.res.status}`)
  c.res.headers.set("X-Response-Time", `${end - start}`)
})

// All keywords with urls
app.get("/api/links", (c) => {
  return c.json(data)
})

// Urls by keyword
app.get("/api/links/:keyword", (c) => {
  const keyword = c.req.param("keyword")
  const list = findByKeyword(keyword)

  if (!list) {
    return c.json("Not found", 404)
  }

  return c.json(list)
})

// Fetch page content
app.get("/api/contents/:data{.*=.*}", async (c) => {
  try {
    const data = c.req.param("data")
    const [keyword, ...rest] = data.split("=")
    const url = rest.join().replaceAll(">", "/")

    const list = findByKeyword(keyword)
    if (!list) {
      return c.json(
        {
          message: "Not found",
        },
        404
      )
    }

    const mainLink = list.content.find((item) => url === item.split("://")[1])
    if (!mainLink) {
      return c.json(
        {
          message: "Not found",
        },
        404
      )
    }

    const res = await axios.get(mainLink, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    })
    const content = res.data
    const $ = cheerio.load(content)

    const links = $("link[rel=stylesheet]").toArray()
    for (const link of links) {
      let newCssTag = ""
      if ($(link).attr("href")?.startsWith("//")) {
        const res = await axios.get($(link).attr("href") as string)
        newCssTag = `<style>${res.data}</style>`
      } else if ($(link).attr("href")?.startsWith("/")) {
        const res = await axios.get(mainLink + $(link).attr("href"))
        newCssTag = `<style>${res.data}</style>`
      }
      $(link).replaceWith(newCssTag)
    }

    // const scripts = $("script[src]").toArray()
    // for (const script of scripts) {
    //   let newScriptTag = ""
    //   if ($(script).attr("src")?.startsWith("//")) {
    //     const res = await axios.get($(script).attr("src") as string)
    //     newScriptTag = `<script>${res.data}</script>`
    //   } else if ($(script).attr("src")?.startsWith("/")) {
    //     const res = await axios.get(mainLink + $(script).attr("src"))
    //     newScriptTag = `<script>${res.data}</script>`
    //   }
    //   $(script).replaceWith(newScriptTag)
    // }
    const htmlCode = $.html()

    return c.json({
      link: mainLink,
      code: htmlCode.replaceAll(/[\n\t]+/g, "").replaceAll('"', "'"),
    })
  } catch (error) {
    return c.json(
      {
        message: "Can't access link",
      },
      500
    )
  }
})

// Unknown endpoints
app.use(async (c) => {
  return c.json(
    {
      message: "Not found",
    },
    404
  )
})

/* 
  Serving method  
    serve - Local
    handle - Vercel 
*/

// Production
// export default handle(app)

// Development
const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
