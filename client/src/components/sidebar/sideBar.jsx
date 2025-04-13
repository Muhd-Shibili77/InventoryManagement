import React, { useState } from "react";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate } from "react-router";



function SideBar(props) {
  const navigate = useNavigate()
  
  const [active, setActive] = useState(props.page);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Inventory", route:'inventory', key: "Inventory" },
    { name: "Customers", route:'customers', key: "Customers" },
    { name: "Sales", route:'sales', key: "Sales" },
    { name: "Stock", route:'stocks', key: "Stock" },
    { name: "Report", route:'report', key: "Report" },
    { name: "Logout", key: "Logout" }
  ];



  const handleLogout = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="fixed inset-0 flex items-center justify-center  z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
              <h2 className="text-xl font-semibold text-gray-800">Logout Confirmation</h2>
              <p className="text-gray-600 mt-2">Are you sure you want to logout?</p>
              <div className="flex justify-center mt-5 gap-4">
                <button
                  onClick={() => {
                    localStorage.removeItem('token')
                    navigate("/");
                    onClose();
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Yes, Logout
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
  return (
    <>
      

      {/* Sidebar */}
      <div
        className={`h-screen w-64 bg-white shadow-md p-5 flex flex-col fixed top-0 left-0 z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Logo Section */}
        <div className="flex items-center space-x-2 text-xl font-semibold">
          <span>Inventory Management</span>
        </div>

        <hr className="mb-4 mt-5" />

        {/* Menu Items */}
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-200 ${
                active === item.key ? "bg-indigo-200 text-indigo-600" : "text-gray-700"
              }`}
              onClick={() => {
                if(item.key == 'Logout'){
                  handleLogout()
                }else{
                  navigate(`/${item.route}`)
                  setActive(item.key);
                  
                }
              }}
            >
             <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

     
    </>
  );
}

export default SideBar;
