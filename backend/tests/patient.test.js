import request from "supertest";
import app from "../app.js";
import PatientModel from "../models/PatientModel.js";
import jwt from "jsonwebtoken";
import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

process.env.JWT_SECRET_KEY = "test-secret-key-for-jest";

describe("Patient Controller & Routes", () => {
    let getPatientsSpy;
    let createPatientSpy;
    let doctorToken;

    beforeEach(() => {
        getPatientsSpy = jest.spyOn(PatientModel, "getAllPatients");
        createPatientSpy = jest.spyOn(PatientModel, "createPatient");
        doctorToken = jwt.sign(
            { id: "USR-1002", role: "doctor", name: "Dr. Hansara" },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("1. GET /api/patients - Reject unauthorized access", async () => {
        const response = await request(app).get("/api/patients");
        expect(response.status).toBe(401);
    });

    test("2. GET /api/patients - Return all patients when authenticated", async () => {
        const mockPatients = [
            { id: "p-2026-1000", name: "John Doe", sex: "Male", phone: "0771112223" }
        ];
        getPatientsSpy.mockResolvedValue(mockPatients);

        const response = await request(app)
            .get("/api/patients")
            .set("Authorization", `Bearer ${doctorToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPatients);
    });

    test("3. POST /api/patients - Reject unauthorized access", async () => {
        const response = await request(app)
            .post("/api/patients")
            .send({ id: "p-2026-1001", name: "Jane Doe" });
        expect(response.status).toBe(401);
    });

    test("4. POST /api/patients - Reject missing fields", async () => {
        const response = await request(app)
            .post("/api/patients")
            .set("Authorization", `Bearer ${doctorToken}`)
            .send({ name: "Jane Doe" }); // missing other fields

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("All fields are required");
    });

    test("5. POST /api/patients - Register patient successfully", async () => {
        const mockNewPatient = {
            id: "p-2026-1001",
            name: "Jane Doe",
            dob: "1995-05-10",
            sex: "Female",
            address: "123 Main St",
            nic: "951234567V",
            email: "jane@gmail.com",
            phone: "0779998887"
        };
        createPatientSpy.mockResolvedValue(mockNewPatient);

        const response = await request(app)
            .post("/api/patients")
            .set("Authorization", `Bearer ${doctorToken}`)
            .send({
                id: "p-2026-1001",
                name: "Jane Doe",
                dob: "1995-05-10",
                sex: "Female",
                address: "123 Main St",
                nic: "951234567V",
                email: "jane@gmail.com",
                phone: "0779998887",
                profilePictureUrl: null
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockNewPatient);
    });
});
