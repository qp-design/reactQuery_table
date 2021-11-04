import GoodsTable from './components/table'
import GoodsSearch from "./components/search";
import ParamsContextProvider from '@/context'


const GoodsJsx = () => {

  return (
    <ParamsContextProvider>
      <GoodsSearch />
      <GoodsTable />
    </ParamsContextProvider>
  )
}
export default GoodsJsx
