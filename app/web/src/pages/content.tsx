import { useLayoutEffect } from "react"
import { useLocation } from "react-router-dom"

const ContentPage = () => {
  useLayoutEffect(() => {
    const head = document.getElementsByTagName("head")[0]

    head.lastChild!.remove()
  }, [])

  const location = useLocation()
  const key = location.pathname.split("/").pop()!.split("%3E").join("/")
  const content = window.localStorage.getItem(key)

  return content ? <div dangerouslySetInnerHTML={{ __html: content }} /> : null
}

export default ContentPage
