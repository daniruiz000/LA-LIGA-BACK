import express from "express";

import { isAuth } from "../domain/services/auth.middleware";
import { classroomService } from "../domain/services/classroom.service";
import { checkParams } from "../domain/services/checkParams.middleware";

export const classroomRouter = express.Router();

classroomRouter.get("/", checkParams, isAuth, classroomService.getClassrooms);
classroomRouter.get("/:id", isAuth, classroomService.getClassroomById);
classroomRouter.get("/name/:name", isAuth, classroomService.getClassroomByName);
classroomRouter.post("/", isAuth, classroomService.createClassroom);
classroomRouter.delete("/:id", isAuth, classroomService.deleteClassroom);
classroomRouter.put("/:id", isAuth, classroomService.updateClassroom);

/**
 * @swagger
 * tags:
 *   name: Classroom
 *   description: API for managing classrooms
 */

/**
 * @swagger
 * /classroom:
 *   get:
 *     summary: Get all classrooms
 *     tags: [Classroom]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items to return
 *     responses:
 *       200:
 *         description: The list of classrooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Classroom'
 *                   pagination:
 *                     $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Invalid page or limit parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /classroom/{id}:
 *   get:
 *     summary: Get an classroom by ID
 *     tags: [Classroom]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The classroom ID
 *     responses:
 *       200:
 *         description: The classroom info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classroom'
 *       404:
 *         description: Classroom not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /classroom/name/{name}:
 *   get:
 *     summary: Get an classroom by name
 *     tags: [Classroom]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The classroom name
 *     responses:
 *       200:
 *         description: The classroom info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classroom'
 *       404:
 *         description: Classroom not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /classroom:
 *   post:
 *     summary: Create a new classroom
 *     tags: [Classroom]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Classroom'
 *     responses:
 *       201:
 *         description: The classroom was created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classroom'
 */

/**
 * @swagger
 * /classroom/{id}:
 *   delete:
 *     summary: Delete an classroom by ID
 *     tags: [Classroom]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The classroom ID
 *     responses:
 *       200:
 *         description: The classroom was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classroom'
 *       404:
 *         description: The classroom was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /classroom/{id}:
 *   put:
 *     summary: Update an classroom by ID
 *     tags: [Classroom]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The classroom ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Classroom'
 *     responses:
 *       200:
 *         description: The classroom was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classroom'
 *       400:
 *         description: Some parameters are missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: The classroom was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /classroom/login:
 *   post:
 *     summary: Login as an classroom
 *     tags: [Classroom]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classroom'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /classroom/image-upload:
 *   post:
 *     summary: Upload a image for a classroom
 *     tags: [Classroom]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: The file to upload.
 *       - in: formData
 *         name: classroomId
 *         type: string
 *         description: The id of the classroom
 *     responses:
 *       200:
 *         description: The image was uploaded successfully
 *       404:
 *         description: The classroom was not found
 */
