const { execSync } = require("node:child_process");
const assert = require("node:assert");
const { readFileSync } = require("node:fs");

const action = process.argv[2];
assert(
  action === "get" || action === "update",
  "Provide either get or update as first argument"
);

const functionName = process.argv[3];
assertNonEmptyString(
  functionName,
  "Provide a lambda function name as second argument"
);

let result;

if (action === "get") {
  result = execSync(`aws lambda get-function --function-name ${functionName}`);
  console.log(result.toString());
  process.exit(0);
}

if (action === "update") {
  const env = readFileSync("./env.json", "utf-8");

  result = execSync(
    `aws lambda update-function-configuration \
    --function-name ${functionName} \
    --environment '${env}'`
  );

  console.log(result.toString());
}

function assertNonEmptyString(str, msg) {
  if (msg) {
    assert(typeof str === "string" && str !== "", msg);
    return;
  }
  assert(typeof str === "string" && str !== "");
}
