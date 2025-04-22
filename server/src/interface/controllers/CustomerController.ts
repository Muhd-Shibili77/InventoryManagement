import { Request, Response } from "express";
import { CustomerUseCase } from "../../application/useCases/CustomerUseCase";
import { StatusCode } from "../../application/constants/statusCode";

export class CustomerController {
  constructor(private CustomerUseCase: CustomerUseCase) {}

  async getCustomer(req: Request, res: Response) {
    try {
      const search: string = (req.query.search as string) || "";
      const page: number = parseInt(req.query.page as string) || 1;
      const limit: number = parseInt(req.query.limit as string) || 20;
      const query = search ? { name: { $regex: search, $options: "i" } } : {};
      const  { customers, totalPages } = await this.CustomerUseCase.getCustomer(
        query,
        page,
        limit
      );
      return res.status(StatusCode.OK).json({
        success: true,
        message: "customer list fetching successfull",
        customers,
        currentPage: page,
        totalPages: totalPages,
      });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to fetch customer",
      });
    }
  }

  async addCustomer(req: Request, res: Response) {
    try {
      const { name, address, phone } = req.body;
      const customer = await this.CustomerUseCase.addCustomer(
        name,
        address,
        phone
      );
      return res.status(StatusCode.OK).json({
        success: true,
        message: "customer adding successful",
        customer,
      });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to add customer",
      });
    }
  }
  async updateCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { name, address, phone } = req.body;

      const customer = await this.CustomerUseCase.updateCustomer(
        id,
        name,
        address,
        phone
      );

      return res.status(StatusCode.OK).json({
        success: true,
        message: "customer updated successfully",
        customer,
      });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to update customer",
      });
    }
  }
  async deleteCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isDelete } = req.body;

      await this.CustomerUseCase.deleteCustomer(id, isDelete);
      return res.status(StatusCode.OK).json({
        success: true,
        message: `customer ${!isDelete} successfully`,
      });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to delete customer",
      });
    }
  }

  async ledgerCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const customer = await this.CustomerUseCase.ledgerCustomer(id);
      return res.status(StatusCode.OK).json({
        success: true,
        message: "customer ledger fetching successfull",
        ledger: customer,
      });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to fetch customer ledger",
      });
    }
  }
}
