import { useEffect, useLayoutEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const ContentPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const key = location.pathname.split("/").pop()!.split("%3E").join("/")
  const content = window.localStorage.getItem(key)

  useLayoutEffect(() => {
    if (content) {
      const head = document.getElementsByTagName("head")[0]
      head.lastChild!.remove()
    }
  }, [])

  useEffect(() => {
    if (!content) navigate("/")
  }, [])

  return content ? <div dangerouslySetInnerHTML={{ __html: content }} /> : null
}

export default ContentPage
