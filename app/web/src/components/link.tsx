import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { MouseEventHandler, useContext, useEffect, useState } from "react"
import { storageContext } from "./providers/storageContext"
import { LuDownloadCloud } from "react-icons/lu"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaCheck } from "react-icons/fa"

const Link = ({ url, keyword }: { url: string; keyword: string }) => {
  const [apiUrl, setApiUrl] = useState("")
  const { setKeys } = useContext(storageContext)
  const serverUrl = import.meta.env.VITE_SERVER_URL
  const { data, isLoading } = useQuery<{
    link: string
    code: string
  }>({
    queryKey: ["content", apiUrl],
    queryFn: () => {
      return axios
        .get(`${serverUrl}/api/contents/` + keyword + "=" + apiUrl)
        .then((res) => res.data)
    },
    enabled: !!apiUrl,
    retry: false,
  })

  useEffect(() => {
    if (!data) return
    window.localStorage.setItem(
      data.link.split("//")[1],
      JSON.stringify(data.code),
    )
    setKeys(Object.keys(localStorage))
  }, [data])

  const downloadUrl: MouseEventHandler = (e) => {
    const url = e
      .currentTarget!.parentElement!.textContent!.split("//")[1]
      .split("/")
      .join(">")
    setApiUrl(url)
  }

  return (
    <li className="flex items-center justify-between rounded-sm border p-4 px-9 shadow-sm">
      {url}

      <button
        onClick={downloadUrl}
        disabled={!!apiUrl}
        className="flex h-10 w-10 items-center justify-center rounded-md border p-2 transition-colors duration-300 hover:border-black hover:bg-black hover:text-white"
      >
        {!apiUrl ? <LuDownloadCloud className="h-6 w-6" /> : null}
        {isLoading ? (
          <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin" />
        ) : null}
        {data ? <FaCheck className="h-4 w-4" /> : null}
      </button>
    </li>
  )
}

export default Link
