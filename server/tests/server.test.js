const request = require("supertest");
const app = require("../server");

describe("API Tests", () => {
  it("POST /api/messages should save a message", async () => {
    const res = await request(app)
      .post("/api/messages")
      .send({ sender: "User1", message: "Hello, world!" });
    expect(res.statusCode).toBe(201);
    expect(res.body.sender).toBe("User1");
    expect(res.body.message).toBe("Hello, world!");
  });
});
