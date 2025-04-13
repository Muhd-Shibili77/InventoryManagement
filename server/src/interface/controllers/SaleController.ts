import { Request, Response } from "express";
import { SaleUseCase } from "../../application/useCases/SaleUseCase";
import { StatusCode } from "../../application/constants/statusCode";

export class SaleController {
  constructor(private saleUseCase: SaleUseCase) {}

  async getSale(req: Request, res: Response) {
    try {
        const sales = await this.saleUseCase.getSale();
        return res.status(StatusCode.OK).json({
          success: true,
          message: "Sale list fetching successfull",
          sales,
        });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to fetch sale",
      });
        
    }
   
  }

  async addSale(req: Request, res: Response) {
    try {
      const { item, quantity, price, customer, totalPrice } = req.body;
      const sale = await this.saleUseCase.addSale(
        item,
        quantity,
        price,
        customer,
        totalPrice
      );
      return res.status(StatusCode.OK).json({
        success: true,
        message: "Sale adding successfull",
        sale,
      });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to add sale",
      });
    }
  }

  async editSale(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { item, quantity, price, customer, totalPrice } = req.body;
      const sale = await this.saleUseCase.editSale(
        id,
        item,
        quantity,
        price,
        customer,
        totalPrice
      );
      return res.status(StatusCode.OK).json({
        success: true,
        message: "Sale updated successfully",
        sale,
      });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to delete sale",
      });
    }
  }

  async deleteSale(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.saleUseCase.deleteSale(id);
      return res.status(StatusCode.OK).json({
        success: true,
        message: `Sale successfully deleted`,
      });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to delete sale",
      });
    }
  }

  async sendEmail(req: Request, res: Response) {
    try {
        const { recipientEmail, reportType, reportData, subject } = req.body;
        console.log(req.body);
      await this.saleUseCase.sendMail(recipientEmail, reportType, reportData, subject);
      return res.status(StatusCode.OK).json({
        success: true,
        message: "Email sent successfully",
      });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to send email",
      });
    }
  }
}
