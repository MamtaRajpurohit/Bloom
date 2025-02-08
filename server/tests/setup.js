const mongoose = require("mongoose");

afterAll(async () => {
  await mongoose.connection.close(); // Close MongoDB connection after tests
});
