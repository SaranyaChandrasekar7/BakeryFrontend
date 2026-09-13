// =================================
// CART DATA
// =================================

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// =================================
// ORDER ELEMENTS
// =================================

let orderItems =
    document.getElementById("orderItems");

let orderQuantity =
    document.getElementById("orderQuantity");

let orderTotal =
    document.getElementById("orderTotal");


// =================================
// DISPLAY ORDER
// =================================

function displayOrder() {

    orderItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;


    // =================================
    // EMPTY CART
    // =================================

    if (cart.length === 0) {

        orderItems.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        orderQuantity.textContent = "0";

        orderTotal.textContent = "₹0";

        return;
    }


    // =================================
    // DISPLAY PRODUCTS
    // =================================

    cart.forEach(function(item) {

        let quantity =
            Number(item.quantity) || 1;

        let price =
            Number(item.price) || 0;

        let itemTotal =
            price * quantity;


        total =
            total + itemTotal;

        totalQuantity =
            totalQuantity + quantity;


        orderItems.innerHTML += `

            <div class="order-item">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    Size: ${item.weight || "Pieces"}
                </p>

                <p>
                    Price: ₹${price}
                </p>

                <p>
                    Quantity: ${quantity}
                </p>

                <p class="item-price">
                    Item Total: ₹${itemTotal}
                </p>

            </div>

        `;
    });


    // =================================
    // FINAL TOTALS
    // =================================

    orderQuantity.textContent =
        totalQuantity;

    orderTotal.textContent =
        "₹" + total;
}


// =================================
// RUN DISPLAY
// =================================

displayOrder();


// =================================
// PLACE ORDER
// =================================

document
    .getElementById("orderForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // =================================
            // CHECK CART
            // =================================

            if (cart.length === 0) {

                alert(
                    "Your cart is empty!"
                );

                return;
            }


            // =================================
            // CUSTOMER DETAILS
            // =================================

            let name =
                document
                    .getElementById("customerName")
                    .value
                    .trim();

            let phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();

            let address =
                document
                    .getElementById("address")
                    .value
                    .trim();

            let city =
                document
                    .getElementById("city")
                    .value
                    .trim();


            // =================================
            // VALIDATION
            // =================================

            if (
                name === "" ||
                phone === "" ||
                address === "" ||
                city === ""
            ) {

                alert(
                    "Please fill all customer details."
                );

                return;
            }


            // =================================
            // CALCULATE TOTAL
            // =================================

            let total = 0;

            let totalQuantity = 0;


            cart.forEach(function(item) {

                let quantity =
                    Number(item.quantity) || 1;

                let price =
                    Number(item.price) || 0;


                total =
                    total + (price * quantity);


                totalQuantity =
                    totalQuantity + quantity;

            });



            const loggedInUser =
    localStorage.getItem("loggedInUser");

if (!loggedInUser) {

    alert("Please login before placing an order.");

    window.location.href = "login.html";

    return;
}

const user =
    JSON.parse(loggedInUser);


            // =================================
            // ORDER DATA
            // =================================

            const orderData = {

                customerId:
        user._id,


                customerName:
                    name,

                phone:
                    phone,

                address:
                    address,

                city:
                    city,

                products:
                    cart.map(function(item) {

                        return {

                            name:
                                item.name,

                            weight:
                                item.weight ||
                                "Pieces",

                            price:
                                Number(item.price) ||
                                0,

                            quantity:
                                Number(item.quantity) ||
                                1

                        };

                    }),

                totalQuantity:
                    totalQuantity,

                totalAmount:
                    total,

                paymentMethod:
                    "COD",

                status:
                    "Pending"

            };


            // =================================
            // SEND ORDER TO BACKEND
            // =================================

            try {

                console.log(
                    "Sending order to backend..."
                );


                const response =
                    await fetch(
                        "http://localhost:5000/api/order",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    orderData
                                )

                        }
                    );


                // =================================
                // BACKEND RESPONSE
                // =================================

                const result =
                    await response.json();


                console.log(
                    "Backend response:",
                    result
                );


                // =================================
                // CHECK ERROR
                // =================================

                if (!response.ok) {

                    alert(
                        result.message ||
                        "Order could not be placed."
                    );

                    return;
                }


                // =================================
                // CHECK ORDER ID
                // =================================

                if (
                    !result.order ||
                    !result.order._id
                ) {

                    alert(
                        "Order placed, but Order ID was not received."
                    );

                    return;
                }


                // =================================
                // SAVE LAST ORDER ID
                // =================================

                localStorage.setItem(
                    "lastOrderId",
                    result.order._id
                );


                console.log(
                    "Order ID saved:",
                    result.order._id
                );


                // =================================
                // SUCCESS
                // =================================

                alert(
                    "Order placed successfully! 🎉"
                );


                // =================================
                // CLEAR CART
                // =================================

                localStorage.removeItem(
                    "cart"
                );


                // =================================
                // SUCCESS PAGE
                // =================================

                window.location.href =
                    "ordersuccess.html";

            }


            // =================================
            // BACKEND CONNECTION ERROR
            // =================================

            catch (error) {

                console.log(
                    "Order error:",
                    error
                );

                alert(
                    "Backend connection failed."
                );

            }


        }
    );

