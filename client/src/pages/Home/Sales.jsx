import React, { useState, useEffect } from "react";
import SideBar from "../../components/sidebar/sideBar";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSales, createSale,updateSale,deleteSale } from "../../redux/saleSlice";
import { getItems } from "../../redux/itemSlice";
import { getCustomers } from "../../redux/customerSlice";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Sales = () => {
  const dispatch = useDispatch();
  const { sales } = useSelector((state) => state.sale);
  const { items } = useSelector((state) => state.item);
  const { customers } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(getSales());
    dispatch(getCustomers());
    dispatch(getItems());
  }, [dispatch]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const ItemsPerPage = 6;

  const [newSale, setNewSale] = useState({
    item: "",
    customer: "",
    quantity: "",
    price: "",
    totalPrice: "",
  });
  const [editSale, setEditSale] = useState({
    id:"",
    item: "",
    customer: "",
    quantity: "",
    price: "",
    totalPrice: "",
})



  const indexOfLast = currentPage * ItemsPerPage;
  const indexOfFirst = indexOfLast - ItemsPerPage;
  const currentItems = sales.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sales.length / ItemsPerPage);


const handleDeleteSale = async (saleId) => {
 
  confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="fixed inset-0 flex items-center justify-center  z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
                <h2 className="text-xl font-semibold text-gray-800">{`Delete Confirmation`}</h2>
                <p className="text-gray-600 mt-2">{`Are you sure you want to Delete?`}</p>
                <div className="flex justify-center mt-5 gap-4">
                  <button
                    onClick={async () => {
                      try {
                        await dispatch(deleteSale({ saleId })).unwrap();
                        toast.success(`Sale Deleted successfully!`);
                        dispatch(getSales());
                      } catch (error) {
                        console.error("Delete Sale Error:", error);
                  
                        const errorMessage = error?.message || "Something went wrong!";
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
  
}

const toggleEdit = (sale)=>{
  setEditSale({
    id:sale.id,
    item: sale.itemId._id,
    customer: sale.customerId._id,
    quantity: sale.quantity,
    price: sale.price,
    totalPrice: sale.totalPrice,
  })
}


  const renderItemRow = (sale) => (
    <>
      <td className="px-4 py-2 border">{sale.itemId.name || "N/A"}</td>
      <td className="px-4 py-2 border">{sale.customerId.name || "N/A"}</td>
      <td className="px-4 py-2 border">{sale.price}</td>
      <td className="px-4 py-2 border">{sale.quantity}</td>
      <td className="px-4 py-2 border">{sale.date ? new Date(sale.date).toLocaleDateString("en-GB") : "N/A"}</td>
      <td className="px-4 py-2 border">{sale.totalPrice}</td>
      <td className="px-4 py-2 border text-center">
        {!sale.isDelete && (
          <button
          className="w-22 bg-indigo-400 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors"
          onClick={() => {
            toggleEdit(sale);
            setisEditModalOpen(true);
          }}
        >
          Edit
        </button>
          )}
           <button
          className="w-22 bg-red-400 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors ml-3"
          onClick={() => handleDeleteSale(sale.id)}
        >
          Delete
        </button>
      </td>
    </>
  );

  const handleAddSale = async () => {
    const { item, customer, quantity, price } = newSale;

    if (!item || !customer || !quantity || !price) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await dispatch(createSale({ newSale })).unwrap();

      toast.success("Sale added successfully!");
      setIsModalOpen(false);
      setNewSale({ item: "", customer: "", quantity: "", price: "", totalPrice: "" });
      dispatch(getSales());
    } catch (error) {
      console.error("add sales Error:", error);

      const errorMessage = error?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  const handleEditSale = async()=>{
    const id = editSale.id
    try {

      await dispatch(updateSale({id,editSale})).unwrap()
      setTimeout(()=>{
        toast.success('sales edited')
        dispatch(getSales())
        setEditSale({
          id:"",
          item: "",
          customer: "",
          quantity: "",
          price: "",
          totalPrice: "",
      })
        setisEditModalOpen(false)
      },1000)
    }  catch (error) {
          console.error("edit sale Error:", error);
    
          const errorMessage = error?.message || "Something went wrong!";
          toast.error(errorMessage);
      
    }

  }
  return (
    <div>
      <div className="flex flex-col md:flex-row min-h-screen">
        <SideBar page={"Sales"} />
        <div className="flex-1 p-4 md:ml-12 transition-all duration-300">
          <button
            className="ml-4 w-50 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Add new Sale
          </button>
          <Table
            data={currentItems}
            columns={["Item", "Customer",'Price', "Quantity", "Date", "Total Price","Actions"]}
            renderRow={renderItemRow}
          />
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add Sale</h2>

            {/* Item Dropdown */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
              <select
                value={newSale.item}
                onChange={(e) => {
                  const selectedItem = items.find((item) => item.id === e.target.value);
                  const price = selectedItem?.price || "";
                  const totalPrice =
                    newSale.quantity && price ? newSale.quantity * price : "";
                  setNewSale({ ...newSale, item: e.target.value, price, totalPrice });
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Item</option>
                {items.filter((item)=>!item.isDelete)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Dropdown */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                value={newSale.customer}
                onChange={(e) =>
                  setNewSale({ ...newSale, customer: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Customer</option>
                {customers.filter((customer)=>!customer.isDelete)
                .map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={newSale.quantity}
                onChange={(e) => {
                  const quantity = e.target.value;
                  const totalPrice =
                    quantity && newSale.price ? quantity * newSale.price : "";
                  setNewSale({ ...newSale, quantity, totalPrice });
                }}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Price */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                disabled
                value={newSale.price}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Total Price */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
              <input
                type="number"
                disabled
                value={newSale.totalPrice}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSale}
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
            <h2 className="text-lg font-semibold mb-4">Edit Sale</h2>

            {/* Item Dropdown */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
              <select
                value={editSale.item}
                onChange={(e) => {
                  const selectedItem = items.find((item) => item.id === e.target.value);
                  const price = selectedItem?.price || "";
                  const totalPrice =
                    editSale.quantity && price ? editSale.quantity * price : "";
                  setEditSale({ ...editSale, item: e.target.value, price, totalPrice });
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Item</option>
                {items.filter((item)=>!item.isDelete)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Dropdown */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                value={editSale.customer}
                onChange={(e) =>
                  setEditSale({ ...editSale, customer: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Customer</option>
                {customers.filter((customer)=>!customer.isDelete)
                .map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={editSale.quantity}
                onChange={(e) => {
                  const quantity = e.target.value;
                  const totalPrice =
                    quantity && editSale.price ? quantity * editSale.price : "";
                  setEditSale({ ...editSale, quantity, totalPrice });
                }}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Price */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                disabled
                value={editSale.price}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Total Price */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
              <input
                type="number"
                disabled
                value={editSale.totalPrice}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setisEditModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSale}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar />
    </div>
  );
};

export default Sales;
