import ItemModel from "../model/ItemModel.js";

export const getItems = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    const items = await ItemModel.find(query);
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addItems = async (req, res) => {
  const { name, description, quantity, price } = req.body;
  const createdItem = await ItemModel.create({
    name: name,
    description: description,
    quantity: quantity,
    price: price,
  });
  if (createdItem) {
    return res
      .status(200)
      .json({ message: "Item addedd successfull", createdItem });
  }
  return res.status(400).json({ message: "Item adding Failed" });
};

export const editItems = async (req, res) => {
  const { id } = req.query;
  const { name, description, quantity, price } = req.body;
  const item = await ItemModel.findByIdAndUpdate(
    id,
    {
      name,
      description,
      quantity,
      price,
    },
    { new: true }
  );

 
  if (item) {
    return res
      .status(200)
      .json({ message: "item updated successfull", editedItem:item });
  }
  return res.status(400).json({ message: "item updation Failed" });
};
export const deleteItems = async (req, res) => {
  const { id,isDelete } = req.query;
  await ItemModel.findByIdAndUpdate(id, { isDelete: isDelete });
  res.json({ message: "Deleted" });
};
