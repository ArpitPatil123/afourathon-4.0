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
let dummyDriverData = {
    driverName: "arpit",
    driverEmail: "arpit12@gmail.com",
    driverPhone: "1234567849",
};
let dummyCabData = {
    cabRegistrationNumber: "MH12AB1234",
    cabModel: "Suzuki",
    cabColour: "White",
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
describe("/api/v4/cab", () => {
    describe("Add cab functionality", () => {
        // Test case 1: Should return 201 if cab is added successfully
        it("Should return 201 if cab is added successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(app)
                .post("/api/v4/cab/add_cab")
                .send(dummyCabData);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("message", "Cab details added successfully");
        }));
        // Test case 2: Should return 400 if cab is already registered
        it("Should return 409 if cab is already registered", () => __awaiter(void 0, void 0, void 0, function* () {
            yield request(app).post("/api/v4/cab/add_cab").send(dummyCabData);
            const res = yield request(app)
                .post("/api/v4/cab/add_cab")
                .send(dummyCabData);
            expect(res.status).toBe(409);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "Cab already exists");
        }));
        // Test case 3: Should return 400 if cab details are not provided
        it("Should return 400 if cab details are not provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(app).post("/api/v4/cab/add_cab").send({});
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "Please provide all the details");
        }));
        // Test case 4: Should return 400 if cab registration number is invalid
        it("Should return 400 if cab registration number is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(app)
                .post("/api/v4/cab/add_cab")
                .send(Object.assign(Object.assign({}, dummyCabData), { cabRegistrationNumber: "MH12AB123" }));
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "Please provide a valid cab registration number");
        }));
    });
    describe("Get all cabs functionality", () => {
        // Test case 1: Should return 200 if cabs are fetched successfully
        it("Should return 200 if cabs are fetched successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            yield request(app).post("/api/v4/cab/add_cab").send(dummyCabData);
            const res = yield request(app).get("/api/v4/cab/get_all_cabs");
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("message", "Cabs fetched successfully");
        }));
        // Test case 2: Should return 404 if no cabs are found
        it("Should return 404 if no cabs are found", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(app).get("/api/v4/cab/get_all_cabs");
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "No cabs found");
        }));
    });
    describe("Assign driver functionality", () => {
        // Test case 1: Should return 201 if driver is assigned
        it("Should return 201 if driver is assigned successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const driver = yield request(app)
                .post("/api/v4/driver/add_driver")
                .send(dummyDriverData);
            const cab = yield request(app)
                .post("/api/v4/cab/add_cab")
                .send(dummyCabData);
            const res = yield request(app).put(`/api/v4/cab/assign_driver/${driver.body.data.driverId}/${cab.body.data.cabRegistrationNumber}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("message", "Driver assigned successfully");
        }));
        // Test case 2: Should return 404 if driver is not found
        it("Should return 404 if driver is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const cab = yield request(app)
                .post("/api/v4/cab/add_cab")
                .send(dummyCabData);
            const res = yield request(app).put(`/api/v4/cab/assign_driver/123/${cab.body.data.cabRegistrationNumber}`);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "Driver does not exist");
        }));
        // Test case 3: Should return 404 if cab is not found
        it("Should return 404 if cab is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const driver = yield request(app)
                .post("/api/v4/driver/add_driver")
                .send(dummyDriverData);
            const res = yield request(app).put(`/api/v4/cab/assign_driver/${driver.body.data.driverId}/MH12AB123`);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "Cab does not exist");
        }));
        // Test case 4: Should return 409 if cab is already assigned
        it("Should return 409 if cab is already assigned", () => __awaiter(void 0, void 0, void 0, function* () {
            const driver = yield request(app)
                .post("/api/v4/driver/add_driver")
                .send(dummyDriverData);
            const cab = yield request(app)
                .post("/api/v4/cab/add_cab")
                .send(dummyCabData);
            yield request(app).put(`/api/v4/cab/assign_driver/${driver.body.data.driverId}/${cab.body.data.cabRegistrationNumber}`);
            const res = yield request(app).put(`/api/v4/cab/assign_driver/${driver.body.data.driverId}/${cab.body.data.cabRegistrationNumber}`);
            expect(res.status).toBe(409);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "Driver is already assigned");
        }));
    });
    describe("Unassign driver functionality", () => {
        // Test case 1: Should return 200 if driver is unassigned
        it("Should return 200 if driver is unassigned successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const driver = yield request(app)
                .post("/api/v4/driver/add_driver")
                .send(dummyDriverData);
            const cab = yield request(app)
                .post("/api/v4/cab/add_cab")
                .send(dummyCabData);
            yield request(app).put(`/api/v4/cab/assign_driver/${driver.body.data.driverId}/${cab.body.data.cabRegistrationNumber}`);
            const res = yield request(app).put(`/api/v4/cab/unassign_driver/${cab.body.data.cabRegistrationNumber}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("message", "Driver unassigned successfully");
        }));
        // Test case 2: Should return 404 if cab is not found
        it("Should return 404 if cab is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(app).put(`/api/v4/cab/unassign_driver/MH12AB123`);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "Cab does not exist");
        }));
        // Test case 3: Should return 409 if cab already not assigned
        it("Should return 409 if cab already not assigned", () => __awaiter(void 0, void 0, void 0, function* () {
            const cab = yield request(app)
                .post("/api/v4/cab/add_cab")
                .send(dummyCabData);
            const res = yield request(app).put(`/api/v4/cab/unassign_driver/${cab.body.data.cabRegistrationNumber}`);
            expect(res.status).toBe(409);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "Driver already not assigned");
        }));
    });
    describe("Delete cab functionality", () => {
        // Test case 1: Should return 200 if cab is deleted
        it("Should return 200 if cab is deleted successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const cab = yield request(app)
                .post("/api/v4/cab/add_cab")
                .send(dummyCabData);
            const res = yield request(app).delete(`/api/v4/cab/delete_cab/${cab.body.data.cabRegistrationNumber}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("message", "Cab successfully deleted");
        }));
        // Test case 2: Should return 404 if cab is not found
        it("Should return 404 if cab is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(app).delete(`/api/v4/cab/delete_cab/MH12AB123`);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "Cab does not exist");
        }));
    });
    describe("Get all cabs with driver functionality", () => {
        // Test case 1: Should return 200 if cabs are fetched
        it("Should return 200 if cabs are fetched successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const driver = yield request(app)
                .post("/api/v4/driver/add_driver")
                .send(dummyDriverData);
            const cab = yield request(app)
                .post("/api/v4/cab/add_cab")
                .send(dummyCabData);
            yield request(app).put(`/api/v4/cab/assign_driver/${driver.body.data.driverId}/${cab.body.data.cabRegistrationNumber}`);
            const res = yield request(app).get(`/api/v4/cab/get_all_cabs_with_driver`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("message", "Cabs fetched successfully");
            expect(res.body).toHaveProperty("data");
        }));
        // Test case 2: Should return 404 if no cabs are found
        it("Should return 404 if no cabs are found", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(app).get(`/api/v4/cab/get_all_cabs_with_driver`);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "No cabs found");
        }));
    });
    describe("Get all cabs without driver functionality", () => {
        // Test case 1: Should return 200 if cabs are fetched
        it("Should return 200 if cabs are fetched successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const cab = yield request(app)
                .post("/api/v4/cab/add_cab")
                .send(dummyCabData);
            const res = yield request(app).get(`/api/v4/cab/get_all_cabs_without_driver`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("message", "Cabs fetched successfully");
            expect(res.body).toHaveProperty("data");
        }));
        // Test case 2: Should return 404 if no cabs are found
        it("Should return 404 if no cabs are found", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(app).get(`/api/v4/cab/get_all_cabs_without_driver`);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "No cabs found");
        }));
    });
    describe("Update cab details functionality", () => {
        // Test case 1: Should return 200 if cab details are updated
        it("Should return 200 if cab details are updated successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const cab = yield request(app)
                .post("/api/v4/cab/add_cab")
                .send(dummyCabData);
            const res = yield request(app).put(`/api/v4/cab/update_cab/${cab.body.data.cabRegistrationNumber}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("message", "Cab details updated successfully");
        }));
        // Test case 2: Should return 404 if cab is not found
        it("Should return 404 if cab is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(app).put(`/api/v4/cab/update_cab/MH12AB123`);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "Cab not found");
        }));
    });
    describe("Update cab registration number functionality", () => {
        // Test case 1: Should return 200 if cab registration number is updated
        it("Should return 200 if cab registration number is updated successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const cab = yield request(app)
                .post("/api/v4/cab/add_cab")
                .send(dummyCabData);
            const res = yield request(app)
                .put(`/api/v4/cab/update_cab_registration_number/${cab.body.data.cabRegistrationNumber}`)
                .send({ cabRegistrationNumber: "MH12AB123" });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("message", "Cab registration number updated successfully");
        }));
        // Test case 2: Should return 404 if cab is not found
        it("Should return 404 if cab is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(app)
                .put(`/api/v4/cab/update_cab_registration_number/MH12AB123`)
                .send({ cabRegistrationNumber: "MH12AB123" });
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "Cab not found");
        }));
    });
});
