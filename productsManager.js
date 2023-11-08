const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    if (fs.existsSync(this.path)) {
      try {
        let products = fs.readFileSync(this.path, "utf-8");
        this.products = JSON.parse(products);
      } catch {
        this.products = [];
      }
    } else {
      this.products = [];
    }
  }

  async saveFile() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t")
      );
    } catch (error) {
      console.log(`Error saving products file: ${error}`);
    }
  }

  async addProduct(product) {
    let existingProduct = this.products.find(
      (prod) => prod.code === product.code
    );
    if (!existingProduct) {
      let productId;
      this.products.length > 0
        ? (productId = this.products[this.products.length - 1].id + 1)
        : (productId = 1);
      let newProduct = { id: productId, ...product };
      this.products.push(newProduct);
      await this.saveFile();
      console.log(`Product "${product.title}" added to products list.`);
    } else {
      console.log(
        `The product "${product.title}" is already on the products list.`
      );
    }
  }

  getProducts() {
    console.log(this.products);
  }

  findProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  getProductsById(id) {
    let profuctFound = this.findProductById(id);
    if (!profuctFound) {
      console.log(`No product found with id "${id}".`);
    } else {
      console.log(profuctFound);
    }
  }

  async updateProduct(id, updateData) {
    let productToUpdate = this.findProductById(id);

    if (!productToUpdate) {
      console.log(`No product to update with id "${id}".`);
    } else {
      for (const key in updateData) {
        if (Object.prototype.hasOwnProperty.call(updateData, key)) {
          productToUpdate[key] = updateData[key];
        } else {
          console.log("Error updating product, invalid property");
        }
      }
      await this.saveFile();
      console.log(`Product with id "${id}" updated.`);
    }
  }

  async deleteProduct(id) {
    let productToDelete = this.findProductById(id);

    if (!productToDelete) {
      console.log(`No product to delete with id "${id}".`);
    } else {
      let productsUpdated = this.products.filter((product) => product.id != id);
      this.products = productsUpdated;
      await this.saveFile();
      console.log("Product deleted");
    }
  }
}

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
  }
}

/*Async TESTING*/

// const createProductsList = async () => {
//   //Initializing async ProductManager with path
//   const asyncProductsList = new ProductManager("./AsyncProductsList.json");
//   //Call to getProducts() with no products added
//   asyncProductsList.getProducts();
//   //Call to addProduct() with 1st test product
//   await asyncProductsList.addProduct(
//     new Product("test title", "test description", 10, "test img", "AbC123", 10)
//   );
//   //Call to addProduct() with 2nd test product
//   await asyncProductsList.addProduct(
//     new Product(
//       "test title2",
//       "test description2",
//       20,
//       "test img2",
//       "AbC1232",
//       20
//     )
//   );
//   //Call to addProduct() with 1st test product again to test validation
//   await asyncProductsList.addProduct(
//     new Product("test title", "test description", 10, "test img", "AbC123", 10)
//   );
//   //Call to getProducts() with products added
//   asyncProductsList.getProducts();
//   //Call to getProductById() with existing id
//   asyncProductsList.getProductsById(1);
//   //Call to getProductById() with non existing id
//   asyncProductsList.getProductsById(9);
//   //Call to deleteProduct() with existing id
//   await asyncProductsList.deleteProduct(1);
//   //Call to deleteProduct() with non existing id
//   await asyncProductsList.deleteProduct(7);
//   //Call to addProduct() with 3rt product to validate correct id generation after deleting product
//   await asyncProductsList.addProduct(
//     new Product(
//       "test title3",
//       "test description3",
//       30,
//       "test img3",
//       "AbC1233",
//       30
//     )
//   );
//   //Call to updateProduct() with non existing id to check validation
//   await asyncProductsList.updateProduct(6, { price: 2000 });
//   //Call to updateProduct() with one property
//   await asyncProductsList.updateProduct(2, { price: 500 });
//   //Call to updateProduct() with complete object
//   await asyncProductsList.updateProduct(3, {
//     title: "new title",
//     description: "new description",
//     price: 1000,
//     thumbnail: "new img",
//     code: "new code",
//     stock: 50,
//   });
// };
// createProductsList();

