const API_BASE_URL = "http://localhost:3000";

const productDetailsContainer = document.getElementById("product-details");
const relatedProductsContainer = document.getElementById("related-products");

// Favorites helpers (same localStorage logic as home)
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Read product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
  showError("No product ID provided");
} else {
  fetchProductDetails(productId);
}

async function fetchProductDetails(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/details/${id}`);
    const product = await response.json();

    if (!response.ok) {
      showError(product.Error?.Message || "Failed to load product");
      return;
    }

    renderProductDetails(product);
    fetchRelatedProducts(product.brand, product._id);
  } catch (error) {
    showError("Failed to connect to server");
  }
}

function renderProductDetails(product) {
  const favorites = getFavorites();
  const isFavorited = favorites.includes(product._id);

  productDetailsContainer.innerHTML = `
    <div class="row">
      <div class="col-md-6 product-hero">
        <button class="heart-btn product-heart ${isFavorited ? "active" : ""}" aria-label="Favorite">
          ${isFavorited ? "❤️" : "🤍"}
        </button>
        <img
          src="${product.imageUrl}"
          class="img-fluid rounded"
          alt="${product.name}"
        />
      </div>
      <div class="col-md-6">
        <h2>${product.name}</h2>
        <p><strong>Brand:</strong> ${product.brand}</p>
        <p><strong>Type:</strong> ${product.type}</p>
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Sizes:</strong> ${Array.isArray(product.sizes) && product.sizes.length ? product.sizes.join(", ") : "US 7-14"}</p>
        <p>${product.description || ""}</p>
      </div>
    </div>
  `;

  const heartBtn = productDetailsContainer.querySelector(".product-heart");
  if (heartBtn) {
    heartBtn.addEventListener("click", () => toggleFavorite(product, heartBtn));
  }
}

function toggleFavorite(product, heartBtn) {
  let favorites = getFavorites();
  const exists = favorites.includes(product._id);

  if (exists) {
    favorites = favorites.filter(id => id !== product._id);
  } else {
    favorites.push(product._id);
  }

  saveFavorites(favorites);

  if (heartBtn) {
    const active = favorites.includes(product._id);
    heartBtn.classList.toggle("active", active);
    heartBtn.textContent = active ? "❤️" : "🤍";
  }
}

async function fetchRelatedProducts(brand, currentProductId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products?page=1&brand=${brand}`
    );
    const data = await response.json();

    if (!response.ok) return;

    const related = data.products.filter(
      p => p._id !== currentProductId
    );

    renderRelatedProducts(related);
  } catch (error) {
    // silently fail
  }
}

function renderRelatedProducts(products) {
  relatedProductsContainer.innerHTML = "";

  products.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-md-3";

    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h6 class="card-title">${product.name}</h6>
          <a href="product.html?id=${product._id}" class="btn btn-sm btn-outline-primary">
            View
          </a>
        </div>
      </div>
    `;

    relatedProductsContainer.appendChild(col);
  });
}

function showError(message) {
  productDetailsContainer.innerHTML = `
    <div class="alert alert-danger text-center">
      ${message}
    </div>
  `;
}
