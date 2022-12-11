const $ = (sel, con) => (con || document).querySelector(sel);
const $$ = (sel, con) => (con || document).querySelectorAll(sel);

const order = $("#input-order");
const client = $("#input-client");
const fiverr = $("#input-fiverr");
const convert = $("#input-convert");
const paypal = $("#input-paypal");

const INR = "₹";
let usdToInr;
let amountInUsd = 0;
let clientPays = 0;
let fiverrPays = 0;
let amountInInr = 0;
let paypalPays = 0;

const getUsdToInr = async () => {
  const url = "https://open.er-api.com/v6/latest/USD";
  const response = await fetch(url);
  const json = await response.json();
  usdToInr = json.rates.INR;
  convert.previousElementSibling.innerText = `$1 = ${INR}${usdToInr}`;
};

getUsdToInr();

// injectValuesIntoInput();

const injectValuesIntoInput = () => {
  order.value = amountInUsd;
  client.value = clientPays;
  fiverr.value = fiverrPays;
  convert.value = amountInInr;
  paypal.value = paypalPays;
};

const inputListener = (e) => {
  const value = e.target.value;
  const type = e.target.dataset.type;

  if (isNaN(value)) return;

  switch (type) {
    case "order":
      amountInUsd = parseFloat(value);
      if (!value) amountInUsd = 0;
      clientPays = amountInUsd * 1.055;
      fiverrPays = amountInUsd * 0.8;
      amountInInr = fiverrPays * usdToInr;
      paypalPays = fiverrPays * (usdToInr - 2);
      break;
    case "client":
      clientPays = parseFloat(value);
      if (!value) clientPays = 0;
      amountInUsd = clientPays / 1.055;
      fiverrPays = amountInUsd * 0.8;
      amountInInr = fiverrPays * usdToInr;
      paypalPays = fiverrPays * (usdToInr - 2);
      break;
    case "fiverr":
      fiverrPays = parseFloat(value);
      if (!value) fiverrPays = 0;
      amountInUsd = fiverrPays / 0.8;
      clientPays = amountInUsd * 1.055;
      amountInInr = fiverrPays * usdToInr;
      paypalPays = fiverrPays * (usdToInr - 2);
      break;
    case "convert":
      amountInInr = parseFloat(value);
      if (!value) amountInInr = 0;
      fiverrPays = value / usdToInr;
      amountInUsd = fiverrPays / 0.8;
      clientPays = amountInUsd * 1.055;
      paypalPays = fiverrPays * (usdToInr - 2);
      break;
    case "paypal":
      paypalPays = parseFloat(value);
      if (!value) paypalPays = 0;
      fiverrPays = paypalPays / (usdToInr - 2);
      amountInUsd = fiverrPays / 0.8;
      clientPays = amountInUsd * 1.055;
      amountInInr = fiverrPays * usdToInr;
      break;
    default:
      console.log("Type error in inputListener");
  }

  injectValuesIntoInput();
};

$$("input").forEach((input) => input.addEventListener("input", inputListener));
