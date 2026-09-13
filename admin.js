console.log("NEW ADMIN JS LOADED");

// =================================
// GLOBAL
// =================================

let allOrders = [];
let allCustomers = [];
let allMessages = [];
let editingProductId = null;


// =================================
// LOAD ALL ORDERS
// =================================

async function loadOrders() {

    const ordersContainer =
        document.getElementById("ordersContainer");

    try {

        const response =
            await fetch("https://bakerybackend-7vre.onrender.com/api/order");

        const orders =
            await response.json();

        if (!response.ok) {
            throw new Error("Failed to load orders");
        }

        allOrders = orders;

        updateSummary(orders);
        displayOrders(allOrders);

    } catch (error) {

        console.log("Order loading error:", error);

        if (ordersContainer) {
            ordersContainer.innerHTML =
                "<p>Failed to load orders.</p>";
        }
    }
}


// =================================
// DASHBOARD SUMMARY
// =================================

function updateSummary(orders) {

    document.getElementById("totalOrders").textContent =
        orders.length;

    document.getElementById("pendingOrders").textContent =
        orders.filter(function(order) {
            return order.status === "Pending";
        }).length;

    document.getElementById("preparingOrders").textContent =
        orders.filter(function(order) {
            return order.status === "Preparing";
        }).length;

    document.getElementById("deliveredOrders").textContent =
        orders.filter(function(order) {
            return order.status === "Delivered";
        }).length;
}


// =================================
// DISPLAY ORDERS
// =================================

function displayOrders(orders) {

    const ordersContainer =
        document.getElementById("ordersContainer");

    if (!ordersContainer) {
        return;
    }

    if (orders.length === 0) {

        ordersContainer.innerHTML =
            "<p>No orders found.</p>";

        return;
    }

    ordersContainer.innerHTML = "";

    orders.forEach(function(order) {

        ordersContainer.innerHTML += `

            <div class="order-card">

                <h2>
                    Order ID:
                    ${order._id}
                </h2>

                <p>
                    <strong>Order Date:</strong>
                    ${
                        order.createdAt
                            ? new Date(order.createdAt)
                                .toLocaleDateString("en-IN")
                            : ""
                    }
                </p>

                <p>
                    <strong>Order Time:</strong>
                    ${
                        order.createdAt
                            ? new Date(order.createdAt)
                                .toLocaleTimeString("en-IN")
                            : ""
                    }
                </p>

                <p>
                    <strong>Customer:</strong>
                    ${order.customerName || ""}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${order.phone || ""}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${order.address || ""}
                </p>

                <p>
                    <strong>City:</strong>
                    ${order.city || ""}
                </p>

                <p>
                    <strong>Total Quantity:</strong>
                    ${order.totalQuantity || 0}
                </p>

                <p>
                    <strong>Total Amount:</strong>
                    ₹${order.totalAmount || 0}
                </p>

                <p>
                    <strong>Payment:</strong>
                    ${order.paymentMethod || ""}
                </p>

                <div class="products-list">

                    <h3>
                        Products Ordered
                    </h3>

                    ${
                        (order.products || [])
                            .map(function(product) {

                                return `

                                    <div class="product-item">

                                        <p>
                                            <strong>
                                                ${product.name || ""}
                                            </strong>
                                        </p>

                                        <p>
                                            Weight:
                                            ${product.weight || ""}
                                        </p>

                                        <p>
                                            Quantity:
                                            ${product.quantity || 0}
                                        </p>

                                        <p>
                                            Price:
                                            ₹${product.price || 0}
                                        </p>

                                    </div>

                                `;

                            })
                            .join("")
                    }

                </div>

                <p>

                    <strong>
                        Status:
                    </strong>

                    <span
                        class="status-badge ${
                            order.status === "Pending"
                                ? "status-pending"
                                : order.status === "Confirmed"
                                ? "status-confirmed"
                                : order.status === "Preparing"
                                ? "status-preparing"
                                : order.status === "Out for Delivery"
                                ? "status-delivery"
                                : "status-delivered"
                        }"
                    >

                        ${
                            order.status === "Pending"
                                ? "🟡 Pending"
                                : order.status === "Confirmed"
                                ? "🟢 Confirmed"
                                : order.status === "Preparing"
                                ? "🔵 Preparing"
                                : order.status === "Out for Delivery"
                                ? "🟣 Out for Delivery"
                                : "✅ Delivered"
                        }

                    </span>

                    <select id="status-${order._id}">

                        <option
                            value="Pending"
                            ${
                                order.status === "Pending"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Pending
                        </option>

                        <option
                            value="Confirmed"
                            ${
                                order.status === "Confirmed"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Confirmed
                        </option>

                        <option
                            value="Preparing"
                            ${
                                order.status === "Preparing"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Preparing
                        </option>

                        <option
                            value="Out for Delivery"
                            ${
                                order.status === "Out for Delivery"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Out for Delivery
                        </option>

                        <option
                            value="Delivered"
                            ${
                                order.status === "Delivered"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Delivered
                        </option>

                    </select>

                </p>

                <button
                    onclick="updateStatus('${order._id}')"
                >
                    Update Status
                </button>

            </div>

        `;

    });
}


