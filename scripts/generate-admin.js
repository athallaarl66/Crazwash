const bcrypt = require("bcryptjs");

async function generateAdmin() {
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);

  console.log("=====================");
  console.log("Email: admin@shoes.com");
  console.log("Password:", password);
  console.log("Hash:", hash);
  console.log("=====================");
  console.log("\nCopy SQL di bawah ini ke MySQL Workbench:\n");
  console.log(`DELETE FROM User WHERE email = 'admin@shoes.com';`);
  console.log(`
INSERT INTO User (email, password, name, role, createdAt, updatedAt)
VALUES (
  'admin@shoes.com',
  '${hash}',
  'Admin User',
  'ADMIN',
  NOW(),
  NOW()
);`);
}

generateAdmin();
