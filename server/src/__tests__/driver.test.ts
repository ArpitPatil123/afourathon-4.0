import request from "supertest";
import app from "../app";

import { connectDB, dropDB, dropCollections } from "../utils/testDb";

interface Driver {
  driverName: string;
  driverEmail: string;
  driverPhone: string;
}

interface Cab {
  cabRegistrationNumber: string;
  cabModel: string;
  cabColour: string;
}

let dummyDriverData: Driver = {
  driverName: "arpit",
  driverEmail: "arpit12@gmail.com",
  driverPhone: "1234567849",
};

let dummyCabData: Cab = {
  cabRegistrationNumber: "MH12AB1234",
  cabModel: "Suzuki",
  cabColour: "White",
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

describe("/api/v4/driver", () => {
  describe("Add driver functionality", () => {
    // Test case 1: Should return 201 if driver is created
    it("Should return 201 if driver is created", async () => {
      const response = await request(app)
        .post("/api/v4/driver/add_driver")
        .send({ ...dummyDriverData });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Driver added successfully"
      );
      expect(response.body).toHaveProperty("data");
    });

    // Test case 2: Should return 409 if driver already exists
    it("Should return 409 if driver already exists", async () => {
      await request(app)
        .post("/api/v4/driver/add_driver")
        .send({ ...dummyDriverData });

      const response = await request(app)
        .post("/api/v4/driver/add_driver")
        .send({ ...dummyDriverData });
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Email already exists");
    });

    // Test case 3: Should return 400 if email is not valid
    it("Should return 400 if email is not valid", async () => {
      const response = await request(app)
        .post("/api/v4/driver/add_driver")
        .send({ ...dummyDriverData, driverEmail: "arpit12gmail.com" });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty(
        "message",
        "Please provide a valid email"
      );
    });

    // Test case 4: Should return 400 if phone is not valid
    it("Should return 400 if phone is not valid", async () => {
      const response = await request(app)
        .post("/api/v4/driver/add_driver")
        .send({ ...dummyDriverData, driverPhone: "123456" });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty(
        "message",
        "Please provide a valid phone number"
      );
    });

    // Test case 5: Should return 400 if phone number exists
    it("Should return 400 if phone number exists", async () => {
      await request(app)
        .post("/api/v4/driver/add_driver")
        .send({ ...dummyDriverData, driverEmail: "arpitpatil@gmail.com" });

      const response = await request(app)
        .post("/api/v4/driver/add_driver")
        .send({ ...dummyDriverData });
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty(
        "message",
        "Phone number already exists"
      );
    });

    // Test case 6: Should return 400 if details are not provided
    it("Should return 400 if details are not provided", async () => {
      const response = await request(app)
        .post("/api/v4/driver/add_driver")
        .send({ driverEmail: "arpit12@gmail.com" });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty(
        "message",
        "Please provide all the details"
      );
    });
  });

  describe("Get all drivers functionality", () => {
    // Tests case 1: Should return 200 if drivers are found
    it("Should return 200 if drivers are found", async () => {
      await request(app)
        .post("/api/v4/driver/add_driver")
        .send(dummyDriverData);

      const response = await request(app).get("/api/v4/driver/get_all_drivers");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Drivers fetched successfully"
      );
      expect(response.body).toHaveProperty("data");
    });

    // Test case 2: Should return 404 if no drivers are found
    it("Should return 404 if no drivers are found", async () => {
      const response = await request(app).get("/api/v4/driver/get_all_drivers");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "No drivers found");
    });
  });

  describe("Delete Driver functionality", () => {
    // Test case 1: Should return 200 if driver is deleted
    it("Should return 200 if driver is deleted", async () => {
      const driver = await request(app)
        .post("/api/v4/driver/add_driver")
        .send(dummyDriverData);

      const response = await request(app)
        .delete(`/api/v4/driver/delete_driver/${driver.body.data.driverId}`)
        .send();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Driver deleted successfully"
      );
    });

    // Test case 2: Should return 404 if driver is not found
    it("Should return 404 if driver is not found", async () => {
      const response = await request(app)
        .delete(`/api/v4/driver/delete_driver/123456789`)
        .send();
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Driver not found");
    });
  });

  describe("Assign Cab functionality", () => {
    // Test case 1: Should return 200 if cab is assigned
    it("Should return 200 if cab is assigned", async () => {
      const cab = await request(app)
        .post("/api/v4/cab/add_cab")
        .send(dummyCabData);

      const driver = await request(app)
        .post("/api/v4/driver/add_driver")
        .send(dummyDriverData);

      const response = await request(app).put(
        `/api/v4/driver/assign_cab/${driver.body.data.driverId}/${cab.body.data.cabRegistrationNumber}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Cab assigned successfully"
      );
    });

    // Test case 2: Should return 404 if cab is not found
    it("Should return 404 if cab is not found", async () => {
      const driver = await request(app)
        .post("/api/v4/driver/add_driver")
        .send(dummyDriverData);

      const response = await request(app).put(
        `/api/v4/driver/assign_cab/${driver.body.data.driverId}/MH12AB1234`
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Cab not found");
    });

    // Test case 3: Should return 404 if driver is not found
    it("Should return 404 if driver is not found", async () => {
      const cab = await request(app)
        .post("/api/v4/cab/add_cab")
        .send(dummyCabData);

      const response = await request(app).put(
        `/api/v4/driver/assign_cab/123456789/${cab.body.data.cabRegistrationNumber}`
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Driver not found");
    });

    // Test case 4: Should return 400 if cab is already assigned
    it("Should return 400 if cab is already assigned", async () => {
      const cab = await request(app)
        .post("/api/v4/cab/add_cab")
        .send(dummyCabData);

      const driver = await request(app)
        .post("/api/v4/driver/add_driver")
        .send(dummyDriverData);

      await request(app).put(
        `/api/v4/driver/assign_cab/${driver.body.data.driverId}/${cab.body.data.cabRegistrationNumber}`
      );

      const response = await request(app).put(
        `/api/v4/driver/assign_cab/${driver.body.data.driverId}/${cab.body.data.cabRegistrationNumber}`
      );
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty(
        "message",
        "Cab is already assigned to another driver"
      );
    });
  });

  describe("Unassign Cab functionality", () => {
    // Test case 1: Should return 200 if cab is unassigned
    it("Should return 200 if cab is unassigned", async () => {
      const cab = await request(app)
        .post("/api/v4/cab/add_cab")
        .send(dummyCabData);

      const driver = await request(app)
        .post("/api/v4/driver/add_driver")
        .send(dummyDriverData);

      await request(app).put(
        `/api/v4/driver/assign_cab/${driver.body.data.driverId}/${cab.body.data.cabRegistrationNumber}`
      );

      const response = await request(app).put(
        `/api/v4/driver/unassign_cab/${driver.body.data.driverId}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Cab unassigned successfully"
      );
    });

    // Test case 2: Should return 404 if driver is not found
    it("Should return 404 if driver is not found", async () => {
      const response = await request(app).put(
        `/api/v4/driver/unassign_cab/1234`
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Driver not found");
    });

    // Test case 3: Should return 404 if cab is not assigned
    it("Should return 404 if cab already not assigned", async () => {
      const driver = await request(app)
        .post("/api/v4/driver/add_driver")
        .send(dummyDriverData);

      const response = await request(app).put(
        `/api/v4/driver/unassign_cab/${driver.body.data.driverId}`
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty(
        "message",
        "Cab already not assigned to this driver"
      );
    });
  });

  describe("Get all Drivers with cab functionality", () => {
    // Test case 2: Should return 404 if drivers not found
    it("Should return 404 if drivers not found", async () => {
      await request(app)
        .post("/api/v4/driver/add_driver")
        .send(dummyDriverData);

      const response = await request(app).get(
        "/api/v4/driver/get_all_drivers_with_cab"
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "No drivers found");
    });

    // Test case 1: Should return 200 if drivers are found
    it("Should return 200 if drivers are found", async () => {
      const cab = await request(app)
        .post("/api/v4/cab/add_cab")
        .send(dummyCabData);

      const driver = await request(app)
        .post("/api/v4/driver/add_driver")
        .send(dummyDriverData);

      await request(app).put(
        `/api/v4/driver/assign_cab/${driver.body.data.driverId}/${cab.body.data.cabRegistrationNumber}`
      );

      const response = await request(app).get(
        "/api/v4/driver/get_all_drivers_with_cab"
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Drivers fetched successfully"
      );
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("Get all Drivers without cab functionality", () => {
    // Test case 1: Should return 200 if drivers are found
    it("Should return 200 if drivers are found", async () => {
      await request(app)
        .post("/api/v4/driver/add_driver")
        .send(dummyDriverData);

      const response = await request(app).get(
        "/api/v4/driver/get_all_drivers_without_cab"
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Drivers fetched successfully"
      );
      expect(response.body).toHaveProperty("data");
    });

    // Test case 2: Should return 404 if no drivers are found
    it("Should return 404 if no drivers are found", async () => {
      const response = await request(app).get(
        "/api/v4/driver/get_all_drivers_without_cab"
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "No drivers found");
    });
  });

  describe("Update driver details functionality", () => {
    // Test case 1: Should return 200 if driver details are updated
    it("Should return 200 if driver details are updated", async () => {
      const driver = await request(app)
        .post("/api/v4/driver/add_driver")
        .send(dummyDriverData);

      const response = await request(app)
        .put(`/api/v4/driver/update_driver/${driver.body.data.driverId}`)
        .send({ driverName: "Arpit Patil" });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Driver details updated successfully"
      );
    });

    // Test case 2: Should return 404 if driver is not found
    it("Should return 404 if driver is not found", async () => {
      const response = await request(app)
        .put(`/api/v4/driver/update_driver/123456789`)
        .send({ driverName: "Arpit Patil" });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Driver not found");
    });
  });
});
