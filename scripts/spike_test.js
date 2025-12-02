// path: scripts/spike_test.js
// Script de teste de pico para o site BlazeDemo

import http from "k6/http";
import { check, sleep } from "k6";

// Configuração do teste de pico
export let options = {
  stages: [
    { duration: "30s", target: 0 }, // Início gradual
    { duration: "1m", target: 500 }, // Pico súbito de 500 VUs
    { duration: "2m", target: 500 }, // Mantém o pico
    { duration: "1m", target: 0 }, // Descida gradual para 0 VUs
  ],
  thresholds: {
    http_req_duration: ["p(90)<2000"], // Validação do SLA de 2s
  },
};

// Função principal
export default function () {
  let res = http.get("https://www.blazedemo.com");
  check(res, { "home page ok": (r) => r.status === 200 });
  sleep(1); // Pausa simulando interação real do usuário
}
