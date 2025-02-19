const fromCurrency = document.querySelector("#fromCurrency");
const amountInput = document.querySelector("#amount");
const toCurrency = document.querySelector("#toCurrency");
const button = document.querySelector("button");
const p = document.querySelector("p");

async function getData() {
    let response;
    try {
        response = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${api}`);
    } catch (e) {
        console.log(e.message);
    }
    if (!response.ok) {
        console.log("Response is not ok!!");
        return null;
    } else {
        const data = await response.json();
        return data;
    }
}

async function showCountry() {
    const data = await getData();
    console.log(data)
    const country = Object.keys(data.data);


    country.forEach(name => {
        const countryName = currencyCountryMap[name];

        const fromOption = document.createElement("option");
        fromOption.textContent = `${countryName}`;
        fromOption.value = name;
        if (name === "INR") {
            fromOption.selected = true;
        }
        fromCurrency.appendChild(fromOption);

        const toOption = document.createElement("option");
        toOption.textContent = `${countryName}`;
        toOption.value = name;
        if (name === "USD") {
            toOption.selected = true;
        }
        toCurrency.appendChild(toOption);
    });
}

button.addEventListener("click", async () => {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        showData("Please enter a valid amount!")
        return;
    }

    if (from === to) {
        showData('From and To currencies cannot be the same!');
        return;
    }

    const data = await getData();

    if (data && data.data) {
        const fromRate = data.data[from];
        const toRate = data.data[to];

        if (fromRate && toRate) {
            const convertedAmount = (amount / fromRate) * toRate;
            showData(`Converted Amount: ${convertedAmount.toFixed(2)} ${to}`);
        } else {
            showData("Invalid currency selection!")
        }
    } else {
        showData("Failed to fetch exchange rates!");
    }
});

let msg = "";
function showData(msg) {
    p.textContent = msg;
}

showCountry()