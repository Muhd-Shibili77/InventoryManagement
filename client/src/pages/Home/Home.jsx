import React, { useEffect, useState } from "react";
import SideBar from "../../components/sidebar/sideBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import { getItems, addItems, deleteItems,updateItem } from "../../redux/itemSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Home = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.item);

  useEffect(() => {
    dispatch(getItems());
  }, [dispatch]);


  const [search, setSearch] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
  });

  const [editItem, setEditItem] = useState({
    id: "",
    name: "",
    description: "",
    quantity: "",
    price: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const ItemsPerPage = 6;

  const filteredItems = items.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * ItemsPerPage;
  const indexOfFirst = indexOfLast - ItemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredItems.length / ItemsPerPage);

  const handleAddItems = async () => {
    if (
      !newItem.name ||
      !newItem.description ||
      !newItem.quantity ||
      !newItem.price
    )
      return;

    try {
      await dispatch(addItems({ newItem })).unwrap();

      setTimeout(() => {
        toast.success("Item added");
        setNewItem({ name: "", description: "", quantity: "", price: "" });
        setIsModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Add Item Error:", error);

      const errorMessage = error?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  const handleDeleteItem = async (itemId, isDelete) => {
    try {
      await dispatch(deleteItems({ itemId, isDelete })).unwrap();
      toast.success(`Item ${!isDelete ? "Deleted" : "Restored"}`);
    } catch (error) {
      console.error("Delete Item Error:", error);

      const errorMessage = error?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  const handleEditItems = async (id) => {
    

    if (
      !editItem.name ||
      !editItem.description ||
      !editItem.quantity ||
      !editItem.price
    )
      return;

    try {
      await dispatch(updateItem({id, editItem })).unwrap();

      setTimeout(() => {
        toast.success("Item edited");
        setEditItem({ id:'',name: "", description: "", quantity: "", price: "" });
        setisEditModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error("edit Item Error:", error);

      const errorMessage = error?.message || "Something went wrong!";
      toast.error(errorMessage);
    }

  };

  const renderItemRow = (item) => (
    <>
      <td className="px-4 py-2 border">{item.name}</td>
      <td className="px-4 py-2 border">{item.description}</td>
      <td className="px-4 py-2 border">{item.quantity}</td>
      <td className="px-4 py-2 border">{item.price}</td>
      <td className="px-4 py-2 text-center border">
        {!item.isDelete && (
          <button
            className="w-22 bg-indigo-400 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors"
            onClick={() => {
              toggleEdit(item);
              setisEditModalOpen(true);
            }}
          >
            edit
          </button>
        )}
        <button
          className="w-22 bg-red-400 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors ml-3"
          onClick={() => handleDeleteItem(item._id, item.isDelete)}
        >
          {item.isDelete ? "Deleted" : "Delete"}
        </button>
      </td>
    </>
  );

  const toggleEdit = (item) => {
    setEditItem({
      id: item._id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
    });
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row min-h-screen">
        <SideBar page={"Inventory"} />
        <div className="flex-1 p-4 md:ml-12 transition-all duration-300">
          <SearchBar search={search} setSearch={setSearch} />
          <button
            className="ml-4 w-50 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Add New Items
          </button>
          <Table
            data={currentItems}
            columns={["Name", "Description", "Quantity", "Price", "Actions"]}
            renderRow={renderItemRow}
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
            <h2 className="text-lg font-semibold mb-4">Add New item</h2>
            <input
              type="text"
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
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
                onClick={handleAddItems}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Item</h2>
            <input
              type="text"
              placeholder="Name"
              value={editItem.name}
              onChange={(e) =>
                setEditItem({ ...editItem, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={editItem.description}
              onChange={(e) =>
                setEditItem({ ...editItem, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={editItem.quantity}
              onChange={(e) =>
                setEditItem({ ...editItem, quantity: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={editItem.price}
              onChange={(e) =>
                setEditItem({ ...editItem, price: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setisEditModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={()=>handleEditItems(editItem.id)}
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

export default Home;
