import React, { useEffect, useState } from "react";
import SideBar from "../../components/sidebar/sideBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import { getCustomers, addCustomers } from "../../redux/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Customers = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customer);

  
  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);


  const [search, setSearch] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const customersPerPage = 6;

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.address || !newCustomer.phone) return;

    try {
      await dispatch(addCustomers({ newCustomer })).unwrap();


      setTimeout(()=>{
        toast.success("Customer added");
        setNewCustomer({ name: "", address: "", phone: "" });
        setIsModalOpen(false);
      },1000)

    } catch (error) {
      console.error("Add Customer Error:", error);

    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    }

    
  };

  const renderCustomerRow = (customer) => (
    <>
      <td className="px-4 py-2 border">{customer.name}</td>
      <td className="px-4 py-2 border">{customer.address}</td>
      <td className="px-4 py-2 border">{customer.phone}</td>
    </>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row min-h-screen">
        <SideBar page={"Customers"} />
        <div className="flex-1 p-4 md:ml-12 transition-all duration-300">
          <SearchBar search={search} setSearch={setSearch} />
          <button
            className="ml-4 w-50 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Add Customer
          </button>
          <Table
            data={currentCustomers}
            columns={["Name", "Address", "Phone"]}
            renderRow={renderCustomerRow}

          />
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Customer</h2>
            <input
              type="text"
              placeholder="Name"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Address"
              value={newCustomer.address}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, address: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Phone"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default Customers;
