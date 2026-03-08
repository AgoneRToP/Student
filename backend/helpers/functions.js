const fs = require("node:fs");
const path = require("node:path");

const filePath = path.join(process.cwd(), "db", "student.json");

function readFileCustom() {
  return JSON.parse(fs.readFileSync(filePath));
}

function writeFileCustom(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

module.exports = { readFileCustom, writeFileCustom };
