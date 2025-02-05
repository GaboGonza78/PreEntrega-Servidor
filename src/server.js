import { productService } from "./services/product.service.js";
import express from "express";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/products", async (req, res) => {
  const products = await productService.getAll();

  res.status(200).json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  const product = await productService.getById({ id });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

app.product("/api/products", async (req, res) => {
  const { title, content, description } = req.body;

  try {
    const product = await productService.create({ title, content, description });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  const { title, content, description } = req.body;

  try {
    const product = await productService.update({ id, title, content, description });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productService.delete({ id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});