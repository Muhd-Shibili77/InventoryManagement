import React, { useEffect, useState } from "react";
import SideBar from "../../components/sidebar/sideBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import { getCustomers, addCustomers,deleteCustomers,updateCustomer } from "../../redux/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ERROR_MESSAGE } from "../../constants/messages";

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
  const [editCustomer, setEditCustomer] = useState({
    id: "",
    name: "",
    address: "",
    phone: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setisEditModalOpen] = useState(false);
  
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
        dispatch(getCustomers());
        toast.success("Customer added");
        setNewCustomer({ name: "", address: "", phone: "" });
        setIsModalOpen(false);
      },1000)

    } catch (error) {
      console.error("Add Customer Error:", error);

    const errorMessage = error?.message || ERROR_MESSAGE;
    toast.error(errorMessage);
    }

  };

  const handleDelete = async (customerId, isDelete) => {
   confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="fixed inset-0 flex items-center justify-center  z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
                <h2 className="text-xl font-semibold text-gray-800">{`${isDelete ? "Restore":"Delete"} Confirmation`}</h2>
                <p className="text-gray-600 mt-2">{`Are you sure you want to ${isDelete ? "Restore":"Delete"}?`}</p>
                <div className="flex justify-center mt-5 gap-4">
                  <button
                    onClick={async () => {
                      try {
                        await dispatch(deleteCustomers({ customerId, isDelete })).unwrap();
                        toast.success(`Customer ${!isDelete ? "Deleted" : "Restored"}`);
                        dispatch(getCustomers());
                      } catch (error) {
                        console.error("Delete customer Error:", error);
                  
                        const errorMessage = error?.message || ERROR_MESSAGE;
                        toast.error(errorMessage);
                      }
                      onClose();
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Yes
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          );
        },
      });
    };
  
    const toggleEdit = (customer)=>{
      setEditCustomer({
        id: customer.id,
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
      })
    }

    const handleEditCustomer = ()=>{
      if (!editCustomer.name || !editCustomer.address || !editCustomer.phone) return;
      try {
        dispatch(updateCustomer({ id: editCustomer.id, editCustomer })).unwrap();
        setTimeout(()=>{
          dispatch(getCustomers())
          toast.success("Customer Edited")
          setisEditModalOpen(false)
        },1000)
      } catch (error) {
        console.error("Edit customer Error:", error);
        const errorMessage = error?.message || ERROR_MESSAGE;
        toast.error(errorMessage);
      }
    setEditCustomer({ name: "", address: "", phone: "" });
    }

  const renderCustomerRow = (customer) => (
    <>
      <td className="px-4 py-2 border">{customer.name}</td>
      <td className="px-4 py-2 border">{customer.address}</td>
      <td className="px-4 py-2 border">{customer.phone}</td>
      <td className="px-4 py-2 border text-center"> 
          {!customer.isDelete && (
            <button
            className="w-22 bg-indigo-400 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors"
            onClick={() => {
              toggleEdit(customer);
              setisEditModalOpen(true);
            }}
          >
            Edit
          </button>
          )}
          <button
          className={`w-22 ${customer.isDelete ? "bg-blue-400 hover:bg-blue-600" : "bg-red-400 hover:bg-red-600"} text-white py-2 px-4 rounded-lg transition-colors ml-3`}
          onClick={() => handleDelete(customer.id, customer.isDelete)}
        >
          {customer.isDelete ? "Restore" : "Delete"}
        </button>
      </td>
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
            columns={["Name", "Address", "Phone","Actions"]}
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

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Customer</h2>
            <input
              type="text"
              placeholder="Name"
              value={editCustomer.name}
              onChange={(e) =>
                setEditCustomer({ ...editCustomer, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Address"
              value={editCustomer.address}
              onChange={(e) =>
                setEditCustomer({ ...editCustomer, address: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Phone"
              value={editCustomer.phone}
              onChange={(e) =>
                setEditCustomer({ ...editCustomer, phone: e.target.value })
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
                onClick={handleEditCustomer}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Edit
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
