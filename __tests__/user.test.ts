import mongoose from "mongoose"
import { mongoConnect } from "../src/domain/repositories/mongo-repository"
import { app } from "../src/server/index"
import { appInstance } from "../src/index"
import { IUserCreate, ROL } from "../src/domain/entities/user-entity"
import request from "supertest"
import { userOdm } from "../src/domain/odm/user.odm"
// Tenemos que tener una BBDD especifica de test.

describe("User Controler", () => {
  const playerMoc: IUserCreate = {
    email: "adrian.rojas@example.com",
    password: "testin23g123",
    firstName: "Adrian",
    lastName: "Rojas",
    rol: ROL.PLAYER,
  }

  const managerMoc: IUserCreate = {
    email: "toni@gmail.com",
    password: "55555555",
    firstName: "Toni",
    lastName: "Moreno",
    rol: ROL.MANAGER,
  }

  const adminMoc: IUserCreate = {
    email: "admin@gmail.com",
    password: "55555555",
    firstName: "Antonio",
    lastName: "Alcaráz",
    rol: ROL.ADMIN,
  }

  // const teacherMoc: IUserCreate = {
  //   email: "antonia@gmail.com",
  //   password: "123456789",
  //   firstName: "Antonia",
  //   lastName: "Higaldo",
  //   rol: ROL.TEACHER,
  // }

  let playerToken: string
  let managerToken: string
  let adminToken: string
  // let teacherToken: string

  let createdUserId: string

  // Antes de hacer los tests:
  beforeAll(async () => {
    await mongoConnect() // Conecto a mongo pero a la BBDD de test mediante la biblioteca cross-env que nos permite modificar la variable de entorno del nombre de la BBDD desde el script de test.
    await userOdm.deleteAllUsers() // Borramos los usuarios de la BBDD
    await userOdm.createUser(adminMoc)
    // await userOdm.createUser(teacherMoc)
    await userOdm.createUser(playerMoc)
    await userOdm.createUser(managerMoc)
  });
  // Cuando acaben los test:
  afterAll(async () => {
    await mongoose.connection.close() // Cerramos la conexión a mongo.
    appInstance.close()
  });

  it("POST /user/login", async () => {
    // WRONG login
    const wrongCredentials = { email: "noexistingemail", password: "123" }
    const wrongResponse = await request(app)
      .post("/user/login")
      .send(wrongCredentials)
      .expect(401)
    expect(wrongResponse.body.token).toBeUndefined()

    // PLAYER login
    const playerCredentials = {
      email: playerMoc.email,
      password: playerMoc.password
    }
    const playerResponse = await request(app)
      .post("/user/login")
      .send(playerCredentials)
      .expect(200)

    expect(playerResponse.body).toHaveProperty("token")
    playerToken = playerResponse.body.token
    console.log(playerToken)

    // MANAGER  login
    const managerCredentials = {
      email: managerMoc.email,
      password: managerMoc.password
    }
    const managerResponse = await request(app)
      .post("/user/login")
      .send(managerCredentials)
      .expect(200)

    expect(managerResponse.body).toHaveProperty("token")
    managerToken = managerResponse.body.token
    console.log(managerToken)

    // // TEACHER  login
    // const teacherCredentials = {
    //   email: teacherMoc.email,
    //   password: teacherMoc.password
    // }
    // const teacherResponse = await request(app)
    //   .post("/user/login")
    //   .send(teacherCredentials)
    //   .expect(200)

    // expect(teacherResponse.body).toHaveProperty("token")
    // teacherToken = teacherResponse.body.token
    // console.log(teacherToken)

    // ADMIN  login
    const adminCredentials = {
      email: adminMoc.email,
      password: adminMoc.password
    }
    const adminResponse = await request(app)
      .post("/user/login")
      .send(adminCredentials)
      .expect(200)

    expect(adminResponse.body).toHaveProperty("token")
    adminToken = adminResponse.body.token
    console.log(adminToken)
  })

  it("POST /user", async() => {
    // CREATED USER WITH USER NOT LOGGED -> 401 NO CREATED
    const response = await request(app)
      .post("/user")
      .send(playerMoc)
      .expect(201)

    // // CREATED USER WITH USERLOGGED WITH TEACHER -> 401 NO CREATED
    // await request(app)
    //   .post("/user")
    //   .set("Authorization", `Bearer ${teacherToken}`)
    //   .send(userToCreate)
    //   .expect(401)

    // CREATED USER WITH USER LOGGED WITH ADMIN -> 201 CREATED
    // const response = await request(app)
    //   .post("/user")
    //   .set("Authorization", `Bearer ${adminToken}`)
    //   .send(userToCreate)
    //   .expect(201)

    expect(response.body).toHaveProperty("_id")
    expect(response.body.email).toBe(playerMoc.email)
    createdUserId = response.body._id
  })
  it("GET /user/ returns all users", async () => {
    // Not logged -> 401
    await request(app)
      .get("/user")
      .expect(401)

    // // TEACHER -> 200
    // const teacherResponse = await request(app)
    //   .get("/user")
    //   .set("Authorization", `Bearer ${teacherToken}`)
    //   .expect(200)
    // expect(teacherResponse.body.data?.length).toBeDefined()

    // ADMIN -> 200
    const adminResponse = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200)
    expect(adminResponse.body.data?.length).toBeDefined()
  })

  it("GET /user/id returns user by id", async () => {
    // NOT LOGED -> 401
    await request(app)
      .get(`/user/${createdUserId}`)
      .expect(401)

    // // TEACHER -> 200
    // const teacherResponse = await request(app)
    //   .get(`/user/${createdUserId}`)
    //   .set("Authorization", `Bearer ${teacherToken}`)
    //   .expect(200)
    // expect(teacherResponse.body.firstName).toBeDefined()

    // ADMIN -> 200
    const adminResponse = await request(app)
      .get(`/user/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200)
    expect(adminResponse.body.firstName).toBeDefined()
  })
  it("PUT /user/id modify user by id", async () => {
    const updatedData = { firstName: "Update name" }
    // NOT LOGED -> 401
    await request(app)
      .put(`/user/${createdUserId}`)
      .send(updatedData)
      .expect(401)

    // // TEACHER -> 401
    // await request(app)
    //   .put(`/user/${createdUserId}`)
    //   .send(updatedData)
    //   .set("Authorization", `Bearer ${teacherToken}`)
    //   .expect(401)

    // ADMIN -> 200
    const adminResponse = await request(app)
      .put(`/user/${createdUserId}`)
      .send(updatedData)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200)
    expect(adminResponse.body.firstName).toBe(updatedData.firstName)
  })

  it("DELET /user/id delete user by id", async () => {
    // NOT LOGED -> 401
    await request(app)
      .delete(`/user/${createdUserId}`)
      .expect(401)

    // // TEACHER -> 401
    // await request(app)
    //   .delete(`/user/${createdUserId}`)
    //   .set("Authorization", `Bearer ${teacherToken}`)
    //   .expect(401)

    // ADMIN -> 200
    const adminResponse = await request(app)
      .delete(`/user/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200)
    expect(adminResponse.body._id).toBe(createdUserId)
  })
})
