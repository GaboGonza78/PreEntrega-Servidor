import fs from "node:fs";
import { v4 as uuid } from "uuid";

class ProductService {
  path;
  products = [];

  constructor({ path }) {
    this.path = path;
   
    if (fs.existsSync(path)) {
      try {
        
        this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
      } catch (error) {
        
        this.products = [];
      }
    } else {
      
      this.products = [];
    }
  }
   
  async getAll() {
    return this.products;
  }

  async getById({ id }) {
    const product = this.products.find((product) => product.id === id);
    return product;
  }

  async create({ title, content, description }) {
    const id = uuid();

    const product = {
      id,
      title,
      content,
      description,
    };

    this.products.push(product);

    try {
      await this.saveOnFile();

      return product;
    } catch (error) {
      console.log(error);

      console.error("Error al guardar el archivo");
    }
  }

  async update({ id, title, content, description }) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      return null;
    }

    product.title = title ?? product.title;
    product.content = content ?? product.content;
    product.description = description ?? product.description;

    const index = this.products.findIndex((product) => product.id === id);

    this.products[index] = product;

    try {
      await this.saveOnFile();

      return product;
    } catch (error) {
      console.error("Error al actualizar el archivo");
    }
  }

  async delete({ id }) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      return null;
    }

    const index = this.products.findIndex((product) => product.id === id);

    this.products.splice(index, 1);

    try {
      await this.saveOnFile();

      return product;
    } catch (error) {
      console.error("Error al eliminar el archivo");
    }
  }

  async saveOnFile() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      console.log(error);

      console.error("Error al guardar el archivo");
    }
  }
}

export const productService = new ProductService({
  path: "./src/db/products.json",
});