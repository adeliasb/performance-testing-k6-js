// path: scripts/spike_test.js
// Script de teste de pico para o site BlazeDemo

import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

// Métrica para contabilizar erros
export let errorRate = new Rate("errors");

// Configuração do teste de pico
export let options = {
  stages: [
    { duration: "30s", target: 0 }, // Início gradual
    { duration: "1m", target: 250 }, // Pico súbito de 250 VUs
    { duration: "2m", target: 250 }, // Mantém o pico
    { duration: "1m", target: 0 }, // Descida gradual para 0 VUs
  ],
  thresholds: {
    http_req_duration: ["p(90)<2000"], // Validação do SLA de 2s
    errors: ["rate<0.01"], // Máximo de 1% de erros
  },
};

// Função principal
export default function () {
  let res = http.get("https://www.blazedemo.com");

  // Valida status da resposta e contabiliza erros
  check(res, { "home page ok": (r) => r.status === 200 }) || errorRate.add(1);

  sleep(1); // Pausa simulando interação real do usuário
}
