import Driver from "../models/Driver.js";

export async function getDrivers(req, res) {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createDriver(req, res) {
  try {
    const { name, phone, tankerNumber, status } = req.body;
    if (!name || !phone || !tankerNumber) {
      return res.status(400).json({ message: "Name, phone and tanker number are required." });
    }

    const driver = await Driver.create({
      name,
      phone,
      tankerNumber,
      status: status || "Available"
    });

    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateDriver(req, res) {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!driver) return res.status(404).json({ message: "Driver not found." });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
