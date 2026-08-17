import Customer from "../models/Customer.js";

export async function getCustomers(req, res) {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createCustomer(req, res) {
  try {
    const { name, phone, address } = req.body;
    if (!name || !phone || !address) {
      return res.status(400).json({ message: "Name, phone and address are required." });
    }

    const customer = await Customer.create({ name, phone, address });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
