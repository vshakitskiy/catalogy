import "../index.css"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { FormEvent, useRef, useState } from "react"
import Links from "../components/links"
import Downloads from "../components/downloads"
import { IoIosSearch } from "react-icons/io"

const MainPage = () => {
  const input = useRef<HTMLInputElement>(null)
  const [keyword, setKeyword] = useState("")
  const serverUrl = import.meta.env.VITE_SERVER_URL

  const linksQuery = useQuery<{
    keyword: string
    content: string[]
  }>({
    queryKey: ["links", keyword],
    queryFn: () => {
      return axios
        .get(`${serverUrl}/api/links/` + keyword)
        .then((res) => res.data)
    },
    enabled: !!keyword,
    retry: false,
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.current) {
      const keyword = input.current.value
      setKeyword(keyword)
    }
  }

  return (
    <>
      <header className="p-3 shadow-md">
        <nav className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold">Catalogy</h1>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-5 pt-10">
        <Downloads />
        <h2 className="py-5 text-xl font-bold">Search</h2>
        <form
          onSubmit={onSubmit}
          className="mx-auto flex flex-col justify-center gap-3 md:flex-row"
        >
          <input
            ref={input}
            placeholder="Enter keyword... (study/icons/old/library)"
            className="mx-auto w-full rounded-sm border p-2 focus:border-[#8b8b8b] focus:outline-none md:max-w-none md:flex-1"
          />
          <button className="mx-auto flex w-full items-center justify-center gap-2 rounded-sm border p-2 transition-colors duration-300 hover:bg-black hover:text-white focus:border-[#8b8b8b] focus:outline-none md:max-w-40 lg:max-w-60">
            Search <IoIosSearch className="rotate-90" />
          </button>
        </form>
        <Links query={linksQuery} />
      </main>
    </>
  )
}

export default MainPage