//-------EXPECTED OUTCOME---------
/*
[]
Product "test title" added to products list.
Product "test title2" added to products list.
The product "test title" is already on the products list.
[
  {
    id: 1,
    title: 'test title',
    description: 'test description',
    price: 10,
    thumbnail: 'test img',
    code: 'AbC123'
  },
  {
    id: 2,
    title: 'test title2',
    description: 'test description2',
    price: 20,
    thumbnail: 'test img2',
    code: 'AbC1232'
  }
]
{
  id: 1,
  title: 'test title',
  description: 'test description',
  price: 10,
  thumbnail: 'test img',
  code: 'AbC123'
}
No product found with id "9".
Product deleted
No product to delete with id "7".
Product "test title3" added to products list.
No product to update with id "6".
Product with id "2" updated.
Product with id "3" updated.
*/

//---------------------------------------------------------------------------

/*Sync TESTING*/
//This testing should be executed by blocks keeping initalization uncommented.
//The final result on sync TEST file should be the same that in async TEST file,
//but block expected outcomes may be different due to asyncronism.
//**ALSO, SOMETIMES THE FS MODULE DOESN'T SAVE FILES CORRECTLY SO DOUBLE CHECK PLEASE */

//Initializing Sync ProductManager with new path
//const syncProductList = new ProductManager("./SincProductsList.json");

//----BLOCK 1----

// //Call to getProducts() without products
// syncProductList.getProducts();
// //Call to addProducts() with 1rst product
// syncProductList.addProduct(
//   new Product("test title", "test description", 10, "test img", "AbC123", 10)
// );
// //Call to addProducts() with 2nd product
// syncProductList.addProduct(
//   new Product(
//     "test title2",
//     "test description2",
//     20,
//     "test img2",
//     "AbC1232",
//     20
//   )
// );
// //Call to addProducts() with 1rst product to check code validation
// syncProductList.addProduct(
//   new Product("test title", "test description", 10, "test img", "AbC123", 10)
// );
// //Call to getProducts() with products
// syncProductList.getProducts();
// //Call to getProductById() with existing product
// syncProductList.getProductsById(1);
// //Call to getProductById() with non existing product
// syncProductList.getProductsById(9);

//----EXPECTED OUCTOME BLOCK 1----
/*
[]
The product "test title" is already on the products list. 
[
  {
    id: 1,
    title: 'test title',
    description: 'test description',
    price: 10,
    thumbnail: 'test img',
    code: 'AbC123'
  },
  {
    id: 2,
    title: 'test title2',
    description: 'test description2',
    price: 20,
    thumbnail: 'test img2',
    code: 'AbC1232'
  }
]
{
  id: 1,
  title: 'test title',
  description: 'test description',
  price: 10,
  thumbnail: 'test img',
  code: 'AbC123'
}
No product found with id "9".
Product "test title2" added to products list.
Product "test title" added to products list.
 */

//-----BLOCK 2-----

// //Call to deleteProduct() with existing id
// syncProductList.deleteProduct(1);
// //Call to deleteProduct() with non existing id
// syncProductList.deleteProduct(7);

//---EXPECTED OUTCOME BLOCK 2-----
/*
No product to delete with id "7".
Product deleted
*/

//----BLOCK 3 -----

// //Call to addProduct() to check id generation
// syncProductList.addProduct(
//   new Product(
//     "test title3",
//     "test description3",
//     30,
//     "test img3",
//     "AbC1233",
//     30
//   )
// );

//----EXPECTED OUTCOME BLOCK 3-----
/*
 Product "test title3" added to products list.
 */

//-----BLOCK 4-----

// //Call to updateProduct() with non existing id to check validation
// syncProductList.updateProduct(6, { price: 2000 });
// //Call to updateProduct() with one property
// syncProductList.updateProduct(2, { price: 500 });
// //Call to updateProduct() with complete object
// syncProductList.updateProduct(3, {
//   title: "new title",
//   description: "new description",
//   price: 1000,
//   thumbnail: "new img",
//   code: "new code",
//   stock: 50,
// });

//-----EXPECTED OUTCOME BLOCK 4-----
/*
No product to update with id "6".
Product with id "2" updated.
Product with id "3" updated.
*/
