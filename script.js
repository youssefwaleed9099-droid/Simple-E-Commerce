document.addEventListener("DOMContentLoaded", intialise);

let allProducts;
let cart = [];
let currentProducts = [];
let currentSortValue = "default";
let currentFilterProducts = [];

function intialise() {
  fetchingPorducts();
  searchProuct();
  filterCategories();
  sortingProducts();
}

async function fetchingPorducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    allProducts = data;
    currentProducts = allProducts;
    displayProducts(allProducts);

    getPaginationNumbers();
    setCurrentPage(1);
    attachPaginationEvents();
  } catch (error) {
    console.error(error);
  }
}

function displayProducts(products) {
  const list = document.getElementById("list");

  // edited
  list.innerHTML = "";

  products
    .map((product) => {
      const { id, title, price, category, image } = product;
      list.innerHTML += `<li class="product-card">
        <div class="image-content">
            <img src="${image}" alt="${category}" />
        </div>
        <div class="product-content"> 
            <p class="product-price"> ${price}</p>
            <h4 class="product-title">${title.substring(0, 45)}</h4>
            <p>${category.toUpperCase()}</p>
        </div>
        <div>
            <button class="add-to-cart-btn" onclick='addToCart(${id})'>
            Add to Cart
            </button>
        </div>
    </li>`;
    })
    .join("");
}

// Filter function
function filterCategories() {
  const select = document.querySelector("#category-select");
  select.addEventListener("change", filterProducts);

  function filterProducts(e) {
    let list = document.querySelector("#list");
    let content;
    let option = e.target.value;

    list.innerHTML = "";

    switch (option) {
      case "all":
        content = allProducts;
        break;
      case "men":
        content = allProducts.filter((product) => {
          return product.category === "men's clothing";
        });
        break;
      case "women":
        content = allProducts.filter((product) => {
          return product.category === "women's clothing";
        });
        break;
      case "jewellery":
        content = allProducts.filter((product) => {
          return product.category === "jewelery";
        });
        break;
      case "electronics":
        content = allProducts.filter((product) => {
          return product.category === "electronics";
        });
        break;
      default:
        content = allProducts;
    }

    content
      .map((product) => {
        const { id, title, price, category, image } = product;
        list.innerHTML += `<li class="product-card">
        <div class="image-content">
            <img src="${image}" alt="${category}" />
        </div>
        <div class="product-content"> 
            <p class="product-price"> ${price}</p>
            <h4 class="product-title">${title.substring(0, 45)}</h4>
            <p>${category.toUpperCase()}</p>
        </div>
        <div>
            <button class="add-to-cart-btn" onclick='addToCart(${id})'>
            Add to Cart
            </button>
        </div>
    </li>`;
      })
      .join("");

    const sortOption = document.querySelector("#sort-select").value;
    const sortedContent = sortData(content, sortOption);

    // displayProducts(sortedContent)

    getPaginationNumbers();
    setCurrentPage(1);
    attachPaginationEvents();
  }
}

function sortData(array, option) {
  let sortArray = [...array];

  if (option === "low-high") {
    sortArray.sort((a, b) => a.price - b.price);
  } else if (option === "high-low") {
    sortArray.sort((a, b) => b.price - a.price);
  }
  return sortArray;
}

function sortingProducts() {
  const sortSelect = document.querySelector("#sort-select");

  sortSelect.addEventListener("change", function (e) {
    currentSortValue = e.target.value;
    let option = e.target.value;
    let content = sortData(currentProducts, option);

    displayProducts(content);
    getPaginationNumbers();
    setCurrentPage(1);
    attachPaginationEvents();
  });

  const applyFilterBtn = document.querySelector("#apply-filters");
  applyFilterBtn.addEventListener("click", function () {
    const minPrice = Number(document.querySelector("#min-price").value) || 0;
    const maxPrice =
      Number(document.querySelector("#max-price").value) || Infinity;

    let filtered = allProducts.filter((i) => {
      return i.price >= minPrice && i.price <= maxPrice;
    });

    currentProducts = filtered;

    const option = sortSelect.value;
    const content = sortData(currentProducts, option);
    displayProducts(content);
    getPaginationNumbers();
    setCurrentPage(1);
    attachPaginationEvents();
  });
}

function searchProuct() {
  const searchInput = document.querySelector("#search-input");
  let list = document.querySelector("#list");
  searchInput.addEventListener("keyup", (e) => {
    list.innerHTML = "";
    let searchTerm = e.target.value.toLowerCase();
    let content = allProducts.filter((product) => {
      return product.title.toLowerCase().includes(searchTerm);
    });
    content
      .map((product) => {
        const { id, title, price, category, image } = product;
        list.innerHTML += `<li class="product-card">
        <div class="image-content">
            <img src="${image}" alt="${category}" />
        </div>
        <div class="product-content"> 
            <p class="product-price"> ${price.toFixed(2)}</p>
            <h4 class="product-title">${title.substring(0, 45)}</h4>
            <p>${category.toUpperCase()}</p>
        </div>
        <div>
            <button class="add-to-cart-btn" onclick='addToCart(${id})'>
            Add to Cart
            </button>
        </div>
    </li>`;
      })
      .join("");
    getPaginationNumbers();
    setCurrentPage(1);
    attachPaginationEvents();
  });
}

