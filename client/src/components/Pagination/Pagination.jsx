import React from 'react'

const Pagination = ({currentPage,setCurrentPage,totalPages}) => {
  return (

    <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-3 py-1 rounded-full ${
                currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
  )
}

export default Pagination