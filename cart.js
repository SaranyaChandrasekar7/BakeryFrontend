// =================================
// CART DATA
// =================================

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// =================================
// CART CONTAINER
// =================================

let cartItems =
    document.getElementById("cartItems");


// =================================
// CART TOTAL
// =================================

let cartTotal =
    document.getElementById("cartTotal");


// =================================
// SUMMARY CONTAINER
// =================================

let summaryDetails =
    document.getElementById("summaryDetails");


// =================================
// DISPLAY CART
// =================================

function displayCart() {

    cartItems.innerHTML = "";

    summaryDetails.innerHTML = "";

    let total = 0;

    let totalQuantity = 0;


    // =================================
    // EMPTY CART
    // =================================

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <h2>
                    Your Cart is Empty 🛒
                </h2>

                <p>
                    Add some delicious bakery items to your cart!
                </p>

            </div>

        `;


        cartTotal.textContent = "₹0";


        document
            .getElementById("totalQuantity")
            .textContent = "0";


        return;
    }


    // =================================
    // DISPLAY CART PRODUCTS
    // =================================

    cart.forEach(function(item, index) {


        // =================================
        // FIX QUANTITY
        // =================================

        let quantity =
            Number(item.quantity) || 1;


        item.quantity = quantity;


        // =================================
        // PRICE
        // =================================

        let price =
            Number(item.price) || 0;


        // =================================
        // ITEM TOTAL
        // =================================

        let itemTotal =
            price * quantity;


        // =================================
        // GRAND TOTAL
        // =================================

        total =
            total + itemTotal;


        // =================================
        // TOTAL QUANTITY
        // =================================

        totalQuantity =
            totalQuantity + quantity;


        // =================================
        // LEFT SIDE CART PRODUCT
        // =================================

        cartItems.innerHTML += `

            <div class="cart-item">


                <!-- Product Image -->

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >


                <!-- Product Details -->

                <div class="cart-item-details">


                    <h2>
                        ${item.name}
                    </h2>


                    <!-- Selected Size -->

                    <p>
                        Size:
                        ${item.weight || "Pieces"}
                    </p>


                    <!-- Price -->

                    <p>
                        Price:
                        ₹${price}
                    </p>


                    <!-- Quantity -->

                    <div class="quantity">


                        <button
                            onclick="decreaseQuantity(${index})"
                        >
                            −
                        </button>


                        <span>
                            ${quantity}
                        </span>


                        <button
                            onclick="increaseQuantity(${index})"
                        >
                            +
                        </button>


                    </div>


                    <!-- Item Total -->

                    <p class="item-total">

                        Total:
                        ₹${itemTotal}

                    </p>


                </div>


                <!-- Remove Button -->

                <button
                    class="remove-btn"
                    onclick="removeItem(${index})"
                >
                    REMOVE
                </button>


            </div>

        `;


        // =================================
        // RIGHT SIDE ORDER SUMMARY
        // =================================

        summaryDetails.innerHTML += `

            <div class="summary-item">


                <!-- Product -->

                <p>

                    Product:

                    <span>
                        ${item.name}
                    </span>

                </p>


                <!-- Selected Size -->

                <p>

                    Size:

                    <span>
                        ${item.weight || "Pieces"}
                    </span>

                </p>


                <!-- Price -->

                <p>

                    Price:

                    <span>
                        ₹${price}
                    </span>

                </p>


                <!-- Quantity -->

                <p>

                    Quantity:

                    <span>
                        ${quantity}
                    </span>

                </p>


                <!-- Item Total -->

                <p>

                    Item Total:

                    <span>
                        ₹${itemTotal}
                    </span>

                </p>


            </div>

        `;

    });


    // =================================
    // FINAL TOTAL VALUE
    // =================================

    cartTotal.textContent =
        "₹" + total;


    // =================================
    // FINAL TOTAL QUANTITY
    // =================================

    document
        .getElementById("totalQuantity")
        .textContent = totalQuantity;


    // =================================
    // SAVE CART
    // =================================

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// =================================
// INCREASE QUANTITY
// =================================

function increaseQuantity(index) {


    // Make sure quantity is a number

    cart[index].quantity =
        Number(cart[index].quantity) || 1;


    // Increase quantity

    cart[index].quantity++;


    // Save cart

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    // Refresh cart

    displayCart();

}


// =================================
// DECREASE QUANTITY
// =================================

function decreaseQuantity(index) {


    // Make sure quantity is a number

    cart[index].quantity =
        Number(cart[index].quantity) || 1;


    // Decrease only above 1

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    }


    // Save cart

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    // Refresh cart

    displayCart();

}


// =================================
// REMOVE ITEM
// =================================

function removeItem(index) {


    // Remove selected product

    cart.splice(index, 1);


    // Save cart

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    // Refresh cart

    displayCart();

}


// =================================
// ORDER NOW
// =================================

document
    .getElementById("orderNow")
    .addEventListener("click", function() {


        // Check empty cart

        if (cart.length === 0) {

            alert(
                "Your cart is empty!"
            );

            return;
        }


        // Go to order page

        window.location.href =
            "order.html";

    });


// =================================
// RUN CART
// =================================

displayCart();

