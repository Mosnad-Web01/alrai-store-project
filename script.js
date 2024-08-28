'use strict';

// Product.js
class Product {
  constructor(image, title) {
    this.image = image;
    this.title = title;
  }
}

// StoreAPI.js
class StoreAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchProducts() {
    const url = `${this.baseURL}/products`;
    const res = await fetch(url);
    return res.json();
  }

  async fetchProduct(productId) {
    const url = `${this.baseURL}/products/${productId}`;
    const res = await fetch(url);
    return res.json();
  }
}

// Store.js
class Store {
  constructor() {
    this.storeAPI = new StoreAPI('https://fakestoreapi.com');
    this.CONTAINER = document.querySelector('.container');
    this.CATEGORY_CONTAINER = document.querySelector('.category-container');
  }

  async autorun() {
    const products = await this.fetchProducts();
    this.renderProducts(products);

    // Fetch categories and render them
    this.fetchCategories().then((categories) => {
      this.renderCategories(categories);
    });
  }

  async fetchCategories() {
    const url = `${this.storeAPI.baseURL}/products/categories`;
    const res = await fetch(url);
    return res.json();
  }

  renderCategories(categories) {
    this.CATEGORY_CONTAINER.innerHTML = '';

    // Add the custom "All" category
    const allCategoryButton = document.createElement('button');
    allCategoryButton.textContent = 'All';
    allCategoryButton.addEventListener('click', () => {
      this.filterProductsByCategory('all');
    });

    // Add the fetched categories
    categories.forEach((category) => {
      const categoryButton = document.createElement('button');
      categoryButton.textContent = category;
      categoryButton.addEventListener('click', () => {
        this.filterProductsByCategory(category);
      });
      this.CATEGORY_CONTAINER.appendChild(categoryButton);
    });

    // Append the custom "All" button at the beginning
    this.CATEGORY_CONTAINER.insertBefore(
      allCategoryButton,
      this.CATEGORY_CONTAINER.firstChild
    );
  }

  async filterProductsByCategory(category) {
    if (category === 'all') {
      try {
        const products = await this.fetchProducts();
        this.clearContainer(); // Add this line
        this.renderProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    } else {
      try {
        const url = `${this.storeAPI.baseURL}/products/category/${category}`;
        const res = await fetch(url);
        const products = await res.json();

        // Clear existing products
        this.clearContainer();

        // Render filtered products
        this.renderProducts(products);
      } catch (error) {
        console.error('Error fetching filtered products:', error);
      }
    }
  }

  async fetchProducts() {
    return this.storeAPI.fetchProducts();
  }

  async fetchProduct(productId) {
    return this.storeAPI.fetchProduct(productId);
  }

  clearContainer() {
    this.CONTAINER.innerHTML = '';
  }

  renderProducts(products) {
    let row = [];

    products.forEach((product) => {
      const productDiv = document.createElement('div');
      productDiv.className = 'col-md-4 mb-4'; // Changed from 3 to 4 columns
      row.push(productDiv);

      productDiv.innerHTML = `
      <div class="card shadow features-card" data-id=${product.id}>
        <div class="card-body d-flex flex-column justify-content-space-evenly">
          <div class="card-img-top">
            <img class="card-img-top img-fluid" src=${product.image} alt=${product.title} />
          </div>
          <div class="card-title text-center h5 fw-normal text-muted mt-">
            ${product.title}
          </div>
          <div class="card-text text-center">
            <span class="h4 text-center">${product.price}</span>
          </div>
          <div class="features-icons">
            <div class="f-icons d-flex justify-content-center align-items-center">
              <span class="tt addBtn" data-bs-toggle="tooltip" data-bs-placement="top" title="Add to cart" data-id=${product.id}>
                <i class="bi bi-cart-plus rounded-circle text-center me-4" data-bs-toggle="offcanvas" data-bs-target="#cart" aria-controls="offcanvasRight"> Add to Cart</i>
              </span>
            </div>
          </div>
        </div>
      </div>
    `;

      productDiv.addEventListener('click', () => {
        this.productDetails(product);
      });
    });

    // Append products to the row
    let rowContainer = document.createElement('div');
    rowContainer.className = 'row';
    row.forEach((item) => {
      rowContainer.appendChild(item);
    });

    // Clear existing products and append new row
    this.CONTAINER.innerHTML = '';
    this.CONTAINER.appendChild(rowContainer);

    // Add empty rows after every full row
    for (let i = 0; i < 3; i++) {
      const emptyRow = document.createElement('div');
      emptyRow.className = 'row';
      this.CONTAINER.appendChild(emptyRow);
    }
  }

  async productDetails(product) {
    const res = await this.fetchProduct(product.id);
    this.renderProduct(res);
  }

  renderProduct(product) {
    this.CONTAINER.innerHTML = `
      <div class="card shadow features-card" data-id=${product.id}>
        <div class="card-body d-flex flex-column justify-content-space-evenly" data-toggle="modal" data-target="#exampleModalCenter">
          <div class="card-img-top">
            <img class="card-img-top img-fluid" src=${product.image} alt=${product.title} />
          </div>
          
            <div class="card-title text-center h5 fw-normal text-muted mt-">
              ${product.title}
            </div>
            <div class="card-text text-center">
              <span class="h4 text-center">${product.price}</span>
            </div>
            <div class="features-icons">
              <div class="f-icons d-flex justify-content-center align-items-center">
                <span class="tt addBtn" data-bs-toggle="tooltip" data-bs-placement="top" title="Add to cart" data-id=${product.id}>
                  <i class="bi bi-cart-plus rounded-circle text-center me-4" data-bs-toggle="offcanvas" data-bs-target="#cart" aria-controls="offcanvasRight"> Add to Cart</i>
                </span>
              </div>
            </div>
        </div>
      </div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Store().autorun();
});
