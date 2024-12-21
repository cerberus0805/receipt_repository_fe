let gInventoryIndex = 0;
const API_BASE = "https://api.app.localhost:3000/api/v1";
const FIELD_PER_INVENTORY = 9;

class Receipt {
    constructor(transaction_date, is_inventory_taxed) {
        this.transaction_date = transaction_date;
        this.is_inventory_taxed = is_inventory_taxed;
        this.currency = {};
        this.store = {};
        this.inventories = [];
    }
}

async function getInventoryLabelChildNode(forInputId, labelValue) {
    let inventoryLabelChild = document.createElement("div");
    inventoryLabelChild.className = "grid-row-one-one";

    let labelNode = document.createElement("label");
    labelNode.setAttribute("for", forInputId);
    labelNode.innerText = labelValue;

    inventoryLabelChild.appendChild(labelNode);

    return inventoryLabelChild;
}

async function getInventoryInputChildNode(inputId, inputType, inputPlaceholder) {
    let inventoryInputChild = document.createElement("div");
    inventoryInputChild.className = "grid-row-one-two";
    let isNameInput = inputId.indexOf("product-name") != -1;
    if (isNameInput) {
        let idInput = document.createElement("input");
        idInput.setAttribute("type", "hidden");
        idInput.setAttribute("id", inputId.replace("product-name", "product-id"));
        inventoryInputChild.appendChild(idInput);
    }

    let inputNode = document.createElement("input");
    inputNode.setAttribute("type", inputType);
    inputNode.setAttribute("id", inputId);
    inputNode.setAttribute("placeholder", inputPlaceholder);

    inventoryInputChild.appendChild(inputNode);

    if (isNameInput) {
        let ulNode = document.createElement("ul");
        ulNode.setAttribute("name", "product");
        ulNode.setAttribute("id", `receipt-product-ul-${gInventoryIndex}`);
        ulNode.setAttribute("class", "noshow");
        inventoryInputChild.appendChild(ulNode);
    }

    return inventoryInputChild;
}

async function getInventoryNode() {
    let inventoryNode = document.createElement("div");
    inventoryNode.className = "grid-wrapper grid-wrapper-border";

    inventoryNode.appendChild(await getInventoryLabelChildNode(`receipt-product-name-${gInventoryIndex}`, "Product Name: "));
    inventoryNode.appendChild(await getInventoryInputChildNode(`receipt-product-name-${gInventoryIndex}`, "text", "Name"));

    inventoryNode.appendChild(await getInventoryLabelChildNode(`receipt-product-alias-${gInventoryIndex}`, "Product Alias: "));
    inventoryNode.appendChild(await getInventoryInputChildNode(`receipt-product-alias-${gInventoryIndex}`, "text", "Alias"));
    inventoryNode.appendChild(await getInventoryLabelChildNode(`receipt-product-brand-${gInventoryIndex}`, "Product Brand: "));
    inventoryNode.appendChild(await getInventoryInputChildNode(`receipt-product-brand-${gInventoryIndex}`, "text", "Brand"));

    inventoryNode.appendChild(await getInventoryLabelChildNode(`receipt-product-specification-amount-${gInventoryIndex}`, "Product Spec. Amount: "));
    inventoryNode.appendChild(await getInventoryInputChildNode(`receipt-product-specification-amount-${gInventoryIndex}`, "number", "Amount"));
    inventoryNode.appendChild(await getInventoryLabelChildNode(`receipt-product-specification-unit-${gInventoryIndex}`, "Product Spec. Unit: "));
    inventoryNode.appendChild(await getInventoryInputChildNode(`receipt-product-specification-unit-${gInventoryIndex}`, "text", "Unit"));
    inventoryNode.appendChild(await getInventoryLabelChildNode(`receipt-product-specification-others-${gInventoryIndex}`, "Product Spec. Others: "));
    inventoryNode.appendChild(await getInventoryInputChildNode(`receipt-product-specification-others-${gInventoryIndex}`, "text", "Others"));

    inventoryNode.appendChild(await getInventoryLabelChildNode(`receipt-inventory-price-${gInventoryIndex}`, "Price: "));
    inventoryNode.appendChild(await getInventoryInputChildNode(`receipt-inventory-price-${gInventoryIndex}`, "number", "Price"));
    inventoryNode.appendChild(await getInventoryLabelChildNode(`receipt-inventory-quantity-${gInventoryIndex}`, "Quantity: "));
    inventoryNode.appendChild(await getInventoryInputChildNode(`receipt-inventory-quantity-${gInventoryIndex}`, "number", "Quantity"));
    
    return inventoryNode;
}

