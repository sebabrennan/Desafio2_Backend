const fs = require("fs");
const { title } = require("process");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, "utf8");
        return JSON.parse(products);
      } else return [];
    } catch (error) {
      console.error(error);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const product = {
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
      id: await this.#initId(),
    };
    try {
      const products = await this.getProducts();
      if ((title, description, price, thumbnail, code, stock)) {
        if (products.some((product) => product.code === code)) {
          console.error("No es posible agregar ese producto: código repetido");
          return false;
        } else {
          products.push(product);
          await fs.promises.writeFile(this.path, JSON.stringify(products));
          return true;
        }
      }
    } catch {
      console.error("Todos los campos son obligatorios");
      return false;
    }
  }

  async getProductById(productId) {
    try {
      const products = await this.getProducts();
      const checkId = products.find((product) => product.id === productId);
      if (!checkId) {
        return "Not found";
      } else return checkId;
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(productId, updateData) {
    try {
      const products = await this.getProducts();
      const product = await this.getProductById(productId);
      if (product) {
        const productIndex = products.findIndex(
          (product) => product.id === productId
        );
        const finalProduct = { ...product, ...updateData };
        products.splice(productIndex, 1, finalProduct);
        return await fs.promises.writeFile(this.path, JSON.stringify(products));
      }
    } catch {
      console.error("No fue posible actualizar el producto");
    }
  }

  async deleteProduct(productId) {
    try{
      const products = await this.getProducts();
      const productsFilter = products.filter((product) => product.id !== productId)
      return await fs.promises.writeFile(this.path, JSON.stringify(productsFilter));
    } catch {
      console.log("producto no encontrado para eliminar");
    }
  }

  async #initId() {
    const products = await this.getProducts();
    let idCode = products.length + 1;
    return idCode;
  }
}

const productManager = new ProductManager("./productsDB.json");

const test = async () => {
  await productManager.addProduct(
    "REMERA HIGH PLEASURE",
    "Remera manga corta con cuello redondo",
    29000,
    "https://acdn.mitiendanube.com/stores/001/343/102/products/tezza-90321-c88ac45352b76c5a7c16700049342456-640-0.webp,",
    4,
    1
  );
  await productManager.addProduct(
    "REMERA SMILE",
    "Fresca y cómoda para el verano, su tela permite que el pase del aire muy facilimente",
    29000,
    "https://acdn.mitiendanube.com/stores/001/343/102/products/tezza-15361-b5442d7cbc68f9a81516700036167374-480-0.webp",
    3,
    3
  );
  await productManager.addProduct(
    "REMERA SMILE",
    "Fresca y cómoda para el verano, su tela permite que el pase del aire muy facilimente",
    29000,
    "https://acdn.mitiendanube.com/stores/001/343/102/products/tezza-15361-b5442d7cbc68f9a81516700036167374-480-0.webp",
    5,
    3
  );
  await productManager.addProduct();
  console.log(await productManager.getProductById(1));
  console.log(
    await productManager.updateProduct(3, {
      title: "SEBASTIAN",
    })
  );
  console.log(await productManager.deleteProduct(3));
  console.log(await productManager.getProducts());
};

test();
