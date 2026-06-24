import request from "supertest";
import app from "../app.js";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jest, describe, test, expect, beforeAll, beforeEach, afterEach } from "@jest/globals";

// Set environment variables for testing
process.env.JWT_SECRET_KEY = "test-secret-key-for-jest";

describe("Auth Controller & Routes", () => {
    let hashedPassword;
    let getUserByEmailSpy;
    let createUserSpy;
    let getAllUsersSpy;

    beforeAll(async () => {
        // Create a real hash for the test password
        hashedPassword = await bcrypt.hash("password123", 10);
    });

    beforeEach(() => {
        // Spy on static methods to mock database operations dynamically in ES Modules
        getUserByEmailSpy = jest.spyOn(UserModel, "getUserByEmail");
        createUserSpy = jest.spyOn(UserModel, "createUser");
        getAllUsersSpy = jest.spyOn(UserModel, "getAllUsers");
    });

    afterEach(() => {
        // Restore original methods after each test to prevent test cross-contamination
        jest.restoreAllMocks();
    });

    describe("POST /api/auth/login", () => {
        test("1. Should login successfully with correct credentials", async () => {
            const mockUser = {
                id: "USR-1000",
                name: "Dr. Perera",
                role: "admin",
                designation: "Consultant",
                email: "dr.perera@forensic.gov",
                password_hash: hashedPassword,
                profile_picture_url: null
            };

            getUserByEmailSpy.mockResolvedValue(mockUser);

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "dr.perera@forensic.gov",
                    password: "password123"
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
            expect(response.body.user).toEqual({
                id: "USR-1000",
                name: "Dr. Perera",
                role: "admin",
                designation: "Consultant",
                email: "dr.perera@forensic.gov",
                profilePictureUrl: null
            });
            expect(getUserByEmailSpy).toHaveBeenCalledWith("dr.perera@forensic.gov");
        });

        test("2. Should fail to login with incorrect password", async () => {
            const mockUser = {
                id: "USR-1000",
                email: "dr.perera@forensic.gov",
                password_hash: hashedPassword
            };

            getUserByEmailSpy.mockResolvedValue(mockUser);

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "dr.perera@forensic.gov",
                    password: "wrongpassword"
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Invalid email or password");
        });

        test("3. Should fail to login if user is not found in database", async () => {
            // Mock returning undefined (no user found)
            getUserByEmailSpy.mockResolvedValue(undefined);

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "nonexistent@forensic.gov",
                    password: "password123"
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Invalid email or password");
        });

        test("4. Should fail to login when email or password is missing", async () => {
            getUserByEmailSpy.mockResolvedValue(undefined);

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: ""
                    // password omitted
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Invalid email or password");
        });
    });

    describe("POST /api/auth/register", () => {
        test("5. Should reject registration request without authentication", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    id: "USR-1001",
                    email: "new.user@forensic.gov",
                    password: "password123"
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Access denied. No token provided.");
        });

        test("6. Should allow admin to register a new user successfully", async () => {
            const mockNewUser = {
                id: "USR-1001",
                name: "Dr. Perera II",
                role: "doctor",
                email: "dr.perera2@forensic.gov",
                phone: "0771234567",
                designation: "Medical Officer",
                profile_picture_url: null
            };

            // Setup mock spies
            getUserByEmailSpy.mockResolvedValue(undefined); // user doesn't exist yet
            createUserSpy.mockResolvedValue(mockNewUser);

            const adminToken = jwt.sign(
                { id: "USR-1000", role: "admin", name: "Dr. Perera" },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" }
            );

            const response = await request(app)
                .post("/api/auth/register")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    id: "USR-1001",
                    name: "Dr. Perera II",
                    role: "doctor",
                    designation: "Medical Officer",
                    email: "dr.perera2@forensic.gov",
                    phone: "0771234567",
                    password: "password123",
                    profilePictureUrl: null
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockNewUser);
            expect(getUserByEmailSpy).toHaveBeenCalledWith("dr.perera2@forensic.gov");
            expect(createUserSpy).toHaveBeenCalled();
        });

        test("7. Should reject registration if email already exists", async () => {
            const mockExistingUser = {
                id: "USR-1000",
                email: "dr.perera@forensic.gov"
            };

            getUserByEmailSpy.mockResolvedValue(mockExistingUser);

            const adminToken = jwt.sign(
                { id: "USR-1000", role: "admin", name: "Dr. Perera" },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" }
            );

            const response = await request(app)
                .post("/api/auth/register")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    id: "USR-1001",
                    name: "Dr. Perera II",
                    role: "doctor",
                    designation: "Medical Officer",
                    email: "dr.perera@forensic.gov",
                    phone: "0771234567",
                    password: "password123",
                    profilePictureUrl: null
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("User already exists");
        });

        test("8. Should reject registration if authenticated user is not admin", async () => {
            const doctorToken = jwt.sign(
                { id: "USR-1002", role: "doctor", name: "Dr. Hansara" },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" }
            );

            const response = await request(app)
                .post("/api/auth/register")
                .set("Authorization", `Bearer ${doctorToken}`)
                .send({
                    id: "USR-1003",
                    email: "new.doctor@forensic.gov",
                    password: "password123"
                });

            expect(response.status).toBe(403);
            expect(response.body.message).toBe("Access denied. Admins only.");
        });
    });

    describe("GET /api/auth/users", () => {
        test("9. Should reject fetching users without token", async () => {
            const response = await request(app)
                .get("/api/auth/users");

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Access denied. No token provided.");
        });

        test("10. Should return all users when authenticated as admin", async () => {
            const mockUsers = [
                { id: "USR-1000", name: "Dr. Perera", role: "admin", email: "dr.perera@forensic.gov", password_hash: "secret" },
                { id: "USR-1002", name: "Dr. Hansara", role: "doctor", email: "dr.hansara@forensic.gov", password_hash: "secret" }
            ];

            getAllUsersSpy.mockResolvedValue(mockUsers);

            // Generate a valid admin token
            const adminToken = jwt.sign(
                { id: "USR-1000", role: "admin", name: "Dr. Perera" },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" }
            );

            const response = await request(app)
                .get("/api/auth/users")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
            // Verify password hashes are stripped out
            expect(response.body[0]).not.toHaveProperty("password_hash");
            expect(response.body[0].email).toBe("dr.perera@forensic.gov");
        });
    });
});