async function addInventory() {
    ++gInventoryIndex;

    let inventoryRootNode = document.getElementById("fieldset-inventory");
    let inventoryNode = await getInventoryNode();
    inventoryRootNode.appendChild(inventoryNode);
    addProductAutoComplete(gInventoryIndex);
}

async function removeInventory() {
    if (gInventoryIndex == 0) {
        return;
    }

    let lastInventoryNode = document.getElementById("fieldset-inventory").lastChild;
    lastInventoryNode.remove();

    --gInventoryIndex;
}

async function getReceiptData() {
    let transactionDate = document.querySelector("#receipt-transaction-date").value;
    // workaround to pad 2 zeros when the second part is 00
    const dateRe = /^\d{4,5}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    if (dateRe.exec(transactionDate)) {
        transactionDate += ":00";
    }
    let isTaxed = document.querySelector("#receipt-taxed").checked;
    let receipt = new Receipt(transactionDate, isTaxed);

    let currencyId = document.querySelector("#receipt-currency-id").value;
    if (currencyId) {
        receipt.currency = {
            id: Number(currencyId)
        };
    }
    else {
        receipt.currency = {
            name: document.querySelector("#receipt-currency-name").value
        }
    }

    let storeId = document.querySelector("#receipt-store-id").value;
    if (storeId) {
        receipt.store.id = Number(storeId);
    }
    else {
        let storeName = document.querySelector("#receipt-store-name").value;
        if (storeName) {
            receipt.store.name = storeName;
        }
        let storeAlias = document.querySelector("#receipt-store-alias").value;
        if (storeAlias) {
            receipt.store.alias = storeAlias;
        }
        let storeBranch = document.querySelector("#receipt-store-branch").value;
        if (storeBranch) {
            receipt.store.branch = storeBranch;
        }
        let storeAddress = document.querySelector("#receipt-store-address").value;
        if (storeAddress) {
            receipt.store.address = storeAddress;
        }
    }

    let inventoriesList = document.querySelectorAll("#fieldset-inventory > div.grid-wrapper > div.grid-row-one-two > input");
    for (let i = 0; i < inventoriesList.length; i += FIELD_PER_INVENTORY) {
        let inventory = {
            product: {}
        };

        let productId = inventoriesList[i+0].value;
        if (productId) {
            receipt.product.id = Number(productId);
        }
        else {
            let productName = inventoriesList[i+1].value;
            if (productName) {
                inventory.product.name = productName;
            }
            let productAlias = inventoriesList[i+2].value;
            if (productAlias) {
                inventory.product.alias = productAlias;
            }
            let productBrand = inventoriesList[i+3].value;
            if (productBrand) {
                inventory.product.brand = productBrand;
            }
            let productSpecAmount = inventoriesList[i+4].value;
            if (productSpecAmount) {
                inventory.product.specification_amount = Number(productSpecAmount);
            }
            let productSpecUnit = inventoriesList[i+5].value;
            if (productSpecUnit) {
                inventory.product.specification_unit = productSpecUnit;
            }
            let productSpecOthers = inventoriesList[i+6].value;
            if (productSpecOthers) {
                inventory.product.specification_others = productSpecOthers;
            }
        }
        
        let price = inventoriesList[i+7].value;
        if (price) {
            inventory.price = Number(price);
        }
        
        let quantity = inventoriesList[i+8].value;
        if (quantity) {
            inventory.quantity = Number(quantity);
        }

        receipt.inventories.push(inventory);
    }

    return receipt;
}

