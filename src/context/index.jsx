import { createContext, useState, useContext } from 'react'

const ParamsContext = createContext(null)
ParamsContext.displayName = 'paramsContext'

const ParamsContextProvider = ({ children }) => {
  const [params, setParams] = useState({
    page: 1,
    page_size: 5,
    // on_sale: 3
  })

  return (
    <ParamsContext.Provider value={{
      params,
      setParams
    }}>
      { children }
    </ParamsContext.Provider>
  )
}

export default ParamsContextProvider;

export const useParamsContext = () => {
  const context = useContext(ParamsContext)
  if(!context) {
    throw new Error('useParamsContext调用必须在ParamsContextProvider里面');
  }
  return context
}
