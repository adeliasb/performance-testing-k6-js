// path: scripts/load_test.js
// Script de teste de carga para o site BlazeDemo

import http from "k6/http"; // Importa módulo HTTP do K6 para requisições
import { check, sleep } from "k6"; // check valida respostas HTTP, sleep adiciona pausas

// Configuração do teste de carga
export let options = {
  stages: [
    { duration: "2m", target: 250 }, // Gradualmente sobe para 250 VUs
    { duration: "3m", target: 250 }, // Mantém 250 VUs por 3 minutos
    { duration: "2m", target: 0 }, // Desce para 0 VUs no final
  ],
  thresholds: {
    http_req_duration: ["p(90)<2000"], // 90º percentil deve ser < 2 segundos
  },
};

// Função principal executada por cada VU
export default function () {
  // Página inicial
  let resHome = http.get("https://www.blazedemo.com");
  check(resHome, { "home page ok": (r) => r.status === 200 });

  // Seleção de voo
  let resReserve = http.post("https://www.blazedemo.com/reserve.php", {
    fromPort: "Boston",
    toPort: "New York",
  });
  check(resReserve, { "reserve page ok": (r) => r.status === 200 });

  // Compra de passagem
  let resPurchase = http.post("https://www.blazedemo.com/purchase.php", {
    inputName: "Adelia Test",
    address: "Rua Exemplo, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01000-000",
    cardType: "Visa",
    creditCardNumber: "4111111111111111",
    creditCardMonth: "12",
    creditCardYear: "2025",
    nameOnCard: "Adelia Test",
  });
  check(resPurchase, { "purchase success": (r) => r.status === 200 });

  sleep(1); // Pausa de 1 segundo para simular comportamento real do usuário
}
