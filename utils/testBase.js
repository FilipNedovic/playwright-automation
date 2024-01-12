const base = require("@playwright/test");

exports.customTest = base.test.extend({
  testData: {
    credentials: {
      email: "testis2@mail.com",
      password: "Test54321",
    },
    productName: "Zara Coat 3",
  },
});