async function submit() {
    const postData = await getReceiptData();
    const request = new Request(`${API_BASE}/receipts`, {
        method: "POST", 
        credentials: 'include',
        body: JSON.stringify(postData), 
        headers: {
            "Content-Type": "application/json"
        }
    });

    try {
        const response = await fetch(request);
        let payload = await response.json();
        if (payload.data) {
            alert(`Receipt added, transaction id: ${payload.data}`);
        }
        else {
            alert(`Receipt added failed - ${payload.error}`);
        }
    }
    catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function getAutoComplete(type, keyword) {
    let payload;
    try {
        let url = `${API_BASE}/${type}/autocomplete?keyword=${keyword}`;
        let res = await fetch(url, {
            credentials: "include",
        });
        payload = await res.json();
    }
    catch (error) {
        console.error(`Error: ${error}`);
    }

    return payload.data;
}

async function getAutoCompleteOptions(tbNameId, tbIdId, tbArray, type, keyword) {
    let tbName = document.getElementById(tbNameId)
    let tbId = document.getElementById(tbIdId)
    let collection = await getAutoComplete(type, keyword);
    let options = collection.map(e => {
        let option = document.createElement("li");
        option.value = e.id;
        option.innerText = e.name;
        if (type == "stores") {
            option.setAttribute("receipt-store-alias", e.alias);
            option.setAttribute("receipt-store-branch", e.branch);
            option.setAttribute("receipt-store-address", e.address);
        }
        else if (type == "products") {
            option.setAttribute(`receipt-product-alias`, e.alias);
            option.setAttribute("receipt-product-brand", e.brand);
            option.setAttribute("receipt-product-specification-amount", e.specification_amount);
            option.setAttribute("receipt-product-specification-unit", e.specification_unit);
            option.setAttribute("receipt-product-specification-others", e.specification_others);
        }
        option.addEventListener("click", () => {
            tbName.value = option.innerText;
            tbId.value = option.value;
            tbArray.forEach((el) => {
                let attrName = el;
                if (type == "products") {
                    attrName = attrName.substring(0, attrName.lastIndexOf('-'));
                }
                let val = option.getAttribute(attrName);
                let tb = document.getElementById(el);
                if (val != null && val != "null") {
                    tb.value = val;
                }
                else {
                    tb.value = "";
                }
            })
        });
        return option;
    });

    return options;
}

async function addAutoComplete(tbNameId, tbIdId, ulId, tbArray, type) {
    let tbName = document.getElementById(tbNameId)

    let selectBox = document.getElementById(ulId);
    let options = await getAutoCompleteOptions(tbNameId, tbIdId, tbArray, type, tbName.value);
    selectBox.replaceChildren(...options);

    let updateOptions = async function (e) {
        let options = await getAutoCompleteOptions(tbNameId, tbIdId, tbArray, type, e.target.value);
        selectBox.replaceChildren(...options);
    };

    tbName.addEventListener("input", updateOptions);
    tbName.addEventListener("keydown", updateOptions);

    document.addEventListener("click", function (e) {
        if (e.target.id !== tbNameId) {
            selectBox.className = "noshow";
        }
    });

    tbName.addEventListener("focusin", () => {
        selectBox.className = "show"
    });
}

async function addProductAutoComplete(inventoryIdx) {
    await addAutoComplete(
        `receipt-product-name-${inventoryIdx}`, 
        `receipt-product-id-${inventoryIdx}`, 
        `receipt-product-ul-${inventoryIdx}`, 
        [
            `receipt-product-alias-${inventoryIdx}`, 
            `receipt-product-brand-${inventoryIdx}`, 
            `receipt-product-specification-amount-${inventoryIdx}`,
            `receipt-product-specification-unit-${inventoryIdx}`,
            `receipt-product-specification-others-${inventoryIdx}`
        ], 
        "products"
    );
}

async function main() {
    let addButton = document.getElementById("receipt-add-inventory");
    addButton.addEventListener("click", () => addInventory());
    let removeButton = document.getElementById("receipt-remove-inventory");
    removeButton.addEventListener("click", () => removeInventory());
    let submitButton = document.getElementById("receipt-submit");
    submitButton.addEventListener("click", () => submit());

    await addAutoComplete(
        "receipt-currency-name", 
        "receipt-currency-id", 
        "receipt-currency-ul", 
        [], 
        "currencies"
    );
    
    await addAutoComplete(
        "receipt-store-name", 
        "receipt-store-id", 
        "receipt-store-ul", 
        ["receipt-store-alias", "receipt-store-branch", "receipt-store-address"], 
        "stores"
    );
    
    await addProductAutoComplete(gInventoryIndex);
}

main();