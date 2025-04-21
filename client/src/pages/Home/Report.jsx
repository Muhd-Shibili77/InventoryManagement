import React, { useState, useEffect } from "react";
import SideBar from "../../components/sidebar/sideBar";
import { useDispatch, useSelector } from "react-redux";
import { getSales } from "../../redux/saleSlice";
import { getItems } from "../../redux/itemSlice";
import { getCustomers } from "../../redux/customerSlice";
import axiosInstance from "../../services/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Report = () => {
  const dispatch = useDispatch();
  const { sales } = useSelector((state) => state.sale);
  const { items } = useSelector((state) => state.item);
  const { customers } = useSelector((state) => state.customer);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [filteredCustomers, setFilteredCustomer] = useState([]);
  const [activeTab, setActiveTab] = useState("sales");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
 
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  
  
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredSales, setFilteredSales] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  useEffect(() => {
    dispatch(getSales({}));
    dispatch(getItems({}));
    dispatch(getCustomers({}));
  }, [dispatch]);

  useEffect(() => {
    // Initialize filtered data when original data changes
    setFilteredSales(sales);
    setFilteredItems(items);
  }, [sales, items]);

  const handleSelectCustomer = async (customer) => {
    if (!customer) return;
  
    try {
      const response = await axiosInstance.get(
        `/customer/${customer}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setFilteredCustomer(response.data.ledger);
    } catch (error) {
      console.error("ledge Error:", error);
      const errorMessage = error?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };


  const applyDateFilter = () => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if ((start && start > now) || (end && end > now)) {
      toast.error("Date cannot be in the future");
      return;
    }
    if (start && end && start > end) {
      toast.error("Start date cannot be after end date");
      return;
    }
    
    if (activeTab === "sales") {
      const filtered = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        if (start && end) {
          return saleDate >= start && saleDate <= end;
        } else if (start) {
          return saleDate >= start;
        } else if (end) {
          return saleDate <= end;
        }
        return true;
      });
      setFilteredSales(filtered);
      setCurrentPage(1); // Reset to first page after filtering
    } else if (activeTab === "items") {
      const filtered = items.filter(item => {
        const itemDate = new Date(item.updatedAt);
        if (start && end) {
          return itemDate >= start && itemDate <= end;
        } else if (start) {
          return itemDate >= start;
        } else if (end) {
          return itemDate <= end;
        }
        return true;
      });
      setFilteredItems(filtered);
      setCurrentPage(1); // Reset to first page after filtering
    } else if (activeTab === "ledger" && filteredCustomers.length > 0) {
      const filtered = filteredCustomers.filter(entry => {
        const entryDate = new Date(entry.date);
        if (start && end) {
          return entryDate >= start && entryDate <= end;
        } else if (start) {
          return entryDate >= start;
        } else if (end) {
          return entryDate <= end;
        }
        return true;
      });
      setFilteredCustomer(filtered);
      setCurrentPage(1); // Reset to first page after filtering
    }
    
    // Hide date filter after applying
    setShowDateFilter(false);
  };

  // Reset filters
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilteredSales(sales);
    setFilteredItems(items);
    
    if (selectedCustomer) {
      handleSelectCustomer(selectedCustomer);
    }
    
    setCurrentPage(1);
    setShowDateFilter(false);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const currentLedger = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  
  const totalPages = (array) => Math.ceil(array.length / itemsPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const exportToExcel = () => {
    setDropdownOpen(false);
    let dataToExport = [];
  
    if (activeTab === "sales") {
      dataToExport = filteredSales.map((sale) => ({
        Item: sale.itemId.name,
        Customer: sale.customerId.name,
        Quantity: sale.quantity,
        Price: sale.price,
        Total: sale.totalPrice,
      }));
    } else if (activeTab === "items") {
      dataToExport = filteredItems.map((item) => ({
        Name: item.name,
        Description: item.description,
        Stock: item.quantity,
        Price: item.price,
      }));
    } else if (activeTab === "ledger") {
      dataToExport = filteredCustomers.map((entry) => {
        const item = items.find((itm) => itm._id === entry.itemId);
        return {
          Date: new Date(entry.date).toLocaleDateString(),
          Item: item ? item.name : "Unknown Item",
          Price: entry.price,
          Quantity: entry.quantity,
          Total: entry.totalPrice,
        };
      });
    }
  
    if (dataToExport.length === 0) {
      toast.info("No data available to export.");
      return;
    }
  
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${activeTab} Report`);
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
  
    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
  
    saveAs(blob, `${activeTab}_report_${new Date().toISOString()}.xlsx`);
  };
  
  const exportToPDF = () => {
    setDropdownOpen(false);
    let dataToExport = [];

    if (activeTab === "sales") {
      dataToExport = filteredSales.map((sale) => [
        sale.itemId.name,
        sale.customerId.name,
        sale.quantity,
        sale.price,
        sale.totalPrice,
      ]);
    } else if (activeTab === "items") {
      dataToExport = filteredItems.map((item) => [
        item.name,
        item.description,
        item.quantity,
        item.price,
      ]);
    } else if (activeTab === "ledger") {
      dataToExport = filteredCustomers.map((entry) => {
        const item = items.find((itm) => itm._id === entry.itemId);
        return [
          new Date(entry.date).toLocaleDateString(),
          item ? item.name : "Unknown Item",
          entry.price,
          entry.quantity,
          entry.totalPrice,
        ];
      });
    }

    if (dataToExport.length === 0) {
      toast.info("No data available to export.");
      return;
    }

    const doc = new jsPDF();

    let columns = [];

    if (activeTab === "sales") {
      columns = ["Item", "Customer", "Quantity", "Price", "Total"];
    } else if (activeTab === "items") {
      columns = ["Name", "Description", "Stock", "Price"];
    } else if (activeTab === "ledger") {
      columns = ["Date", "Item", "Price", "Quantity", "Total"];
    }

    doc.text(`${activeTab.toUpperCase()} REPORT`, 14, 15);
    autoTable(doc, {
      head: [columns],
      body: dataToExport,
      startY: 20,
    });

    doc.save(`${activeTab}_report_${new Date().toISOString()}.pdf`);
  };
  
  const openEmailModal = () => {
    setDropdownOpen(false);
    setEmailModalOpen(true);
    setEmailSubject(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report`);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    
    if (!emailRecipient) {
      toast.error("Please enter a recipient email address");
      return;
    }

    try {
      // Prepare the data to send
      let reportData = [];
      
      if (activeTab === "sales") {
        reportData = filteredSales.map(sale => ({
          itemId: { name: sale.itemId.name },
          customerId: { name: sale.customerId.name },
          quantity: sale.quantity,
          price: sale.price,
          totalPrice: sale.totalPrice,
        }));
      } else if (activeTab === "items") {
        reportData = filteredItems.map(item => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
        }));
      } else if (activeTab === "ledger") {
        reportData = filteredCustomers.map(entry => {
          const item = items.find(itm => itm._id === entry.itemId);
          return {
            date: entry.date,
            itemName: item ? item.name : "Unknown Item",
            price: entry.price,
            quantity: entry.quantity,
            totalPrice: entry.totalPrice,
          };
        });
      }

      if (reportData.length === 0) {
        toast.info("No data available to send.");
        return;
      }

      const response = await axiosInstance.post(
        "/sales/send-email",
        {
          recipientEmail: emailRecipient,
          reportType: activeTab,
          reportData: reportData,
          subject: emailSubject,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Report sent successfully");
        setEmailModalOpen(false);
        setEmailRecipient("");
      } else {
        toast.error(response.data.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Email sending error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to send email";
      toast.error(errorMessage);
    }
  };

  // Email Modal Component
  const EmailModal = () => {
    if (!emailModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h3 className="text-lg font-semibold mb-4">Send Report via Email</h3>
          <form onSubmit={sendEmail}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Email
              </label>
              <input
                type="email"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your Email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Report Subject"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Pagination Component
  const Pagination = ({ itemsArray, paginate }) => {
    const pageNumbers = [];
    
    for (let i = 1; i <= totalPages(itemsArray); i++) {
      pageNumbers.push(i);
    }
    
    return (
      <nav className="mt-4 flex justify-center">
        <ul className="flex space-x-2">
          {currentPage > 1 && (
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                &laquo;
              </button>
            </li>
          )}
          
          {pageNumbers.map(number => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 border rounded ${
                  currentPage === number ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {number}
              </button>
            </li>
          ))}
          
          {currentPage < totalPages(itemsArray) && (
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                &raquo;
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  };

  // Date Filter Component
  const DateFilter = () => {
    if (!showDateFilter) {
      return (
        <div className="mb-4">
          <button
            onClick={() => setShowDateFilter(true)}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            Filter by Date
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-3 items-center mb-4 bg-gray-50 p-3 rounded">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          />
        </div>
        
        <div className="flex items-end gap-2">
          <button
            onClick={applyDateFilter}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            Apply Filter
          </button>
          
          <button
            onClick={resetFilters}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const salesReport = (
    <div>
      <h2 className="text-xl font-semibold mb-2">Sales Report</h2>
      <DateFilter />

      

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 border px-3">S.no</th>
            <th className="py-2 border px-3">Date</th>
            <th className="py-2 border px-3">Invoice No</th>
            <th className="py-2 border px-3">Customer Name</th>
            <th className="py-2 border px-3">Item Name</th>
            <th className="py-2 border px-3">Quantity</th>
            <th className="py-2 border px-3">Price</th>
            <th className="py-2 border px-3">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {currentSales.map((sale, index) => (
            <tr key={sale.id}>
              <td className="py-1 border px-3">{indexOfFirstItem + index + 1}</td>
              <td className="py-1 border px-3">{new Date(sale.date).toDateString()}</td>
              <td className="py-1 border px-3">{sale.invoiceNumber}</td>
              <td className="py-1 border px-3">{sale.customerId.name}</td>
              <td className="py-1 border px-3">{sale.itemId.name}</td>
              <td className="py-1 border px-3">{sale.quantity}</td>
              <td className="py-1 border px-3">₹{sale.price}</td>
              <td className="py-1 border px-3">₹{sale.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <Pagination itemsArray={filteredSales} paginate={paginate} />
    </div>
  );

  const itemsReport = (
    <div>
      <h2 className="text-xl font-semibold mb-2">Items Report</h2>
      <DateFilter />

      <div className="mb-2 text-sm text-gray-500">
        Showing {currentItems.length} of {filteredItems.length} entries
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 border px-3">S.No</th>
            <th className="py-2 border px-3">Item Name</th>
            <th className="py-2 border px-3">Description</th>
            <th className="py-2 border px-3">Quantity in Stock</th>
            <th className="py-2 border px-3">Price/Unit</th>
            <th className="py-2 border px-3">Total Value</th>
            <th className="py-2 border px-3">Items Sold</th>
            <th className="py-2 border px-3">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.id}>
              <td className="py-1 border px-3">{indexOfFirstItem + index + 1}</td>
              <td className="py-1 border px-3">{item.name}</td>
              <td className="py-1 border px-3">{item.description}</td>
              <td className="py-1 border px-3">{item.quantity}</td>
              <td className="py-1 border px-3">₹{item.price}</td>
              <td className="py-1 border px-3">₹{item.price * item.quantity}</td>
              <td className="py-1 border px-3">{item.saled}</td>
              <td className="py-1 border px-3">{new Date(item.updatedAt).toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <Pagination itemsArray={filteredItems} paginate={paginate} />
    </div>
  );

  const ledgerBook = (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ledger Book</h2>

      {/* Customer Dropdown */}
      <div className="flex gap-4 mb-4">
        <select
          value={selectedCustomer || ""}
          onChange={(e) => {
            handleSelectCustomer(e.target.value);
            setSelectedCustomer(e.target.value);
            setShowDateFilter(false); // Reset date filter visibility when customer changes
          }}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCustomer && <DateFilter />}

      {filteredCustomers.length > 0 ? (
        <>
          <div className="mb-2 text-sm text-gray-500">
            Showing {currentLedger.length} of {filteredCustomers.length} entries
          </div>

          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 border px-3 text-left">Invoice No</th>
                <th className="py-2 border px-3 text-left">Date</th>
                <th className="py-2 border px-3 text-left">Item Name</th>
                <th className="py-2 border px-3 text-left">Price</th>
                <th className="py-2 border px-3 text-left">Quantity</th>
                <th className="py-2 border px-3 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {currentLedger.map((entry) => {
                
                return (
                  <tr key={entry.id}>
                    <td className="py-1 border px-3">
                      {entry.invoiceNumber || "N/A"}
                    </td>
                    <td className="py-1 border px-3">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="py-1 border px-3">
                      {entry?.itemId?.name ? entry.itemId.name : "Unknown Item"}
                    </td>
                    <td className="py-1 border px-3">₹{entry.price}</td>
                    <td className="py-1 border px-3">{entry.quantity}</td>
                    <td className="py-1 border px-3">₹{entry.totalPrice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <Pagination itemsArray={filteredCustomers} paginate={paginate} />
        </>
      ) : (
        <p className="text-gray-500">
          {selectedCustomer ? "No ledger entries found for this customer." : "Please select a customer to view ledger entries."}
        </p>
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SideBar page={"Report"} />
      <div className="flex-1 p-4 md:ml-12 transition-all duration-300">
        <div className="mb-4 flex justify-between items-center">
          {/* Left side - Tab Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setActiveTab("sales");
                setCurrentPage(1);
                setShowDateFilter(false);
              }}
              className={`px-4 py-2 rounded ${
                activeTab === "sales"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Sales Report
            </button>
            <button
              onClick={() => {
                setActiveTab("items");
                setCurrentPage(1);
                setShowDateFilter(false);
              }}
              className={`px-4 py-2 rounded ${
                activeTab === "items"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Items Report
            </button>
            <button
              onClick={() => {
                setActiveTab("ledger");
                setCurrentPage(1);
                setShowDateFilter(false);
              }}
              className={`px-4 py-2 rounded ${
                activeTab === "ledger"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Ledger Book
            </button>
          </div>

          {/* Right side - Data Export Dropdown */}
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                id="options-menu"
                aria-haspopup="true"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Data Export
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {dropdownOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div className="py-1" role="none">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      setTimeout(()=>{
                          window.print();
                      },500)
                    }}
                  >
                    Print
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={exportToExcel}
                  >
                    Excel
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={exportToPDF}
                  >
                    PDF
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={openEmailModal}
                  >
                    Email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Displaying entries information */}
        <div className="mb-2 text-sm text-gray-500">
          Showing {itemsPerPage} entries per page
        </div>

        {/* Reports */}
        <div>
          {activeTab === "sales" && salesReport}
          {activeTab === "items" && itemsReport}
          {activeTab === "ledger" && ledgerBook}
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal />
      
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar />
    </div>
  );
};

export default Report;