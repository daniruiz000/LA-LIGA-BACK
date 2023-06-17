import express from "express";

import { isAuth } from "../domain/services/auth.middleware";
import { subjectService } from "../domain/services/subject.service";
import { checkParams } from "../domain/services/checkParams.middleware";

export const subjectRouter = express.Router();

subjectRouter.get("/", checkParams, isAuth, subjectService.getSubjects);
subjectRouter.get("/:id", isAuth, subjectService.getSubjectById);
subjectRouter.post("/", isAuth, subjectService.createSubject);
subjectRouter.delete("/:id", isAuth, subjectService.deleteSubject);
subjectRouter.put("/:id", isAuth, subjectService.updateSubject);

/**
 * @swagger
 * tags:
 *   name: Subject
 *   description: API for managing subjects
 */

/**
 * @swagger
 * /subject:
 *   get:
 *     summary: Get all subjects
 *     tags: [Subject]
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
 *         description: The list of subjects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subject'
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
 * /subject/{id}:
 *   get:
 *     summary: Get an subject by ID
 *     tags: [Subject]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: The subject info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Subject not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /subject/name/{name}:
 *   get:
 *     summary: Get an subject by name
 *     tags: [Subject]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject name
 *     responses:
 *       200:
 *         description: The subject info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Subject not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /subject:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subject]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       201:
 *         description: The subject was created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 */

/**
 * @swagger
 * /subject/{id}:
 *   delete:
 *     summary: Delete an subject by ID
 *     tags: [Subject]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: The subject was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: The subject was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /subject/{id}:
 *   put:
 *     summary: Update an subject by ID
 *     tags: [Subject]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       200:
 *         description: The subject was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Some parameters are missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: The subject was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /subject/login:
 *   post:
 *     summary: Login as an subject
 *     tags: [Subject]
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
 *               $ref: '#/components/schemas/Subject'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /subject/image-upload:
 *   post:
 *     summary: Upload a image for a subject
 *     tags: [Subject]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: The file to upload.
 *       - in: formData
 *         name: subjectId
 *         type: string
 *         description: The id of the subject
 *     responses:
 *       200:
 *         description: The image was uploaded successfully
 *       404:
 *         description: The subject was not found
 */
