// path: scripts/purchase_test.js
// Cenário isolado testando somente a etapa de compra
// Objetivo: medir o endpoint mais pesado do fluxo

import http from "k6/http";
import { check } from "k6";

export let options = {
  scenarios: {
    purchase: {
      executor: "constant-arrival-rate",
      rate: 250,
      timeUnit: "1s",
      duration: "2m",
      preAllocatedVUs: 150,
      maxVUs: 300,
    },
  },
  thresholds: {
    http_req_duration: ["p(90)<2000"],
    errors: ["rate<0.01"],
  },
};

export default function () {
  // 1. Buscar voo (pré-requisito para a compra)
  let reservation = http.post("https://www.blazedemo.com/reserve.php", {
    fromPort: "Boston",
    toPort: "London",
  });
  check(reservation, { "Reservation 200": (r) => r.status === 200 });

  // 2. POST da compra
  let purchase = http.post("https://www.blazedemo.com/purchase.php", {
    inputName: "Adelia",
    address: "Rua Teste",
    city: "SP",
    state: "SP",
    zipCode: "12345",
    cardType: "visa",
    creditCardNumber: "1111 2222 3333 4444",
    creditCardMonth: "12",
    creditCardYear: "2025",
    nameOnCard: "Adelia QA",
  });

  let ok = check(purchase, {
    "Purchase status 200": (r) => r.status === 200,
  });

  if (!ok) errors.add(1);
}
