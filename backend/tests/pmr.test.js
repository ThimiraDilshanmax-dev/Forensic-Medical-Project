import request from "supertest";
import app from "../app.js";
import PmrModel from "../models/PmrModel.js";
import jwt from "jsonwebtoken";
import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

process.env.JWT_SECRET_KEY = "test-secret-key-for-jest";

describe("PMR Controller & Routes", () => {
    let getPmrByIdSpy;
    let createPmrReportSpy;
    let updatePmrReportSpy;
    let getAllPmrFormsSpy;
    let doctorToken;

    beforeEach(() => {
        getPmrByIdSpy = jest.spyOn(PmrModel, "getPmrById");
        createPmrReportSpy = jest.spyOn(PmrModel, "createPmrReport");
        updatePmrReportSpy = jest.spyOn(PmrModel, "updatePmrReport");
        getAllPmrFormsSpy = jest.spyOn(PmrModel, "getAllPmrForms");
        doctorToken = jwt.sign(
            { id: "USR-1002", role: "doctor", name: "Dr. Hansara" },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("1. GET /api/pmr - Reject unauthorized access", async () => {
        const response = await request(app).get("/api/pmr");
        expect(response.status).toBe(401);
    });

    test("2. GET /api/pmr - Return all PMR reports", async () => {
        const mockReports = [{ id: "PMR-2026-1000", patientId: "p-2026-1000" }];
        getAllPmrFormsSpy.mockResolvedValue(mockReports);

        const response = await request(app)
            .get("/api/pmr")
            .set("Authorization", `Bearer ${doctorToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockReports);
    });

    test("3. GET /api/pmr/:id - Return report if found", async () => {
        const mockReport = { id: "PMR-2026-1000", patientId: "p-2026-1000" };
        getPmrByIdSpy.mockResolvedValue(mockReport);

        const response = await request(app)
            .get("/api/pmr/PMR-2026-1000")
            .set("Authorization", `Bearer ${doctorToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockReport);
    });

    test("4. GET /api/pmr/:id - Return 404 if not found", async () => {
        getPmrByIdSpy.mockResolvedValue(null);

        const response = await request(app)
            .get("/api/pmr/PMR-2026-nonexistent")
            .set("Authorization", `Bearer ${doctorToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("PMR report not found");
    });

    test("5. POST /api/pmr - Save new PMR report successfully", async () => {
        const inputData = { id: "PMR-2026-1000", patientId: "p-2026-1000", notes: "Autopsy report" };
        getPmrByIdSpy
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(inputData);
        createPmrReportSpy.mockResolvedValue("PMR-2026-1000");

        const response = await request(app)
            .post("/api/pmr")
            .set("Authorization", `Bearer ${doctorToken}`)
            .send(inputData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(inputData);
    });
});