// =================================
// UPDATE ORDER STATUS
// =================================

async function updateStatus(orderId) {

    const statusSelect =
        document.getElementById("status-" + orderId);

    if (!statusSelect) {
        return;
    }

    const newStatus =
        statusSelect.value;

    try {

        const response =
            await fetch(
                `https://bakerybackend-7vre.onrender.com/api/order/${orderId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            alert(
                result.message ||
                "Failed to update status"
            );

            return;
        }

        alert(
            "Order status updated successfully! ✅"
        );

        await loadOrders();

        if (
            ordersSection &&
            ordersSection.style.display === "block" &&
            customersContainerExists()
        ) {
            await loadCustomers();
        }

    } catch (error) {

        console.log(
            "Status update error:",
            error
        );

        alert(
            "Backend connection failed."
        );
    }
}


// =================================
// CHECK CUSTOMER CONTAINER
// =================================

function customersContainerExists() {

    return !!document.getElementById(
        "customersContainer"
    );
}


// =================================
// ADMIN LOGOUT
// =================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "adminLoggedIn"
            );

            window.location.href =
                "admin-login.html";
        }
    );
}


// =================================
// SEARCH
// =================================

const orderSearch =
    document.getElementById("orderSearch");

if (orderSearch) {

    orderSearch.addEventListener(
        "input",
        function() {
            filterOrders();
        }
    );
}


// =================================
// STATUS FILTER
// =================================

const statusFilter =
    document.getElementById("statusFilter");

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        function() {
            filterOrders();
        }
    );
}


// =================================
// FILTER ORDERS
// =================================

function filterOrders() {

    if (!orderSearch || !statusFilter) {
        return;
    }

    const searchText =
        orderSearch.value
            .toLowerCase()
            .trim();

    const selectedStatus =
        statusFilter.value;

    const filteredOrders =
        allOrders.filter(
            function(order) {

                const customerName =
                    (order.customerName || "")
                        .toLowerCase();

                const orderId =
                    (order._id || "")
                        .toLowerCase();

                const matchesSearch =
                    customerName.includes(searchText) ||
                    orderId.includes(searchText);

                const matchesStatus =
                    selectedStatus === "All" ||
                    order.status === selectedStatus;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );

    displayOrders(filteredOrders);
}


// =================================
// PRODUCT FORM ELEMENTS
// =================================

const addProductBtn =
    document.getElementById("addProductBtn");

const productForm =
    document.getElementById("productForm");

const cancelProductBtn =
    document.getElementById("cancelProductBtn");

const saveProductBtn =
    document.getElementById("saveProductBtn");

const productImage =
    document.getElementById("productImage");

const imagePreview =
    document.getElementById("imagePreview");

const priceOptionsContainer =
    document.getElementById(
        "priceOptionsContainer"
    );

const addPriceOptionBtn =
    document.getElementById(
        "addPriceOptionBtn"
    );


// =================================
// RESET PRODUCT FORM
// =================================

function resetProductForm() {

    editingProductId = null;

    document.getElementById("productName").value = "";
    document.getElementById("productCategory").value = "";
    document.getElementById("productDescription").value = "";

    productImage.value = "";

    imagePreview.src = "";
    imagePreview.style.display = "none";

    priceOptionsContainer.innerHTML = "";

    addPriceOptionRow();

    saveProductBtn.textContent =
        "Save Product";
}


// =================================
// ADD PRICE OPTION ROW
// =================================

function addPriceOptionRow(weight = "", price = "") {

    const row =
        document.createElement("div");

    row.className = "price-option";

    row.style.display = "flex";
    row.style.gap = "10px";
    row.style.marginBottom = "10px";

    row.innerHTML = `

        <input
            type="text"
            class="productWeight"
            placeholder="Weight / Pieces"
            value="${weight}"
            style="flex:1;"
        >

        <input
            type="number"
            class="productPrice"
            placeholder="Price"
            value="${price}"
            style="flex:1;"
        >

        <button
            type="button"
            class="removePriceOptionBtn"
            style="
                padding:10px 14px;
                background:#c0392b;
                color:white;
                border:none;
                border-radius:7px;
                cursor:pointer;
            "
        >
            ✕
        </button>

    `;

    row
        .querySelector(".removePriceOptionBtn")
        .addEventListener(
            "click",
            function() {

                const rows =
                    priceOptionsContainer
                        .querySelectorAll(
                            ".price-option"
                        );

                if (rows.length === 1) {

                    alert(
                        "At least one price option is required."
                    );

                    return;
                }

                row.remove();
            }
        );

    priceOptionsContainer.appendChild(row);
}


// =================================
// ADD OPTION BUTTON
// =================================

if (addPriceOptionBtn) {

    addPriceOptionBtn.addEventListener(
        "click",
        function() {

            addPriceOptionRow();

        }
    );
}


// =================================
// OPEN ADD PRODUCT FORM
// =================================

if (addProductBtn) {

    addProductBtn.addEventListener(
        "click",
        function() {

            resetProductForm();

            productForm.style.display =
                "block";

            productForm.scrollIntoView({
                behavior: "smooth"
            });

        }
    );
}


// =================================
// CANCEL PRODUCT FORM
// =================================

if (cancelProductBtn) {

    cancelProductBtn.addEventListener(
        "click",
        function() {

            resetProductForm();

            productForm.style.display =
                "none";

        }
    );
}


// =================================
// IMAGE PREVIEW
// =================================

if (productImage) {

    productImage.addEventListener(
        "change",
        function() {

            const file =
                this.files[0];

            if (!file) {
                return;
            }

            const reader =
                new FileReader();

            reader.onload =
                function(event) {

                    imagePreview.src =
                        event.target.result;

                    imagePreview.style.display =
                        "block";
                };

            reader.readAsDataURL(file);

        }
    );
}


// =================================
// GET PRICE OPTIONS
// =================================

function getPriceOptions() {

    const rows =
        document.querySelectorAll(
            ".price-option"
        );

    const prices = [];

    rows.forEach(function(row) {

        const weight =
            row
                .querySelector(".productWeight")
                .value
                .trim();

        const price =
            row
                .querySelector(".productPrice")
                .value;

        if (weight && price) {

            prices.push({

                weight: weight,

                price: Number(price)

            });

        }

    });

    return prices;
}


// =================================
// SAVE / UPDATE PRODUCT
// =================================

if (saveProductBtn) {

    saveProductBtn.addEventListener(
        "click",
        async function() {

            const name =
                document.getElementById(
                    "productName"
                ).value.trim();

            const category =
                document.getElementById(
                    "productCategory"
                ).value;

            const description =
                document.getElementById(
                    "productDescription"
                ).value.trim();

            const prices =
                getPriceOptions();

            const imageFile =
                productImage.files[0];


            if (!name) {

                alert(
                    "Please enter product name."
                );

                return;
            }


            if (!category) {

                alert(
                    "Please select category."
                );

                return;
            }


            if (prices.length === 0) {

                alert(
                    "Please add at least one weight and price option."
                );

                return;
            }


            if (!description) {

                alert(
                    "Please enter product description."
                );

                return;
            }


            if (
                !editingProductId &&
                !imageFile
            ) {

                alert(
                    "Please select product image."
                );

                return;
            }


            if (imageFile) {

                const allowedTypes = [

                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/webp"

                ];

                if (
                    !allowedTypes.includes(
                        imageFile.type
                    )
                ) {

                    alert(
                        "Only JPG, JPEG, PNG or WEBP images are allowed."
                    );

                    return;
                }
            }


            const formData =
                new FormData();

            formData.append(
                "name",
                name
            );

            formData.append(
                "category",
                category
            );

            formData.append(
                "prices",
                JSON.stringify(prices)
            );

            formData.append(
                "description",
                description
            );

            formData.append(
                "stock",
                "0"
            );


            if (imageFile) {

                formData.append(
                    "image",
                    imageFile
                );
            }


            try {

                saveProductBtn.disabled =
                    true;

                saveProductBtn.textContent =
                    editingProductId
                        ? "Updating..."
                        : "Saving...";


                const url =
                    editingProductId
                        ? `https://bakerybackend-7vre.onrender.com/api/product/${editingProductId}`
                        : "https://bakerybackend-7vre.onrender.com/api/product/add";


                const method =
                    editingProductId
                        ? "PUT"
                        : "POST";


                const response =
                    await fetch(
                        url,
                        {
                            method: method,
                            body: formData
                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "Product Response:",
                    result
                );


                if (
                    response.ok &&
                    result.success
                ) {

                    alert(
                        editingProductId
                            ? "Product Updated Successfully! ✅"
                            : "Product Added Successfully! 🎉"
                    );


                    resetProductForm();


                    productForm.style.display =
                        "none";


                    loadProducts();

                } else {

                    alert(
                        result.message ||
                        "Failed to save product."
                    );
                }


            } catch (error) {

                console.log(
                    "Save / Update product error:",
                    error
                );

                alert(
                    "Backend connection failed. Please check the server."
                );

            } finally {

                saveProductBtn.disabled =
                    false;

                saveProductBtn.textContent =
                    editingProductId
                        ? "Update Product"
                        : "Save Product";
            }

        }
    );
}


