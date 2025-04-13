import transporter from "../config/nodeMailer";
interface SalesReportItem {
  itemId: { name: string };
  customerId: { name: string };
  quantity: number;
  price: number;
  totalPrice: number;
}

interface ItemReport {
  name: string;
  description: string;
  quantity: number;
  price: number;
}

interface LedgerReport {
  date: string;
  itemName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export class MailService{
    
    static async sendReportEmail( recipientEmail:string, reportType:string, reportData:any, subject:string):Promise<void>{
        try {
            const htmlContent = this.generateReportHtml(reportType, reportData);

            const mailOptions = {
                from: process.env.EMAIL,
                to:recipientEmail,
                subject,
                html: htmlContent,
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send email");
        }
    }


    static generateReportHtml(
      reportType: string,
      reportData: SalesReportItem[] | ItemReport[] | LedgerReport[]
    ): string {
      let tableHeaders = '';
      let tableRows = '';
    
      if (reportType === 'sales') {
        const salesData = reportData as SalesReportItem[];
        tableHeaders = `
          <th>Item</th>
          <th>Customer</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        `;
    
        tableRows = salesData
          .map((sale) => `
            <tr>
              <td>${sale.itemId.name}</td>
              <td>${sale.customerId.name}</td>
              <td>${sale.quantity}</td>
              <td>₹${sale.price}</td>
              <td>₹${sale.totalPrice}</td>
            </tr>
          `)
          .join('');
      } else if (reportType === 'items') {
        const itemsData = reportData as ItemReport[];
        tableHeaders = `
          <th>Name</th>
          <th>Description</th>
          <th>Stock</th>
          <th>Price</th>
        `;
    
        tableRows = itemsData
          .map((item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>₹${item.price}</td>
            </tr>
          `)
          .join('');
      } else if (reportType === 'ledger') {
        const ledgerData = reportData as LedgerReport[];
        tableHeaders = `
          <th>Date</th>
          <th>Item</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        `;
    
        tableRows = ledgerData
          .map((entry) => `
            <tr>
              <td>${new Date(entry.date).toLocaleDateString()}</td>
              <td>${entry.itemName || 'Unknown Item'}</td>
              <td>₹${entry.price}</td>
              <td>${entry.quantity}</td>
              <td>₹${entry.totalPrice}</td>
            </tr>
          `)
          .join('');
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
            <thead><tr>${tableHeaders}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
          <p>This report was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.</p>
        </body>
        </html>
      `;
    }
    

}