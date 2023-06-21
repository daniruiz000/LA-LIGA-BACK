import { mongoConnect } from "../src/domain/repositories/mongo-repository";
import mongoose from "mongoose";
import { appInstance } from "../src/index";
import request from "supertest";
import { app } from "../src/server";
import { type IUserCreate, User, ROL } from "../src/domain/entities/user-entity";

describe("User controller", () => {
  const playerMock: IUserCreate = {
    email: "admin@gmail.com",
    password: "55555555",
    firstName: "Antonio",
    rol: ROL.PLAYER,
    lastName: "Alcaráz",
    team: "string",
    image: "string",
  };

  let token: string;
  let playerId: string;

  beforeAll(async () => {
    await mongoConnect();
    await User.collection.drop();
    console.log("Eliminados todos los usuarios");
  });

  afterAll(async () => {
    await mongoose.connection.close();
    appInstance.close();
  });

  it("Simple test to check jest in working", () => {
    expect(true).toBeTruthy();
  });

  it("Simple test to check jest in working", () => {
    const miTexto = "Hola chicos";
    expect(miTexto.length).toBe(11);
  });

  it("POST /player - this should create an player", async () => {
    const response = await request(app).post("/player").send(playerMock).expect(201);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.email).toBe(playerMock.email);

    playerId = response.body._id;
  });

  it("POST /player/login - with valid credentials returns 200 and token", async () => {
    const credentials = {
      email: playerMock.email,
      password: playerMock.password,
    };

    const response = await request(app).post("/player/login").send(credentials).expect(200);

    expect(response.body).toHaveProperty("token");
    token = response.body.token;
  });

  it("POST /player/login - with worng credentials returns 401 and no token", async () => {
    const credentials = {
      email: playerMock.email,
      password: "BAD PASSWORD",
    };

    const response = await request(app).post("/player/login").send(credentials).expect(401);

    expect(response.body.token).toBeUndefined();
  });

  it("GET /player - returns a list with the players", async () => {
    const response = await request(app).get("/player").expect(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].email).toBe(playerMock.email);
    expect(response.body.totalItems).toBe(1);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.currentPage).toBe(1);
  });

  it("PUT /player/id - Modify player when token is sent", async () => {
    const updatedData = {
      name: "JOSEITO",
    };

    const response = await request(app).put(`/player/${playerId}`).set("Userization", `Bearer ${token}`).send(updatedData).expect(200);

    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.email).toBe(playerMock.email);
    expect(response.body._id).toBe(playerId);
  });

  it("PUT /player/id - Should not modify player when no token present", async () => {
    const updatedData = {
      name: "JOSEITO",
      email: "jose@mail.com"
    };

    const response = await request(app).put(`/player/${playerId}`).send(updatedData).expect(401);
    expect(response.body.error).toBe("No tienes autorización para realizar esta operación");
  });

  it("DELETE /player/id -  Do not delete player whe no token is present", async () => {
    const response = await request(app).delete(`/player/${playerId}`).expect(401);

    expect(response.body.error).toBe("No tienes autorización para realizar esta operación");
  });

  it("DELETE /player/id -  Deletes player when token is OK", async () => {
    const response = await request(app).delete(`/player/${playerId}`).set("Userization", `Bearer ${token}`).expect(200);

    expect(response.body._id).toBe(playerId);
  });
});
