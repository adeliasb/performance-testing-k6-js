// path: scripts/search_test.js
// Cenário isolado testando a pesquisa de voos
// Objetivo: medir comportamento do formulário de busca sob carga

import http from "k6/http";
import { check } from "k6";

export let options = {
  scenarios: {
    search: {
      executor: "constant-arrival-rate",
      rate: 250,
      timeUnit: "1s",
      duration: "2m",
      preAllocatedVUs: 80,
      maxVUs: 250,
    },
  },
  thresholds: {
    http_req_duration: ["p(90)<2000"],
    errors: ["rate<0.01"],
  },
};

export default function () {
  // 1. Home
  let home = http.get("https://www.blazedemo.com");
  check(home, { "Home status 200": (r) => r.status === 200 });

  // 2. POST search de voos
  let search = http.post("https://www.blazedemo.com/reserve.php", {
    fromPort: "Boston",
    toPort: "London",
  });

  let ok = check(search, {
    "Search status 200": (r) => r.status === 200,
  });

  if (!ok) errors.add(1);
}
