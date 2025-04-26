import React, { useEffect, useState } from "react";
import SideBar from "../../components/sidebar/sideBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import { getItems, addItems, deleteItems,updateItem,addStock } from "../../redux/itemSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Home = () => {
  const dispatch = useDispatch();
  const { items, totalPages } = useSelector((state) => state.item);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState("");
  const [page,setPage] = useState(1)

  
   useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); 

    return () => clearTimeout(timer); 
  }, [search]);

  const refreshList = () => dispatch(getItems({ search:debouncedSearch, page }));

  useEffect(() => {
    refreshList();
  }, [dispatch,page,debouncedSearch]);


 
  
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    quantity: 0,
    price: "",
  });

  const [editItem, setEditItem] = useState({
    id: "",
    name: "",
    description: "",
    quantity: "",
    price: "",
  });
const [stockItem, setStockItem] = useState({
  itemId: "",
  stock: "",
  description: "",
})
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModel, setIsStockModel] = useState(false);
  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  

  

  

  const handleAddStock = async () => {
    if (!stockItem.itemId) {
      toast.error("Item ID is required");
      return;
    }
    
    if (!stockItem.stock) {
      toast.error("Stock quantity is required");
      return;
    }
    
    if (!stockItem.description) {
      toast.error("Description is required");
      return;
    }

      try {
    
        
        await dispatch(addStock({stockItem})).unwrap();
        setTimeout(() => {
          toast.success("Stock added");
          refreshList();
          setStockItem({ itemId: "", stock: "", description: "" });
          setIsStockModel(false);
        },1000)
        
      } catch (error) {
        console.error("Add Stock Error:", error);
        const errorMessage = error?.message || "Something went wrong!";
        toast.error(errorMessage);
        
      }
  }
  const handleAddItems = async () => {
      if (!newItem.name) {
        toast.error("name is required");
        return;
      }
      
      if (!newItem.description) {
        toast.error("Description is required");
        return;
      }
      
      if (!newItem.price) {
        toast.error("price is required");
        return;
      }

    try {
      await dispatch(addItems({ newItem })).unwrap();

      setTimeout(() => {
        toast.success("Item added");
        refreshList();
        setNewItem({ name: "", description: "", quantity: 0, price: "" });
        setIsModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Add Item Error:", error);

      const errorMessage = error?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  const handleDeleteItem = async (itemId, isDelete) => {
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
                      await dispatch(deleteItems({ itemId, isDelete })).unwrap();
                      toast.success(`Item ${!isDelete ? "Deleted" : "Restored"}`);
                      dispatch(getItems());
                    } catch (error) {
                      console.error("Delete Item Error:", error);
                
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





   
  };

  const handleEditItems = async (id) => {
    

    if (
      !editItem.name ||
      !editItem.description ||
      !editItem.price
    )
      return;

      if (!editItem.name) {
        toast.error("name is required");
        return;
      }
      
      if (!editItem.price) {
        toast.error("price is required");
        return;
      }
      
      if (!editItem.description) {
        toast.error("Description is required");
        return;
      }

    try {
      await dispatch(updateItem({id, editItem })).unwrap();

      setTimeout(() => {
        toast.success("Item edited");
        refreshList();
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
          <>
          
          <button
            className="w-22 bg-indigo-400 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors"
            onClick={() => {
              toggleEdit(item);
              setisEditModalOpen(true);
            }}
          >
            Edit
          </button>
          <button
            className="w-25 ml-2 bg-green-400 hover:bg-green-600 text-white py-2 px-2 rounded-lg transition-colors"
            onClick={() => {
              toggleStock(item);
              setIsStockModel(true);
            }}
          >
            Add stock
          </button>
          </>
        )}
        <button
          className="w-22 bg-red-400 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors ml-3"
          onClick={() => handleDeleteItem(item.id, item.isDelete)}
        >
          {item.isDelete ? "Deleted" : "Delete"}
        </button>
      </td>
    </>
  );

  const toggleEdit = (item) => {
    setEditItem({
      id: item.id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
    });
  };

  const toggleStock = (item) => {
    setStockItem({
      itemId: item.id,
    });
  }

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
            data={items}
            columns={["Name", "Description", "Quantity", "Price", "Actions"]}
            renderRow={renderItemRow}
          />
          <Pagination
            currentPage={page}
            setCurrentPage={setPage}
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
      {isStockModel && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add Stock</h2>
            <input
              type="number"
              placeholder="Stock"
              value={stockItem.stock}
              onChange={(e) =>
                setStockItem({ ...stockItem, stock: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={stockItem.description}
              onChange={(e) =>
                setStockItem({ ...stockItem, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
           
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsStockModel(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStock}
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
