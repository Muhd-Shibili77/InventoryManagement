import CustomerModel from "../model/CustomerModel.js";

export const getCustomer = async (req, res) => {
  try {
    const customers = await CustomerModel.find();
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addCustomer = async (req, res) => {
  const { name, address, phone } = req.body;
  const customer = await CustomerModel.findOne({ name });
  if (customer) {
    return res.status(400).json({ message: "customer already exist" });
  }
  const createCustomer = await CustomerModel.create({
    name: name,
    address: address,
    phone: phone,
  });

  if (createCustomer) {
    return res
      .status(200)
      .json({ message: "customer addedd successfull", createCustomer });
  }
  return res.status(400).json({ message: "customer Registration Failed" });
};
