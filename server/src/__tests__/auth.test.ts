import request from "supertest";
import app from "../app";

import { connectDB, dropDB, dropCollections } from "../utils/testDb";

interface User {
  email: string;
  password: string;
  name: string;
  phone: string;
  cnfPassword: string;
}

let dummyData: User = {
  name: "arpit123",
  email: "arpit1234@gmail.com",
  password: "12345",
  phone: "1234567890",
  cnfPassword: "12345",
};

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await dropCollections();
});

afterAll(async () => {
  await dropDB();
});

describe("POST /api/v4/auth", () => {
  // Block of code to test the functionality of the register route
  describe("Register Route Functionality", () => {
    // Test case 1: Should return 201 if user is created
    it("Should return 201 user created", async () => {
      const response = await request(app)
        .post("/api/v4/auth/register")
        .send(dummyData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
    });

    // Test case 2: Should return 409 if user already exists
    it("Should return 409 if user already exists", async () => {
      await request(app).post("/api/v4/auth/register").send(dummyData); // First send the request to create a user with dummyData object and then send the same request again

      const response = await request(app)
        .post("/api/v4/auth/register")
        .send(dummyData);
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });

    // Test case 3: Should return 400 if email is not valid
    it("Should return 400 if email is not valid", async () => {
      const response = await request(app)
        .post("/api/v4/auth/register")
        .send({ ...dummyData, email: "arpit1234" });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });

    // Test case 4: Should return 400 if phone number is not valid
    it("Should return 400 if phone number is not valid", async () => {
      const response = await request(app)
        .post("/api/v4/auth/register")
        .send({ ...dummyData, phone: "123456789" });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });

    // Test case 5: Should return 400 if password and confirm password are not same
    it("Should return 400 if password and confirm password are not same", async () => {
      const response = await request(app)
        .post("/api/v4/auth/register")
        .send({
          ...dummyData,
          cnfPassword: "123456",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });

    // Test case 6: Should return 400 if all details are not provided
    it("Should return 400 if all details are not provided", async () => {
      const response = await request(app)
        .post("/api/v4/auth/register")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("Login Route Functionality", () => {
    // Test case 1: Should return 200 if user is logged in
    it("Should return 200 if user is logged in", async () => {
      await request(app).post("/api/v4/auth/register").send(dummyData); // First send the request to create a user with dummyData object and then send the same request again
      const response = await request(app)
        .post("/api/v4/auth/login")
        .send({ email: dummyData.email, password: dummyData.password });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.header).toHaveProperty("set-cookie");
    });

    // Test case 2: Should return 400 if email is not valid
    it("Should return 400 if email is not valid", async () => {
      const response = await request(app)
        .post("/api/v4/auth/login")
        .send({ email: "arpit1234", password: dummyData.password });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });

    // Test case 3: Should return 404 if user does not exist
    it("Should return 404 if user does not exist", async () => {
      const response = await request(app)
        .post("/api/v4/auth/login")
        .send({ email: "arpit@gmail.com", password: dummyData.password });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });

    // Test case 4: Should return 400 if password is incorrect
    it("Should return 400 if password is incorrect", async () => {
      await request(app).post("/api/v4/auth/register").send(dummyData); // First send the request to create a user with dummyData object and then send the same request again
      const response = await request(app)
        .post("/api/v4/auth/login")
        .send({ email: dummyData.email, password: "123456" });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });

    //
  });
});
