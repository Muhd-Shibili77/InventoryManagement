import { ISaleRespository } from "../../application/interface/ISaleRepository";
import Customer from "../../domain/entity/Customer";
import Item from "../../domain/entity/Item";
import Sale from "../../domain/entity/Sale";
import Stock from "../../domain/entity/Stock";
import CustomerModel from "../models/customerModel";
import ItemModel from "../models/itemModel";
import SaleModel from "../models/saleModel";
import StockModel from "../models/stockModel";

export class SaleRepository implements ISaleRespository {
  generateInvoiceNumber(prefix = "INV"): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const random = Math.floor(1000 + Math.random() * 9000);

    return `${prefix}-${year}${month}${day}-${random}`;
  }

  async getSale(): Promise<Sale[]> {
    const sales = await SaleModel.find()
      .populate("itemId")
      .populate("customerId")
      .sort({ date: -1 });
    return sales.map(
      (sale) =>
        new Sale({
          id: sale.id,
          invoiceNumber: sale.invoiceNumber,
          itemId: sale.itemId,
          quantity: sale.quantity,
          price: sale.price,
          totalPrice: sale.totalPrice,
          date: sale.date,
          customerId: sale.customerId,
        })
    );
  }

  async addSale(
    item: string,
    quantity: number,
    price: number,
    customer: string,
    totalPrice: number
  ): Promise<Sale> {
    const itemExist = await ItemModel.findOne({ _id: item });

    if (!itemExist) {
      throw new Error("Item not found");
    }

    const invoiceNumber = this.generateInvoiceNumber();

    const sale = await SaleModel.create({
      invoiceNumber,
      itemId: item,
      quantity,
      customerId: customer,
      price,
      totalPrice,
    });

    itemExist.quantity = Number(itemExist.quantity) - Number(quantity);
    itemExist.saled = Number(itemExist.saled) + Number(quantity);

    await itemExist.save();

    return new Sale({
      id: sale.id,
      invoiceNumber: sale.invoiceNumber,
      itemId: sale.itemId,
      quantity: sale.quantity,
      customerId: sale.customerId,
      price: sale.price,
      totalPrice: sale.totalPrice,
    });
  }

  async editSale(
    id: string,
    item: string,
    quantity: number,
    price: number,
    customer: string,
    totalPrice: number
  ): Promise<Sale> {
    const originalSale = await SaleModel.findById(id);
    if (!originalSale) throw new Error("Sale not found");

    if (originalSale.itemId.toString() === item) {
      // Same item: just adjust quantity differences
      const itemExist = await ItemModel.findById(item);
      if (itemExist) {
        const quantityDifference = originalSale.quantity - quantity;
        itemExist.quantity += quantityDifference;
        itemExist.saled -= quantityDifference;
        await itemExist.save();
      }
    } else {
      // Different item: revert original item's quantity/saled
      const originalItem = await ItemModel.findById(originalSale.itemId);
      if (originalItem) {
        originalItem.quantity += originalSale.quantity;
        originalItem.saled -= originalSale.quantity;
        await originalItem.save();
      }

      // Apply changes to new item
      const newItem = await ItemModel.findById(item);
      if (newItem) {
        newItem.quantity -= quantity;
        newItem.saled += quantity;
        await newItem.save();
      }
    }

    const updatedSale = await SaleModel.findByIdAndUpdate(
      id,
      {
        itemId: item,
        quantity,
        customerId: customer,
        price,
        totalPrice,
      },
      { new: true }
    );

    if (!updatedSale) throw new Error("Sales update failed");

    return new Sale({
      id: updatedSale.id,
      invoiceNumber: updatedSale.invoiceNumber,
      itemId: updatedSale.itemId,
      quantity: updatedSale.quantity,
      customerId: updatedSale.customerId,
      price: updatedSale.price,
      totalPrice: updatedSale.totalPrice,
    });
  }

  async deleteSale(id: string): Promise<void> {
    await SaleModel.findByIdAndDelete(id);
  }

  async finditemId(itemId: string): Promise<Item | null> {
    const item = await ItemModel.findById(itemId);
    if (!item) {
      return null;
    }
    return new Item({
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      isDelete: item.isDelete,
      description: item.description,
      saled: item.saled,
      updatedAt: item.updatedAt,
    });
  }

  async findcustomerId(customerId: string): Promise<Customer | null> {
    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      return null;
    }
    return new Customer({
      id: customer.id.toString(),
      name: customer.name,
      phone: customer.phone,
      isDelete: customer.isDelete,
    });
  }
  async addStock(
    itemId: string,
    type: string,
    quantity: number,
    description: string
  ): Promise<void> {
    const stock = await StockModel.create({
      itemId,
      type,
      quantity,
      description,
    });
    
  }
}
