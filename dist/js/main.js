let gOffset = 0;
let gLimit = 10;
let gMaxPage = 0;

let gPage = 0;
let gPayload = null;
let gProductName = null;

async function loadInventoryData() {
    try {
        let url = `http://localhost:3000/api/v1/customized_inventories?limit=${gLimit}&offset=${gOffset}`;
        if (gProductName !== null && gProductName !== "") {
            url += `&product_name=${gProductName}`;
        }
        let res = await fetch(url);
        let payload = await res.json();
        console.log(payload);
        gPayload = payload;
        gMaxPage = Math.ceil(payload.total / gLimit);
    }
    catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function nextPage() {
    if (gPage < gMaxPage - 1) {
        ++gPage;
        gOffset = gPage * gLimit;
        await loadInventoryData();
        await updateLastTotal();
        await showTable();
    } 
}

async function prevPage() {
    if (gPage > 0) {
        --gPage;
        gOffset = gPage * gLimit;
        await loadInventoryData();
        await updateLastTotal();
        await showTable();
    }
}

async function updateLastTotal() {
    let lastlement = document.getElementById("receipt-command-bar-last");
    let lastShownValue = Math.min((gPage + 1) * gLimit, gPayload.total);
    lastlement.innerText = `${lastShownValue}`;

    let totalElement = document.getElementById("receipt-command-bar-total");
    totalElement.innerText = `${gPayload.total}`;
}

async function initCommandBar() {
    await updateLastTotal();

    let prevButton = document.getElementById("receipt-command-bar-prev");
    prevButton.addEventListener("click", () => prevPage());
    let nextButton = document.getElementById("receipt-command-bar-next");
    nextButton.addEventListener("click", () => nextPage());
}

async function initSearchButton() {
    let searchButton = document.getElementById("receipt-search-button");
    searchButton.addEventListener("click", () => updateSearch());
}

async function updateSearch() {
    let input = document.getElementById("receipt-search-input");
    gProductName = input.value;
    gOffset = 0;
    gPage = 0;
    await loadInventoryData();
    await updateLastTotal();
    await showTable();
}

async function showTable() {
    let table = document.createElement("table");
    table.appendChild(getTableHeader());

    let tbody = document.createElement("tbody");
    if (gPayload.data) {
        gPayload.data.forEach(element => {
            tbody.appendChild(getTableRow(element));
        });
    }

    table.appendChild(tbody);

    let tableSection = document.getElementById("receipt-table-section");
    tableSection.replaceChildren(table);
}

function getTableHeader() {
    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    
    let headerColProduct = document.createElement("th");
    headerColProduct.setAttribute("scope", "col");
    headerColProduct.innerText = "Product";

    let headerColProductAlias = document.createElement("th");
    headerColProductAlias.setAttribute("scope", "col");
    headerColProductAlias.innerText = "Alias";

    let headerColPrice = document.createElement("th");
    headerColPrice.setAttribute("scope", "col");
    headerColPrice.innerText = "Price";

    let headerColCurrency = document.createElement("th");
    headerColCurrency.setAttribute("scope", "col");
    headerColCurrency.innerText = "Currency";

    let headerColStore = document.createElement("th");
    headerColStore.setAttribute("scope", "col");
    headerColStore.innerText = "Store";

    headerRow.appendChild(headerColProduct);
    headerRow.appendChild(headerColProductAlias);
    headerRow.appendChild(headerColPrice);
    headerRow.appendChild(headerColCurrency);
    headerRow.appendChild(headerColStore);

    thead.appendChild(headerRow);

    return thead;
}

function getTableRow(rowData) {
    let row = document.createElement("tr");
    let productData = document.createElement("td");
    productData.innerText = rowData.product.name;
    row.appendChild(productData);

    let productAliasData = document.createElement("td");
    productAliasData.innerText = rowData.product.alias;
    row.appendChild(productAliasData);
    
    let priceData = document.createElement("td");
    priceData.innerText = rowData.price;
    row.appendChild(priceData);
    
    let currencyData = document.createElement("td");
    currencyData.innerText = rowData.currency.name;
    row.appendChild(currencyData);
    
    let storeData = document.createElement("td");
    storeData.innerText = rowData.store_name;
    row.appendChild(storeData);

    return row;
}

async function main() {
    await loadInventoryData();
    await initCommandBar();
    await initSearchButton();
    await showTable();
}

main();