import { UseQueryResult } from "@tanstack/react-query"
import Link from "./link"
import { AiOutlineLoading3Quarters, AiOutlineStop } from "react-icons/ai"

const Links = ({
  query,
}: {
  query: UseQueryResult<{ keyword: string; content: string[] }>
}) => {
  const { data, isLoading, isPending } = query
  return (
    <div className="mt-8">
      {isLoading ? (
        <AiOutlineLoading3Quarters className="mx-auto h-6 w-6 animate-spin text-[#8b8b8b]" />
      ) : isPending ? null : !data ? (
        <p className="flex items-center justify-center gap-5 border border-dashed border-red-500 bg-red-400 py-10 text-lg font-medium text-white">
          <AiOutlineStop className="h-6 w-6" />
          Keyword not found
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {data.content.map((item) => (
            <Link key={item} keyword={data.keyword} url={item} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default Links
