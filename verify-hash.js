const bcrypt = require("bcrypt");

// Step 1: Generate a new hash using the same password
const password = "5h9bXo4sTRrV0U0ewQzk";
const saltRounds = 10;

bcrypt.genSalt(saltRounds, function (err, salt) {
  bcrypt.hash(password, salt, function (err, hash) {
    console.log("New Hash:", hash);

    // Step 2: Compare the newly generated hash with the one in server.js
    const hashedPasswordFromServerJS =
      "$2b$10$Ij5.9Oa7eSLRHcSQKLiGMuKZBYmJSRVQAQwkLIGMuKZBYmJSRVQAQwk";

    bcrypt.compare(
      password,
      hashedPasswordFromServerJS,
      function (err, result) {
        console.log("Comparison Result:", result);
      }
    );
  });
});
