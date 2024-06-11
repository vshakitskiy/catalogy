import { useContext } from "react"
import { storageContext } from "./providers/storageContext"

const Downloads = () => {
  const { keys } = useContext(storageContext)

  return (
    <div>
      <h2 className="py-5 text-xl font-bold">Downloaded</h2>
      {keys.length !== 0 && (
        <div className="flex flex-col gap-1">
          {keys.map((key) => (
            <a
              target="_blank"
              href={"/content/" + key.split("/").join(">")}
              key={key}
              className="py-2 text-lg font-medium underline"
            >
              {key}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default Downloads
