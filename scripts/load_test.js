// path: scripts/load_test.js
// Script de teste de carga (load test) para o site BlazeDemo
// Objetivo: simular 250 usuários simultâneos e validar performance e erros

import http from "k6/http"; // Módulo para fazer requisições HTTP
import { check, sleep } from "k6"; // check valida respostas, sleep adiciona pausa
import { Rate } from "k6/metrics"; // Para medir taxa de erros
import { randomName, randomCreditCard } from "../utils/helpers.js"; // Funções utilitárias

// Criação da métrica personalizada para erros
export let errorRate = new Rate("errors");

// Configuração do teste
export let options = {
  stages: [
    { duration: "1m", target: 100 }, // Aquecimento gradual
    { duration: "3m", target: 250 }, // Pico para atender critério 250 VUs
    { duration: "2m", target: 250 }, // Mantém a carga
    { duration: "1m", target: 0 }, // Desaceleração
  ],
  thresholds: {
    http_req_duration: ["p(90)<2000"], // 90º percentil < 2 segundos
    errors: ["rate<0.01"], // Máximo de 1% de erros
  },
};

// Função principal executada por cada VU
export default function () {
  // 1) Página inicial
  let resHome = http.get("https://www.blazedemo.com");
  check(resHome, { "Home status 200": (r) => r.status === 200 }) ||
    errorRate.add(1);

  // 2) Seleção do voo
  let resSearch = http.post("https://www.blazedemo.com/reserve.php", {
    fromPort: "Boston",
    toPort: "New York",
  });
  check(resSearch, { "Search status 200": (r) => r.status === 200 }) ||
    errorRate.add(1);

  // 3) Compra da passagem
  let resPurchase = http.post("https://www.blazedemo.com/purchase.php", {
    name: randomName(), // Nome aleatório
    address: "Rua Exemplo, 123",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "20000-000",
    cardType: "visa",
    creditCardNumber: randomCreditCard(), // Cartão de teste
    creditCardMonth: "12",
    creditCardYear: "2025",
    nameOnCard: randomName(),
  });
  check(resPurchase, {
    "Purchase status 200": (r) => r.status === 200,
    "Purchase confirmed": (r) => r.body.includes("Thank you for your purchase"),
  }) || errorRate.add(1);

  sleep(1); // Pausa para simular tempo real entre interações
}
