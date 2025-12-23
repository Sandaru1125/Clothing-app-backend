import Order from "../models/order.js";
import Product from "../models/product.js";

async function createOrder(req, res) {
  try {
    const { product: productId, name, phone, address, city } = req.body;

    if (!productId || !name || !phone || !address || !city) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with id ${productId} not found` });
    }

    // Generate a unique order ID
    let orderID = "ORD0001";
    const lastOrder = await Order.findOne().sort({ date: -1 });
    if (lastOrder && lastOrder.orderID) {
      const lastId = parseInt(lastOrder.orderID.replace("ORD", ""), 10);
      orderID = `ORD${(lastId + 1).toString().padStart(4, "0")}`;
    }

    const orderData = {
      orderID,
      // email: req.user.email, // Temporarily removed for simplicity
      name,
      address: `${address}, ${city}`,
      phoneNumber: phone,
      billItems: [
        {
          product: product._id,
          quantity: 1, // Assuming quantity is always 1 for "Buy Now"
        },
      ],
      total: product.price, // Total is just the product price
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error });
  }
}

async function getOrders(req, res) {
  try {
    // Not checking for user, fetching all orders.
    const orders = await Order.find().populate("billItems.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
}

async function updateOrder(req, res) {
  try {
    const { orderID } = req.params;
    const { status } = req.body; // Assuming you just update the status

    // Not checking for user role for simplicity
    const order = await Order.findOneAndUpdate(
      { orderID },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
}

export default {
  createOrder,
  getOrders,
  updateOrder,
};

