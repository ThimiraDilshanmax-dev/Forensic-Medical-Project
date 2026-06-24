import request from "supertest";
import app from "../app.js";
import LabModel from "../models/LabModel.js";
import jwt from "jsonwebtoken";
import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

process.env.JWT_SECRET_KEY = "test-secret-key-for-jest";

describe("Lab Controller & Routes", () => {
    let createLabRequestSpy;
    let updateLabRequestSpy;
    let getAllLabRequestsSpy;
    let getLabRequestByIdSpy;
    let doctorToken;

    beforeEach(() => {
        createLabRequestSpy = jest.spyOn(LabModel, "createLabRequest");
        updateLabRequestSpy = jest.spyOn(LabModel, "updateLabRequest");
        getAllLabRequestsSpy = jest.spyOn(LabModel, "getAllLabRequests");
        getLabRequestByIdSpy = jest.spyOn(LabModel, "getLabRequestById");
        doctorToken = jwt.sign(
            { id: "USR-1002", role: "doctor", name: "Dr. Hansara" },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("1. GET /api/lab - Reject unauthorized access", async () => {
        const response = await request(app).get("/api/lab");
        expect(response.status).toBe(401);
    });

    test("2. GET /api/lab - Return all lab requests", async () => {
        const mockRequests = [{ id: "LAB-2026-1000", patientId: "p-2026-1000" }];
        getAllLabRequestsSpy.mockResolvedValue(mockRequests);

        const response = await request(app)
            .get("/api/lab")
            .set("Authorization", `Bearer ${doctorToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRequests);
    });

    test("3. GET /api/lab/:id - Return request if found", async () => {
        const mockRequest = { id: "LAB-2026-1000", patientId: "p-2026-1000" };
        getLabRequestByIdSpy.mockResolvedValue(mockRequest);

        const response = await request(app)
            .get("/api/lab/LAB-2026-1000")
            .set("Authorization", `Bearer ${doctorToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRequest);
    });

    test("4. POST /api/lab - Create lab request successfully", async () => {
        const inputData = { id: "LAB-2026-1000", patientId: "p-2026-1000", testType: "Toxicology" };
        createLabRequestSpy.mockResolvedValue(inputData);

        const response = await request(app)
            .post("/api/lab")
            .set("Authorization", `Bearer ${doctorToken}`)
            .send(inputData);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(inputData);
    });

    test("5. PUT /api/lab/:id - Update lab request successfully", async () => {
        const mockUpdated = { id: "LAB-2026-1000", status: "completed", resultNotes: "Clear" };
        updateLabRequestSpy.mockResolvedValue(mockUpdated);

        const response = await request(app)
            .put("/api/lab/LAB-2026-1000")
            .set("Authorization", `Bearer ${doctorToken}`)
            .send({ status: "completed", resultNotes: "Clear" });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUpdated);
    });
});