// =================================
// LOAD ALL PRODUCTS
// =================================

async function loadProducts() {

    const container =
        document.getElementById(
            "productsContainer"
        );

    if (!container) {
        return;
    }

    try {

        const response =
            await fetch(
                "https://bakerybackend-7vre.onrender.com/api/product"
            );

        const products =
            await response.json();

        container.innerHTML = "";


        if (products.length === 0) {

            container.innerHTML =
                "<p>No products found.</p>";

            return;
        }


        products.forEach(function(product) {

            const imageUrl =
                product.image &&
                product.image.startsWith("http")
                    ? product.image
                    : "https://bakerybackend-7vre.onrender.com" +
                      (product.image || "");


            const prices =
                product.prices || [];


            const priceHTML =
                prices.map(function(item) {

                    return `
                        <p>
                            <strong>
                                ${item.weight}
                            </strong>
                            → ₹${item.price}
                        </p>
                    `;

                }).join("");


            container.innerHTML += `

                <div class="product-item">

                    <img
                        src="${imageUrl}"
                        width="80"
                        alt="${product.name}"
                    >

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ${product.category}
                    </p>

                    ${priceHTML}

                    <button
    class="edit-product-btn"
    onclick="editProduct('${product._id}')"
>
    ✏️ Edit
</button>

<button
    class="delete-product-btn"
    onclick="deleteProduct('${product._id}')"
>
    🗑️ Delete
</button>

                </div>

            `;

        });


    } catch (error) {

        console.log(
            "Product loading error:",
            error
        );

        container.innerHTML =
            "Failed to load products";
    }
}


