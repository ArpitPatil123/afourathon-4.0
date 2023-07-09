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
describe("POST /api/v4/auth/register", () => {
    it("Should return 201 user created", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post("/api/v4/auth/register")
            .send(dummyData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("data");
    }));
});
