// Authentication
const apiKey = 'your-api-key-here'; // Replace with your Bareconnect API key
const STORE_ID = 'your-store-ID-here'; // Bareconnect store ID here
const ACCESS_TOKEN = 'your-access-token-here'; // Bareconnect Access token

// Default Configuration
const defaultConfig = {
    productContainerStyles: ['grid', 'gap-8', 'grid-cols-1', 'sm:grid-cols-3'],
    product: {
        productShown: {
            LoadSpecificProduct: false, // If true, the user has to add the product id, if false, load all products
            paginated: false, // If false, no pagination will be shown, if true, user has to define the pagination count. Default will be 10 if not defined
            paginationCount: 10
        },
        layout: 'vertical', // 'vertical' or 'horizontal'
        content: {
            description: true, // Show product description or not
            variants: false, // Show product variaants or not
            showPrice: true,
            showPreorder: true
        }
    },
    buttonText: 'Buy Now',
    buttonStyles: {
        textColor: 'blue',
        textHoverColor: 'green',
        backgroundColor: 'yellow',
        backgroundHoverColor: 'white'
    }
};

// Multi ClassList Function
function applyMultiClass(styleNameList, styleAppliedOn) {
    styleNameList.forEach(className => {
        styleAppliedOn.classList.add(className);
    });
}

// Apply CSS Variables Function
function applyCssVariables(styles, element) {
    element.style.setProperty('--bc-button-text-color', styles.textColor);
    element.style.setProperty('--bc-button-text-hover-color', styles.textHoverColor);
    element.style.setProperty('--bc-button-background-color', styles.backgroundColor);
    element.style.setProperty('--bc-button-background-hover-color', styles.backgroundHoverColor);
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

function createProductElement(product, config) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';

    const layoutClass = config.product.layout === 'horizontal' ? 'bc-product-layoutHorizontal' : 'bc-product-layoutVertical';
    productDiv.classList.add(layoutClass);

    const imgContainer = document.createElement('div');
    imgContainer.className = 'bc-products-image-container';
    
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    imgContainer.appendChild(img);

    const contentContainer = document.createElement('div');
    contentContainer.className = 'bc-products-content';

    const name = document.createElement('h3');
    name.innerText = product.name;

    if (config.product.content.description) {
        const description = document.createElement('p');
        description.innerText = product.description;
        contentContainer.appendChild(description);
    }

    if (config.product.content.showPrice) {
        const price = document.createElement('p');
        price.innerText = `$${product.price}`;
        contentContainer.appendChild(price);
    }

    if (config.product.content.variants && product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
            const variantDiv = document.createElement('div');
            variantDiv.className = 'product-variant';

            const variantName = document.createElement('span');
            variantName.innerText = `${variant.name}: `;
            variantDiv.appendChild(variantName);

            const variantOptions = document.createElement('select');
            variant.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.innerText = option;
                variantOptions.appendChild(optionElement);
            });
            variantDiv.appendChild(variantOptions);
            contentContainer.appendChild(variantDiv);
        });
    }

    if (config.product.content.showPreorder && product.hasPreorder) {
        const preorder = document.createElement('p');
        preorder.innerText = "Available for Preorder";
        preorder.className = 'preorder';
        contentContainer.appendChild(preorder);
    }

    const button = document.createElement('button');
    button.innerText = config.buttonText;
    button.classList.add('bc-buy-button')
    button.onclick = () => {
        window.location.href = `https://bareconnect.com/product/${product.id}/checkout`;
    };
    applyCssVariables(config.buttonStyles, button);

    contentContainer.appendChild(name);
    contentContainer.appendChild(button);

    productDiv.appendChild(imgContainer);
    productDiv.appendChild(contentContainer);

    return productDiv;
}

function createShopWidget(apiKey, customConfig = {}) {
    const config = { ...defaultConfig, ...customConfig };
    const container = document.createElement('div');
    container.id = 'shop-widget-container';
    applyMultiClass(config.productContainerStyles, container);

    fetchProducts(apiKey).then(products => {
        let productArray = products;

        if (config.product.productShown.LoadSpecificProduct) {
            productArray = products.filter(product => product.id === customConfig.productId);
        }

        if (config.product.productShown.paginated) {
            productArray = productArray.slice(0, config.product.productShown.paginationCount);
        }

        productArray.forEach(product => {
            const productDiv = createProductElement(product, config);
            container.appendChild(productDiv);
        });
    });

    return container;
}

function initializeBareconnectInstantShop(customConfig = {}) {
    document.addEventListener('DOMContentLoaded', () => {
        const shopWidget = createShopWidget(apiKey, customConfig);
        document.body.appendChild(shopWidget);
    });
}
