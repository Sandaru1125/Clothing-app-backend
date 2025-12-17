import Product from "../models/product.js";

/* =========================
   CREATE PRODUCT (ADMIN)
========================= */
export async function createProduct(req, res) {
  if (!req.user) {
    return res.status(403).json({
      message: "You need to login first",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to create products",
    });
  }

  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: "Product not saved",
      error: err.message,
    });
  }
}

/* =========================
   GET PRODUCTS (PUBLIC)
   ?category=men|women|kids
========================= */
export async function getProduct(req, res) {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: "Products not found",
    });
  }
}

/* =========================
   GET PRODUCT BY ID
========================= */
export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching product",
    });
  }
}

/* =========================
   DELETE PRODUCT (ADMIN)
========================= */
export async function deleteProduct(req, res) {
  if (!req.user) {
    return res.status(403).json({
      message: "You need to login first",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to delete products",
    });
  }

  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Product not deleted",
    });
  }
}

/* =========================
   UPDATE PRODUCT (ADMIN)
========================= */
export async function updateProduct(req, res) {
  if (!req.user) {
    return res.status(403).json({
      message: "You need to login first",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to update products",
    });
  }

  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.json({
      message: "Product updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Product not updated",
    });
  }
}

export default {
  createProduct,
  getProduct,
  getProductById,
  deleteProduct,
  updateProduct,
};
