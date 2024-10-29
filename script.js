let productContainer = document.querySelector(".products");
let calculation = document.querySelector(".calculation");
let body = document.querySelector("body");
let close = document.querySelector(".close");
let cart_container = document.querySelector(".cart-container")
//let cart = document.querySelector(".cart");

let listProducts = [];
let basket = [];

calculation.addEventListener("click", () => {
    body.classList.toggle("show")
})

close.addEventListener("click", (e) => {
    body.classList.toggle("show");
})

let addDataToHtml = () => {
    listProducts.forEach((product) => {
        let div = document.createElement("div");
        div.classList.add("items");
        div.dataset.id = product.id;
        div.innerHTML = `<img src="${product.img}" alt="">
                    <h2>${product.name}</h2>
                    <p>#${product.price}</p>
                    <button class="addCart">add to cart</button>`;
         productContainer.appendChild(div)
    })
}

productContainer.addEventListener("click", (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains("addCart")) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id)
    }
})

let addToCart = (id) => {
    let search = basket.findIndex((valaue) => valaue.id == id);
    
    if (basket.length <= 0) {
        basket = [{
            id: id,
            quantity: 1
        }]
    } else if (search < 0) {
        basket.push({
            id: id,
            quantity: 1
        })
    } else {
        basket[search].quantity += 1;
    }
    
    
    addCartToHtml();
    addCartToMemory();

}

let addCartToMemory = () => {
    localStorage.setItem("data", JSON.stringify(basket));
}

let addCartToHtml = () => {
    cart_container.innerHTML = "";
    let totalQuantity = 0;
    if (basket.length > 0) {
        basket.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;

            let div = document.createElement("div");
            div.classList.add("cartItem");
            div.dataset.id = item.id;
            let position = listProducts.findIndex((value) => value.id == item.id);
            let info = listProducts[position];
            div.innerHTML = `<img src="${info.img}" alt="">
                        <h2>${info.name}</h2>
                        <p class="price">${info.price * item.quantity}</p>
                        <div class="quantity">
                            <span class="minus"><</span>
                            <span>${item.quantity}</span>
                            <span class="plus">></span>
                        </div>`
    
                        console.log(div);
                        
            cart_container.appendChild(div);

            
        }
        
    )
    }
    calculation.innerText = totalQuantity;
}

cart_container.addEventListener("click", (event) => {
    let positionClick = event.target;
    
    if (positionClick.classList.contains("minus") || positionClick.classList.contains("plus")) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = "minus";
        if (positionClick.classList.contains("plus")) {
            type = "plus";
        }
        changeQuantity(product_id, type)
    }
})

let changeQuantity = (product_id, type) => {
    let positionItemInCart = basket.findIndex((valaue) => valaue.id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case "plus":
                basket[positionItemInCart].quantity += 1;
                break;

            default:
                let valueChange = basket[positionItemInCart].quantity -1;
                if (valueChange > 0) {
                    basket[positionItemInCart].quantity = valueChange;
                } else {
                    basket.splice(positionItemInCart, 1)
                }
                break;
        }
    }
    addCartToMemory()
    addCartToHtml()

}

const initApp = () => {
    fetch("products.json")
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        addDataToHtml()
        
        // get cart from memory
        if (localStorage.getItem("data")) {
            basket = JSON.parse(localStorage.getItem("data"));
            addCartToHtml();
        }
    });  
}
initApp()