// =================================
// DELETE PRODUCT
// =================================

async function deleteProduct(productId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );

    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `https://bakerybackend-7vre.onrender.com/api/product/${productId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Failed to delete product."
            );

            return;
        }


        alert(
            "Product deleted successfully! ✅"
        );

        loadProducts();


    } catch (error) {

        console.log(
            "Delete product error:",
            error
        );

        alert(
            "Backend connection failed."
        );
    }
}


// =================================
// EDIT PRODUCT
// =================================

async function editProduct(productId) {

    try {

        const response =
            await fetch(
                `https://bakerybackend-7vre.onrender.com/api/product/${productId}`
            );


        const product =
            await response.json();


        if (!response.ok) {

            alert(
                product.message ||
                "Failed to load product."
            );

            return;
        }


        editingProductId =
            product._id;


        productForm.style.display =
            "block";


        document.getElementById(
            "productName"
        ).value =
            product.name || "";


        document.getElementById(
            "productCategory"
        ).value =
            product.category || "";


        document.getElementById(
            "productDescription"
        ).value =
            product.description || "";


        priceOptionsContainer.innerHTML =
            "";


        if (
            product.prices &&
            product.prices.length > 0
        ) {

            product.prices.forEach(
                function(option) {

                    addPriceOptionRow(
                        option.weight,
                        option.price
                    );

                }
            );

        } else {

            addPriceOptionRow();

        }


        if (product.image) {

            imagePreview.src =
                product.image.startsWith("http")
                    ? product.image
                    : "https://bakerybackend-7vre.onrender.com" +
                      product.image;

            imagePreview.style.display =
                "block";
        }


        saveProductBtn.textContent =
            "Update Product";


        productForm.scrollIntoView({
            behavior: "smooth"
        });


        console.log(
            "Edit Product:",
            product
        );


    } catch (error) {

        console.log(
            "Edit product error:",
            error
        );

        alert(
            "Failed to load product."
        );
    }
}


