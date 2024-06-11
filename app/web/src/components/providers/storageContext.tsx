import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react"

export const storageContext = createContext<{
  keys: string[]
  setKeys: Dispatch<SetStateAction<string[]>>
}>({
  keys: Object.keys(localStorage),
  setKeys: () => {},
})

export const StorageProvider = ({ children }: PropsWithChildren) => {
  const [keys, setKeys] = useState(Object.keys(window.localStorage))

  return (
    <storageContext.Provider
      value={{
        keys,
        setKeys,
      }}
    >
      {children}
    </storageContext.Provider>
  )
}
