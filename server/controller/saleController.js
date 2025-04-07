import ItemModel from "../model/ItemModel.js";
import SaleModel from "../model/SalesModel.js";

export const getSales = async(req,res)=>{
    try {
        const sales = await SaleModel.find().populate('itemId').populate('customerId')
        res.status(200).json({ success: true, sales });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
   
}

export const addSales = async(req,res)=>{
    const {item,quantity,price,customer,totalPrice} = req.body
    const itemData = await ItemModel.findById(item)
    if(!itemData){
        return res.status(400).json({ message: 'Item not found' });
    }
    if(itemData.isDelete){
        return res.status(400).json({ message: 'Item deleted' });
    }
    if(itemData.quantity < quantity){
        return res.status(400).json({ message: 'Not enough stock' });
    }
    itemData.quantity -= quantity
    await itemData.save()
    const sale = await SaleModel.create({
        itemId:item,
        quantity:quantity,
        customerId:customer,
        price:price,
        totalPrice:totalPrice
    })
    if(sale){
        return res
      .status(200)
      .json({ message: "sale recorded successfull", sale });
    }
    return res.status(400).json({ message: "sale recording Failed" });
}