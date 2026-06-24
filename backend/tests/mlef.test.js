import request from "supertest";
import app from "../app.js";
import MlefModel from "../models/MlefModel.js";
import jwt from "jsonwebtoken";
import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

process.env.JWT_SECRET_KEY = "test-secret-key-for-jest";

describe("MLEF Controller & Routes", () => {
    let getMlefByIdSpy;
    let createMlefFormSpy;
    let updateMlefFormSpy;
    let getAllMlefFormsSpy;
    let doctorToken;

    beforeEach(() => {
        getMlefByIdSpy = jest.spyOn(MlefModel, "getMlefById");
        createMlefFormSpy = jest.spyOn(MlefModel, "createMlefForm");
        updateMlefFormSpy = jest.spyOn(MlefModel, "updateMlefForm");
        getAllMlefFormsSpy = jest.spyOn(MlefModel, "getAllMlefForms");
        doctorToken = jwt.sign(
            { id: "USR-1002", role: "doctor", name: "Dr. Hansara" },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("1. GET /api/mlef - Reject unauthorized access", async () => {
        const response = await request(app).get("/api/mlef");
        expect(response.status).toBe(401);
    });

    test("2. GET /api/mlef - Return all MLEF forms", async () => {
        const mockForms = [{ id: "MLEF-2026-1000", patientId: "p-2026-1000" }];
        getAllMlefFormsSpy.mockResolvedValue(mockForms);

        const response = await request(app)
            .get("/api/mlef")
            .set("Authorization", `Bearer ${doctorToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockForms);
    });

    test("3. GET /api/mlef/:id - Return form if found", async () => {
        const mockForm = { id: "MLEF-2026-1000", patientId: "p-2026-1000" };
        getMlefByIdSpy.mockResolvedValue(mockForm);

        const response = await request(app)
            .get("/api/mlef/MLEF-2026-1000")
            .set("Authorization", `Bearer ${doctorToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockForm);
    });

    test("4. GET /api/mlef/:id - Return 404 if not found", async () => {
        getMlefByIdSpy.mockResolvedValue(null);

        const response = await request(app)
            .get("/api/mlef/MLEF-2026-nonexistent")
            .set("Authorization", `Bearer ${doctorToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("MLEF form not found");
    });

    test("5. POST /api/mlef - Save new MLEF form successfully", async () => {
        const inputData = { id: "MLEF-2026-1000", patientId: "p-2026-1000", notes: "Injury report" };
        getMlefByIdSpy.mockResolvedValue(null); // doesn't exist yet
        createMlefFormSpy.mockResolvedValue(inputData);

        const response = await request(app)
            .post("/api/mlef")
            .set("Authorization", `Bearer ${doctorToken}`)
            .send(inputData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(inputData);
    });
});
