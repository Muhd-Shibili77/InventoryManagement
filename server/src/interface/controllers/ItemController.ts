import { Request, Response } from "express";
import { ItemUseCase } from "../../application/useCases/ItemUseCase";
import { StatusCode } from "../../application/constants/statusCode";
export class ItemController {
  constructor(private itemUseCase: ItemUseCase) {}
  async getItem(req: Request, res: Response) {
    try {
      const search: string = (req.query.search as string) || "";
      const page: number = parseInt(req.query.page as string) || 1;
      const limit: number = parseInt(req.query.limit as string) || 20;

      const query = search ? { name: { $regex: search, $options: "i" } } : {};

      const { items, totalPages } = await this.itemUseCase.getItem(
        query,
        page,
        limit
      );
      return res.status(StatusCode.OK).json({
        success: true,
        message: "Item list fetching successfull",
        items,
        currentPage: page,
        totalPages: totalPages,
      });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to fetch item",
      });
    }
  }
  async addItem(req: Request, res: Response) {
    try {
      const { name, description, price, quantity } = req.body;
      const item = await this.itemUseCase.addItem(
        name,
        description,
        price,
        quantity
      );
      return res.status(StatusCode.OK).json({
        success: true,
        message: "Item adding successfull",
        item,
      });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to add item",
      });
    }
  }

  async updateItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price, quantity } = req.body;
      const item = await this.itemUseCase.updateItem(
        id,
        name,
        description,
        price,
        quantity
      );
      return res.status(StatusCode.OK).json({
        success: true,
        message: "Item updated successfully",
        item,
      });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to update item",
      });
    }
  }

  async deleteItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isDelete } = req.body;
      await this.itemUseCase.deleteItem(id, isDelete);
      return res.status(StatusCode.OK).json({
        success: true,
        message: `Item ${!isDelete} successfully`,
      });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to delete item",
      });
    }
  }
}
