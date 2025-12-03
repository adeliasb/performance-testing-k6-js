// path: scripts/home_test.js
// Cenário isolado testando somente a home do BlazeDemo
// Objetivo: medir disponibilidade sob carga e se a home responde dentro do SLA

import http from "k6/http";
import { check } from "k6";

export let options = {
  scenarios: {
    home: {
      executor: "constant-arrival-rate",
      rate: 250, // 250 requisições por segundo
      timeUnit: "1s",
      duration: "2m",
      preAllocatedVUs: 50,
      maxVUs: 200,
    },
  },
  thresholds: {
    http_req_duration: ["p(90)<2000"], // p90 < 2s
    errors: ["rate<0.01"], // menos de 1 por cento de erros
  },
};

export default function () {
  let res = http.get("https://www.blazedemo.com");

  let isOk = check(res, {
    "Home status 200": (r) => r.status === 200,
  });

  if (!isOk) {
    // métrica manual de erro para os thresholds
    errors.add(1);
  }
}
