let form = document.querySelector("form");
let error = document.querySelector(".error");
let result = document.querySelector(".result");

async function getCurrencies() {
    try {
        const request = await fetch("https://api.frankfurter.app/currencies");
        const currencies = await request.json();
        return currencies;
    } catch (error) {
        console.log(error);
    }
}

async function setOptions() {
    const currencies = await getCurrencies();

    if (Object.keys(currencies).length > 1) {
        let option = document.createElement("option");
        option.value = "all";
        option.textContent = "All currencies";

        form.liste2.appendChild(option);
    }

    for (const currency in currencies) {
        let option = document.createElement("option");
        option.value = currency;
        option.textContent = `${currencies[currency]} (${currency})`;

        form.liste1.appendChild(option);
        form.liste2.appendChild(option.cloneNode(true));
    }
}

setOptions();

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    error.innerHTML = "";
    result.innerHTML = "";

    const currencies = await getCurrencies();

    if (
        !form.amount.value ||
        isNaN(form.amount.value) ||
        Number(form.amount.value) <= 0
    ) {
        error.innerHTML = "Le montant doit être un nombre positif<br>";
    }

    if (
        !form.liste1.value ||
        !JSON.stringify(currencies).includes(form.liste1.value)
    ) {
        error.innerHTML += "La devise à convertir doit être valide<br>";
    }

    if (
        !form.liste2.value ||
        (!JSON.stringify(currencies).includes(form.liste2.value) &&
            form.liste2.value != "all")
    ) {
        error.innerHTML += "La devise de conversion doit être valide<br>";
    }

    if (form.liste1.value == form.liste2.value) {
        error.innerHTML +=
            "Vous devez choisir 2 devises différentes lors d'une conversion<br>";
    }

    if (error.innerHTML == "") {
        try {
            let request = await fetch(
                `https://api.frankfurter.app/latest?amount=${form.amount.value}&from=${form.liste1.value}`
            );
            if (form.liste2.value != "all") {
                try {
                    request = await fetch(
                        `https://api.frankfurter.app/latest?amount=${form.amount.value}&from=${form.liste1.value}&to=${form.liste2.value}`
                    );
                } catch (errors) {
                    error.innerHTML = errors;
                }
            }

            const rates = await request.json();

            for (const rate in rates.rates) {
                let p = document.createElement("p");
                p.innerHTML = `${form.amount.value} ${form.liste1.value} = ${rates.rates[rate]} ${rate}`;
                result.appendChild(p);
            }
        } catch (errors) {
            error.innerHTML = errors;
        }
    }
});