function addToCart(id) {
  const findProduct = cart.find((product) => product.id === id);
  if (findProduct) {
    findProduct.quantity += 1;
  } else {
    const oldProduct = allProducts.find((product) => product.id === id);
    cart.push({ ...oldProduct, quantity: 1 });
  }
  console.log(cart);

  shoppingCart();
}

function shoppingCart() {
  const cartList = document.querySelector("#cart-items-list");
  const cartTotal = document.querySelector("#total-price");
  let cartHTML = "";

  cart
    .map((product) => {
      const { id, title, price, quantity } = product;
      cartHTML += `
      <li class="cart-container">
        <div class="cart-title">
          <h3>${title.substring(0, 30)}</h3>
        </div>
        <div class="cart-quantity-container">
          <p class="cart-price">$${price.toFixed(2)}</p>
          <p class="item-total">$${(price * quantity).toFixed(2)}</P>
          <div class="remove-cart-item">
            <button onclick="removeFromCart(${id})">Remove</button>
          </div>
        </div>
      </li>
    `;
    })
    .join("");
  cartList.innerHTML = cartHTML;

  const itemTotals = document.querySelectorAll(".item-total");
  let sum = 0;

  itemTotals.forEach((itemTotal) => {
    const numericValue = itemTotal.innerHTML;
    const index = numericValue.indexOf("$");
    sum += Number(numericValue.slice(index + 1));
  });

  cartTotal.innerHTML =
    sum > 0
      ? `<button id="checkout" onclick="checkout()">Pay Now ${sum.toFixed(2)}</button>`
      : `No Items in the cart`;

  let newSum = 0;
  cart.forEach((product) => {
    newSum += product.quantity;
  });

  const totalQuantity = document.querySelector("#total-qty");
  totalQuantity.innerHTML = newSum;
}

function checkout() {
  const cartList = document.querySelector("#cart-items-list");
  cart = [];
  shoppingCart();
  cartList.innerHTML = `<p class="checkout-message">Thank you for your purchase</p>`;
}

function removeFromCart(id) {
  cart = cart.filter((product) => product.id !== id);
  shoppingCart();
}

// Pagination Logic
const paginationNumbers = document.getElementById("pagination-numbers");
const paginatedList = document.getElementsByClassName("paginated-list");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

const paginationLimit = 6;
let currentPage;

// edited

const getListItems = () => document.querySelectorAll(".product-card");

const getPageCount = () => Math.ceil(getListItems().length / paginationLimit);

// Add page numbers
const appendPageNumber = (index) => {
  const pageNumber = document.createElement("button");
  pageNumber.className = "pagination-number";
  pageNumber.innerHTML = index;
  pageNumber.setAttribute("page-index", index);
  pageNumber.setAttribute("aria-label", "Page" + index);

  paginationNumbers.append(pageNumber);
};

const getPaginationNumbers = () => {
  // edited
  paginationNumbers.innerHTML = "";
  const pageCount = getPageCount();

  // edited
  for (let i = 1; i <= pageCount; i++) {
    appendPageNumber(i);
  }
};

const setCurrentPage = (pageNum) => {
  currentPage = pageNum;

  const prevRange = (pageNum - 1) * paginationLimit;
  const currentRange = pageNum * paginationLimit;

  handleActiveNumber();
  handlePageButtonsStatus();

  // edited
  const listItems = getListItems();

  listItems.forEach((item, index) => {
    item.classList.add("hidden");
    if (index >= prevRange && index < currentRange) {
      item.classList.remove("hidden");
    }
  });
};

// edited
const attachPaginationEvents = () => {
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < getPageCount()) setCurrentPage(currentPage + 1);
  });

  // edited
  document.querySelectorAll(".pagination-number").forEach((button) => {
    const pageIndex = Number(button.getAttribute("page-index"));
    if (pageIndex) {
      button.addEventListener("click", () => {
        // edited
        setCurrentPage(pageIndex);
      });
    }
  });
};

const handleActiveNumber = () => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
    button.classList.remove("active");

    const pageIndex = Number(button.getAttribute("page-index"));
    if (pageIndex === currentPage) {
      button.classList.add("active");
    }
  });
};

const disableButton = (button) => {
  button.classList.add("disabled");
  button.setAttribute("disabled", true);
};

const enableButton = (button) => {
  button.classList.remove("disabled");
  button.removeAttribute("disabled");
};

const handlePageButtonsStatus = () => {
  const pageCount = getPageCount();

  if (currentPage === 1) {
    disableButton(prevButton);
  } else {
    enableButton(prevButton);
  }

  if (pageCount === currentPage) {
    disableButton(nextButton);
  } else {
    enableButton(nextButton);
  }
};
