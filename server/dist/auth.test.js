var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from "supertest";
import app from "../app";
import { connectDB, dropDB, dropCollections } from "../utils/testDb";
let dummyData = {
    name: "arpit123",
    email: "arpit1234@gmail.com",
    password: "12345",
    phone: "1234567890",
    cnfPassword: "12345",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDB();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield dropCollections();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield dropDB();
}));
describe("/api/v4/auth", () => {
    // Block of code to test the functionality of the register route
    describe("Register Route Functionality", () => {
        // Test case 1: Should return 201 if user is created
        it("Should return 201 user created", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .post("/api/v4/auth/register")
                .send(dummyData);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body).toHaveProperty("data");
        }));
        // Test case 2: Should return 409 if user already exists
        it("Should return 409 if user already exists", () => __awaiter(void 0, void 0, void 0, function* () {
            yield request(app).post("/api/v4/auth/register").send(dummyData); // First send the request to create a user with dummyData object and then send the same request again
            const response = yield request(app)
                .post("/api/v4/auth/register")
                .send(dummyData);
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("message");
        }));
        // Test case 3: Should return 400 if email is not valid
        it("Should return 400 if email is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .post("/api/v4/auth/register")
                .send(Object.assign(Object.assign({}, dummyData), { email: "arpit1234" }));
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("message");
        }));
        // Test case 4: Should return 400 if phone number is not valid
        it("Should return 400 if phone number is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .post("/api/v4/auth/register")
                .send(Object.assign(Object.assign({}, dummyData), { phone: "123456789" }));
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("message");
        }));
        // Test case 5: Should return 400 if password and confirm password are not same
        it("Should return 400 if password and confirm password are not same", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .post("/api/v4/auth/register")
                .send(Object.assign(Object.assign({}, dummyData), { cnfPassword: "123456" }));
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("message");
        }));
        // Test case 6: Should return 400 if all details are not provided
        it("Should return 400 if all details are not provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .post("/api/v4/auth/register")
                .send({});
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("message");
        }));
        // Test case 7: Should return 400 if phone number exists
        it("Should return 400 if phone number exists", () => __awaiter(void 0, void 0, void 0, function* () {
            yield request(app).post("/api/v4/auth/register").send(dummyData); // First send the request to create a user with dummyData object and then send the same request again
            const response = yield request(app)
                .post("/api/v4/auth/register")
                .send(Object.assign(Object.assign({}, dummyData), { email: "arpitpatil@gmail.com" }));
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("message");
        }));
    });
    describe("Login Route Functionality", () => {
        // Test case 1: Should return 200 if user is logged in
        it("Should return 200 if user is logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            yield request(app).post("/api/v4/auth/register").send(dummyData); // First send the request to create a user with dummyData object and then send the same request again
            const response = yield request(app)
                .post("/api/v4/auth/login")
                .send({ email: dummyData.email, password: dummyData.password });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(response.header).toHaveProperty("set-cookie");
        }));
        // Test case 2: Should return 400 if email is not valid
        it("Should return 400 if email is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .post("/api/v4/auth/login")
                .send({ email: "arpit1234", password: dummyData.password });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("message");
        }));
        // Test case 3: Should return 404 if user does not exist
        it("Should return 404 if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .post("/api/v4/auth/login")
                .send({ email: "arpit@gmail.com", password: dummyData.password });
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("message");
        }));
        // Test case 4: Should return 400 if password is incorrect
        it("Should return 400 if password is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
            yield request(app).post("/api/v4/auth/register").send(dummyData); // First send the request to create a user with dummyData object and then send the same request again
            const response = yield request(app)
                .post("/api/v4/auth/login")
                .send({ email: dummyData.email, password: "123456" });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("message");
        }));
        //
    });
});