// =================================
// MAIN SECTIONS
// =================================

const allProductsBtn =
    document.getElementById(
        "allProductsBtn"
    );

const customerDetailsBtn =
    document.getElementById(
        "customerDetailsBtn"
    );

const customerMessagesBtn =
    document.getElementById(
        "customerMessagesBtn"
    );

const productsSection =
    document.getElementById(
        "productsSection"
    );

const ordersSection =
    document.getElementById(
        "ordersSection"
    );

const messagesSection =
    document.getElementById(
        "messagesSection"
    );


// =================================
// ALL PRODUCTS BUTTON
// =================================

if (allProductsBtn) {

    allProductsBtn.addEventListener(
        "click",
        function() {

            if (
                productsSection.style.display ===
                "block"
            ) {

                productsSection.style.display =
                    "none";

            } else {

                productsSection.style.display =
                    "block";

                ordersSection.style.display =
                    "none";

                if (messagesSection) {
                    messagesSection.style.display =
                        "none";
                }

                productsSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    );
}


// =================================
// CUSTOMER DETAILS BUTTON
// =================================

if (customerDetailsBtn) {

    customerDetailsBtn.addEventListener(
        "click",
        async function() {

            if (
                ordersSection.style.display ===
                "block" &&
                customersContainerExists()
            ) {

                ordersSection.style.display =
                    "none";

                return;
            }


            ordersSection.style.display =
                "block";

            productsSection.style.display =
                "none";

            if (messagesSection) {
                messagesSection.style.display =
                    "none";
            }


            ordersSection.scrollIntoView({
                behavior: "smooth"
            });


            await loadCustomers();

        }
    );
}


// =================================
// CUSTOMER MESSAGES BUTTON
// =================================

if (customerMessagesBtn) {

    customerMessagesBtn.addEventListener(
        "click",
        async function() {

            if (
                messagesSection &&
                messagesSection.style.display ===
                "block"
            ) {

                messagesSection.style.display =
                    "none";

                return;
            }


            if (productsSection) {
                productsSection.style.display =
                    "none";
            }

            if (ordersSection) {
                ordersSection.style.display =
                    "none";
            }

            if (messagesSection) {

                messagesSection.style.display =
                    "block";

                messagesSection.scrollIntoView({
                    behavior: "smooth"
                });

                await loadMessages();

            }

        }
    );
}


// =================================
// LOAD ALL CUSTOMERS
// =================================

async function loadCustomers() {

    try {

        const customerResponse =
            await fetch(
                "https://bakerybackend-7vre.onrender.com/api/user"
            );


        if (!customerResponse.ok) {

            throw new Error(
                "Failed to load customers"
            );
        }


        const customers =
            await customerResponse.json();


        allCustomers =
            customers;


        ordersSection.innerHTML = `

            <h2>
                Customer Details
            </h2>

            <div
                id="customersContainer"
            >
                Loading customers...
            </div>

        `;


        const customersContainer =
            document.getElementById(
                "customersContainer"
            );


        if (customers.length === 0) {

            customersContainer.innerHTML =
                "<p>No customers found.</p>";

            return;
        }


        customersContainer.innerHTML = "";


        customers.forEach(function(customer) {

            const customerOrders =
                allOrders.filter(function(order) {

                    if (!order.customerId) {
                        return false;
                    }

                    return String(order.customerId) ===
                           String(customer._id);
                });


            customersContainer.innerHTML += `

                <div
                    class="order-card"
                    style="
                        padding:20px;
                        margin-bottom:25px;
                    "
                >

                    <h2>
                        👤 Customer Details
                    </h2>

                    <p>
                        <strong>
                            Customer Name:
                        </strong>

                        ${customer.name || ""}
                    </p>

                    <p>
                        <strong>
                            Email:
                        </strong>

                        ${customer.email || ""}
                    </p>

                    <p>
                        <strong>
                            Registered Date:
                        </strong>

                        ${
                            customer.createdAt
                                ? new Date(
                                    customer.createdAt
                                ).toLocaleDateString("en-IN")
                                : ""
                        }
                    </p>

                    <button
                        onclick="
                            deleteCustomer(
                                '${customer._id}'
                            )
                        "
                        style="
                            background:#c0392b;
                            color:white;
                            border:none;
                            padding:10px 16px;
                            border-radius:7px;
                            cursor:pointer;
                            margin-top:5px;
                        "
                    >
                        🗑️ Delete Customer
                    </button>


                    <div
                        style="
                            margin-top:25px;
                        "
                    >

                        <h2>
                            📦 Order Details
                        </h2>

                        ${
                            customerOrders.length === 0

                                ?

                                `
                                    <p>
                                        No orders found
                                        for this customer.
                                    </p>
                                `

                                :

                                customerOrders
                                    .map(function(order) {

                                        return createCustomerOrderHTML(
                                            order
                                        );

                                    })
                                    .join("")
                        }

                    </div>

                </div>

            `;

        });


    } catch (error) {

        console.log(
            "Customer loading error:",
            error
        );

        ordersSection.innerHTML = `

            <h2>
                Customer Details
            </h2>

            <p>
                Failed to load customer details.
            </p>

        `;
    }
}


// =================================
// CUSTOMER ORDER HTML
// =================================

function createCustomerOrderHTML(order) {

    return `

        <div
            class="order-card"
            style="
                margin-top:15px;
                padding:18px;
                border:1px solid #ddd;
            "
        >

            <h2>
                Order ID:
                ${order._id}
            </h2>

            <p>
                <strong>
                    Order Date:
                </strong>

                ${
                    order.createdAt
                        ? new Date(order.createdAt)
                            .toLocaleDateString("en-IN")
                        : ""
                }
            </p>

            <p>
                <strong>
                    Order Time:
                </strong>

                ${
                    order.createdAt
                        ? new Date(order.createdAt)
                            .toLocaleTimeString("en-IN")
                        : ""
                }
            </p>

            <p>
                <strong>
                    Customer:
                </strong>

                ${order.customerName || ""}
            </p>

            <p>
                <strong>
                    Phone:
                </strong>

                ${order.phone || ""}
            </p>

            <p>
                <strong>
                    Address:
                </strong>

                ${order.address || ""}
            </p>

            <p>
                <strong>
                    City:
                </strong>

                ${order.city || ""}
            </p>

            <p>
                <strong>
                    Total Quantity:
                </strong>

                ${order.totalQuantity || 0}
            </p>

            <p>
                <strong>
                    Total Amount:
                </strong>

                ₹${order.totalAmount || 0}
            </p>

            <p>
                <strong>
                    Payment:
                </strong>

                ${order.paymentMethod || ""}
            </p>

            <div class="products-list">

                <h3>
                    Products Ordered
                </h3>

                ${
                    (order.products || [])
                        .map(function(product) {

                            return `

                                <div
                                    class="product-item"
                                >

                                    <p>
                                        <strong>
                                            ${product.name || ""}
                                        </strong>
                                    </p>

                                    <p>
                                        Weight:
                                        ${product.weight || ""}
                                    </p>

                                    <p>
                                        Quantity:
                                        ${product.quantity || 0}
                                    </p>

                                    <p>
                                        Price:
                                        ₹${product.price || 0}
                                    </p>

                                </div>

                            `;

                        })
                        .join("")
                }

            </div>


            <p>

                <strong>
                    Status:
                </strong>


                <span
                    class="status-badge ${
                        order.status === "Pending"
                            ? "status-pending"
                            : order.status === "Confirmed"
                            ? "status-confirmed"
                            : order.status === "Preparing"
                            ? "status-preparing"
                            : order.status === "Out for Delivery"
                            ? "status-delivery"
                            : "status-delivered"
                    }"
                >

                    ${
                        order.status === "Pending"
                            ? "🟡 Pending"
                            : order.status === "Confirmed"
                            ? "🟢 Confirmed"
                            : order.status === "Preparing"
                            ? "🔵 Preparing"
                            : order.status === "Out for Delivery"
                            ? "🟣 Out for Delivery"
                            : "✅ Delivered"
                    }

                </span>


                <select
                    id="customer-status-${order._id}"
                >

                    <option
                        value="Pending"
                        ${
                            order.status === "Pending"
                                ? "selected"
                                : ""
                        }
                    >
                        Pending
                    </option>

                    <option
                        value="Confirmed"
                        ${
                            order.status === "Confirmed"
                                ? "selected"
                                : ""
                        }
                    >
                        Confirmed
                    </option>

                    <option
                        value="Preparing"
                        ${
                            order.status === "Preparing"
                                ? "selected"
                                : ""
                        }
                    >
                        Preparing
                    </option>

                    <option
                        value="Out for Delivery"
                        ${
                            order.status === "Out for Delivery"
                                ? "selected"
                                : ""
                        }
                    >
                        Out for Delivery
                    </option>

                    <option
                        value="Delivered"
                        ${
                            order.status === "Delivered"
                                ? "selected"
                                : ""
                        }
                    >
                        Delivered
                    </option>

                </select>

            </p>


            <button
                onclick="
                    updateCustomerOrderStatus(
                        '${order._id}'
                    )
                "
            >
                Update Status
            </button>


        </div>

    `;
}


// =================================
// UPDATE CUSTOMER ORDER STATUS
// =================================

async function updateCustomerOrderStatus(orderId) {

    const statusSelect =
        document.getElementById(
            "customer-status-" + orderId
        );


    if (!statusSelect) {
        return;
    }


    const newStatus =
        statusSelect.value;


    try {

        const response =
            await fetch(
                `https://bakerybackend-7vre.onrender.com/api/order/${orderId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Failed to update status."
            );

            return;
        }


        alert(
            "Order status updated successfully! ✅"
        );


        await loadOrders();

        await loadCustomers();


    } catch (error) {

        console.log(
            "Customer order status error:",
            error
        );

        alert(
            "Backend connection failed."
        );
    }
}


// =================================
// DELETE CUSTOMER
// =================================

async function deleteCustomer(customerId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this customer?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `https://bakerybackend-7vre.onrender.com/api/user/${customerId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Failed to delete customer."
            );

            return;
        }


        alert(
            "Customer deleted successfully! ✅"
        );


        await loadCustomers();


    } catch (error) {

        console.log(
            "Delete customer error:",
            error
        );

        alert(
            "Backend connection failed."
        );
    }
}


// =========================================
// CUSTOMER MESSAGES
// =========================================


// =================================
// LOAD ALL MESSAGES
// =================================

async function loadMessages() {

    const messagesContainer =
        document.getElementById(
            "messagesContainer"
        );

    if (!messagesContainer) {
        return;
    }


    messagesContainer.innerHTML =
        "<p>Loading messages...</p>";


    try {

        const response =
            await fetch(
                "https://bakerybackend-7vre.onrender.com/api/message"
            );


        const messages =
            await response.json();


        if (!response.ok) {

            throw new Error(
                "Failed to load messages"
            );
        }


        allMessages =
            messages;


        displayMessages(messages);


    } catch (error) {

        console.log(
            "Message loading error:",
            error
        );

        messagesContainer.innerHTML =
            "<p>Failed to load customer messages.</p>";
    }
}


// =================================
// DISPLAY MESSAGES
// =================================

function displayMessages(messages) {

    const messagesContainer =
        document.getElementById(
            "messagesContainer"
        );


    if (!messagesContainer) {
        return;
    }


    if (messages.length === 0) {

        messagesContainer.innerHTML = `

            <div
                style="
                    padding:20px;
                    text-align:center;
                    background:#fff;
                    border-radius:10px;
                    border:1px solid #ddd;
                "
            >

                <p>
                    No customer messages found.
                </p>

            </div>

        `;

        return;
    }


    messagesContainer.innerHTML = "";


    messages.forEach(function(message) {

        const date =
            message.createdAt
                ? new Date(message.createdAt)
                    .toLocaleDateString("en-IN")
                : "";

        const time =
            message.createdAt
                ? new Date(message.createdAt)
                    .toLocaleTimeString("en-IN")
                : "";


        messagesContainer.innerHTML += `

            <div class="message-card">

                <h3>
                    💬 Customer Message
                </h3>

                <p>
                    <strong>Name:</strong>
                    ${message.name || ""}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${message.email || ""}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${message.phone || ""}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${date}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${time}
                </p>

                <p class="message-text">
                    <strong>Message:</strong>
                    ${message.message || ""}
                </p>

                <button
                    class="delete-message-btn"
                    onclick="
                        deleteMessage(
                            '${message._id}'
                        )
                    "
                >
                    🗑️ Delete Message
                </button>

            </div>

        `;

    });
}


// =================================
// DELETE MESSAGE
// =================================

async function deleteMessage(messageId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this message?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `https://bakerybackend-7vre.onrender.com/api/message/${messageId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Failed to delete message."
            );

            return;
        }


        alert(
            "Customer message deleted successfully! ✅"
        );


        await loadMessages();


    } catch (error) {

        console.log(
            "Delete message error:",
            error
        );

        alert(
            "Backend connection failed."
        );
    }
}


// =================================
// INITIAL LOAD
// =================================

addPriceOptionRow();

loadOrders();

loadProducts();


console.log(
    "EDIT FUNCTION CHECK:",
    typeof editProduct
);


console.log(
    "ADMIN JS FINISHED"
);