import { useContext } from "react"
import { storageContext } from "./providers/storageContext"
import { TiDeleteOutline } from "react-icons/ti"

const Downloads = () => {
  const { keys, setKeys } = useContext(storageContext)

  return (
    <div>
      <h2 className="py-5 text-xl font-bold">Downloaded</h2>
      {keys.length !== 0 && (
        <ul className="flex flex-col gap-1">
          {keys.map((key) => (
            <li className="group flex items-center gap-10">
              <a
                target="_blank"
                href={"/content/" + key.split("/").join(">")}
                key={key}
                className="py-2 text-lg font-medium underline"
              >
                {key}
              </a>
              <button
                className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                onClick={() => {
                  window.localStorage.removeItem(key)
                  setKeys(Object.keys(window.localStorage))
                }}
              >
                <TiDeleteOutline className="h-6 w-6 text-red-400" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Downloads
