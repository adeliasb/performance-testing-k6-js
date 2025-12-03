// path: scripts/search_test.js

import http from "k6/http";
import { check } from "k6";
import { Counter } from "k6/metrics";

export let errors = new Counter("errors");

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
    errors: ["rate<0.01"], // Agora existe o metric name "errors"
  },
};

export default function () {
  let home = http.get("https://www.blazedemo.com");
  let homeOk = check(home, { "Home status 200": (r) => r.status === 200 });

  if (!homeOk) errors.add(1);

  let search = http.post("https://www.blazedemo.com/reserve.php", {
    fromPort: "Boston",
    toPort: "London",
  });

  let searchOk = check(search, {
    "Search status 200": (r) => r.status === 200,
  });

  if (!searchOk) errors.add(1);
}
