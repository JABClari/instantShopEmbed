// Authentication
const apiKey = 'your-api-key-here'; // Replace with your Bareconnect API key

// DEFINE STYLES
let productContainer = ['grid','gap-8','grid-cols-1','sm:grid-cols-3']
let buttonStyle = ['flex','buy-button']
// END STYLE DEFINITION

// Multi ClassList Function
function multiClassList(styleNameList,styleAppliedOn){
    styleNameList.forEach(className=>{
        styleAppliedOn.classList.add(className)
    })
}
async function fetchProducts(apiKey) {
    try {
        const response = await fetch('http://localhost:5000/products.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Step 2: Enhance Product Details and Checkout
function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    
    const name = document.createElement('h3');
    name.innerText = product.name;
    
    const description = document.createElement('p');
    description.innerText = product.description;
    
    const price = document.createElement('p');
    price.innerText = `$${product.price}`;
    
    const button = document.createElement('button');
    button.innerText = 'Buy Now';
    button.onclick = () => {
        window.location.href = `https://bareconnect.com/product/${product.id}/checkout`;
    };
    multiClassList(buttonStyle,button);
    
    productDiv.append(img, name, description, price, button);
    return productDiv;
}

// Step 3: Embedding the Widget with an iframe
function createShopWidget(apiKey) {
    const container = document.createElement('div');
    container.id = 'shop-widget-container';
    multiClassList(productContainer,container);

    async function loadShop(apiKey) {
        const products = await fetchProducts(apiKey);
        products.forEach(product => {
            const productDiv = createProductElement(product);
            container.appendChild(productDiv);
        });
    }

    loadShop(apiKey);
    return container;
}

// Ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Step 3 Complete - Create the shop widget
    const shopWidget = createShopWidget(apiKey);
    document.body.appendChild(shopWidget);
});
