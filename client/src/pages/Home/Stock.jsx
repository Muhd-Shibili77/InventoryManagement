import React, { useEffect, useState } from 'react'
import SideBar from '../../components/sidebar/sideBar'
import Table from '../../components/Table/Table'
import Pagination from '../../components/Pagination/Pagination'
import { getStocks } from '../../redux/stockSlice'
import { useDispatch, useSelector } from 'react-redux'
const Stock = () => {
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getStocks())
    },[dispatch])

    const {stocks}= useSelector((state)=>state.stock)
    const [currentPage, setCurrentPage] = useState(1);
    const ItemsPerPage = 6;


    const indexOfLast = currentPage * ItemsPerPage;
    const indexOfFirst = indexOfLast - ItemsPerPage;
    const currentItems = stocks.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(stocks.length / ItemsPerPage);

    const renderItemRow = (stock) => (
        <>
          
          <td className="px-4 py-2 border">{stock.itemId.name || "N/A"}</td>
          <td className="px-4 py-2 border">{stock.type}</td>
          <td className="px-4 py-2 border">{stock.quantity}</td>
          <td className="px-4 py-2 border">{stock.date ? new Date(stock.date).toLocaleDateString("en-GB") : "N/A"}</td>
          <td className="px-4 py-2 border">{stock.description}</td>
        </>
      );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
    <SideBar page={"Stock"} />
    <div className="flex-1 p-4 md:ml-12 transition-all duration-300">
      
      <Table
        data={currentItems}
        columns={["Item", "Type", "Quantity", "Date", "Description"]}
        renderRow={renderItemRow}
      />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  </div>
  )
}

export default Stock