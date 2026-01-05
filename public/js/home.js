const API_BASE_URL = "http://localhost:3000";

const productGrid = document.getElementById("product-grid");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");
const applyFiltersBtn = document.getElementById("applyFiltersBtn");
const favoritesList = document.getElementById("favorites-list");

let currentPage = 1;
let totalPages = 1;
let selectedBrands = [];
let selectedTypes = [];

// Load favorites from localStorage
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Fetch products
async function fetchProducts(page = 1) {
  try {
    let url = `${API_BASE_URL}/products?page=${page}`;

    if (selectedBrands.length > 0) {
      url += `&brand=${selectedBrands.join(";")}`;
    }

    if (selectedTypes.length > 0) {
      url += `&type=${selectedTypes.join(";")}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      showError(data.Error?.Message || "Something went wrong");
      return;
    }

    currentPage = data.page;
    totalPages = data.totalPages;

    renderProducts(data.products);
    updatePaginationUI();
    renderFavorites();
  } catch (error) {
    showError("Failed to connect to server");
  }
}

// Render product cards
function renderProducts(products) {
  productGrid.innerHTML = "";

  const favorites = getFavorites();

  products.forEach(product => {
    const isFavorited = favorites.includes(product._id);

    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card h-100">
        <button class="heart-btn ${isFavorited ? "active" : ""}" aria-label="Favorite">
          ${isFavorited ? "❤️" : "🤍"}
        </button>
        <a href="product.html?id=${product._id}" class="card-img-link">
          <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
        </a>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text brand-type">${product.brand} · ${product.type}</p>
          <p class="card-text fw-bold">$${product.price}</p>
        </div>
      </div>
    `;

    const heartBtn = col.querySelector(".heart-btn");
    heartBtn.addEventListener("click", () => toggleFavorite(product));

    productGrid.appendChild(col);
  });
}

// Toggle favorite
function toggleFavorite(product) {
  let favorites = getFavorites();

  if (favorites.includes(product._id)) {
    favorites = favorites.filter(id => id !== product._id);
  } else {
    favorites.push(product._id);
  }

  saveFavorites(favorites);
  fetchProducts(currentPage);
}

// Render favorites sidebar
async function renderFavorites() {
  favoritesList.innerHTML = "";
  const favorites = getFavorites();

  if (favorites.length === 0) {
    favoritesList.innerHTML = `
      <li class="list-group-item text-muted text-center">
        No favorites yet
      </li>
    `;
    return;
  }

  for (const id of favorites) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/details/${id}`);
      const product = await response.json();

      if (!response.ok) continue;

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
        <span>${product.name}</span>
        <button class="btn btn-sm btn-outline-danger">✕</button>
      `;

      li.querySelector("button").addEventListener("click", () => {
        removeFavorite(id);
      });

      favoritesList.appendChild(li);
    } catch {}
  }
}

// Remove favorite
function removeFavorite(id) {
  let favorites = getFavorites();
  favorites = favorites.filter(fid => fid !== id);
  saveFavorites(favorites);
  fetchProducts(currentPage);
}

// Pagination
function updatePaginationUI() {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) fetchProducts(currentPage - 1);
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) fetchProducts(currentPage + 1);
});

// Filters
applyFiltersBtn.addEventListener("click", () => {
  selectedBrands = Array.from(
    document.querySelectorAll(".brand-filter:checked")
  ).map(cb => cb.value);

  selectedTypes = Array.from(
    document.querySelectorAll(".type-filter:checked")
  ).map(cb => cb.value);

  currentPage = 1;
  fetchProducts(currentPage);
});

// Error display
function showError(message) {
  productGrid.innerHTML = `
    <div class="col-12">
      <div class="alert alert-warning text-center">
        ${message}
      </div>
    </div>
  `;
}

// Initial load
fetchProducts();
