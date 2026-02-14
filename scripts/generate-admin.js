// scripts/generate-admin.js
const bcrypt = require("bcryptjs");

async function generateAdmin() {
  const password = "crazwashMantep666";
  const hash = await bcrypt.hash(password, 10);

  console.log("=====================");
  console.log("Password (plain):", password);
  console.log("Password (hash):", hash);
  console.log("=====================");
}

generateAdmin();
