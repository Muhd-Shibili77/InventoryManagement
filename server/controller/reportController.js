import ItemModel from "../model/ItemModel.js";
import SaleModel from "../model/SalesModel.js";
import sendEmail from "../services/email.js";

export const saleReport = async (req,res)=>{
    const sales = await SaleModel.find()
    res.json(sales)
}

export const itemReport = async (req,res)=>{
    const items = await ItemModel.find()
    res.json(items)
}

export const ledgerReport = async (req,res)=>{
    try {
        const customerId = req.query.customerId;
        const ledger = await SaleModel.find({customerId:customerId})
        res.status(200).json({ success: true, ledger });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
   
}

export const sendReportEmail = async (req,res)=>{
    try {
        const { recipientEmail, reportType, reportData, subject } = req.body;
        
        
        const htmlContent = generateReportHtml(reportType, reportData);
        
       
        await sendEmail({
          to: recipientEmail,
          subject: subject || `${reportType.toUpperCase()} Report`,
          html: htmlContent,
        });
        
        res.status(200).json({ success: true, message: "Report email sent successfully" });
      } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
      }
}




const generateReportHtml = (reportType, data) => {
    let tableHeaders = '';
    let tableRows = '';
    
    if (reportType === 'sales') {
      tableHeaders = `
        <th style="padding: 8px; border: 1px solid #ddd;">Item</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Customer</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
      `;
      
      tableRows = data.map(sale => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${sale.itemId.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${sale.customerId.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${sale.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${sale.price}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${sale.totalPrice}</td>
        </tr>
      `).join('');
    } else if (reportType === 'items') {
      tableHeaders = `
        <th style="padding: 8px; border: 1px solid #ddd;">Name</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Description</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Stock</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
      `;
      
      tableRows = data.map(item => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.description}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${item.price}</td>
        </tr>
      `).join('');
    } else if (reportType === 'ledger') {
      tableHeaders = `
        <th style="padding: 8px; border: 1px solid #ddd;">Date</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Item</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
      `;
      
      tableRows = data.map(entry => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${new Date(entry.date).toLocaleDateString()}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${entry.itemName || 'Unknown Item'}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${entry.price}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${entry.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${entry.totalPrice}</td>
        </tr>
      `).join('');
    }
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th { background-color: #f2f2f2; text-align: left; }
          th, td { padding: 8px; border: 1px solid #ddd; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>${reportType.toUpperCase()} Report</h1>
        <p>Please find the ${reportType} report attached below:</p>
        
        <table>
          <thead>
            <tr>
              ${tableHeaders}
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        
        <p>This report was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.</p>
      </body>
      </html>
    `;
  };