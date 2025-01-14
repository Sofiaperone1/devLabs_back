import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import express from 'express';
import tasksRouter from '../api/routes/tasks';  // Ajusta esta ruta según tu estructura
import cors from 'cors';

dotenv.config();

// Mock de Auth0
jest.mock('express-openid-connect', () => ({
  auth: () => (req, res, next) => next(),
}));

let mongoServer;
let app;

beforeAll(async () => {
  // Iniciar MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);

  // Crear una nueva instancia de Express para las pruebas
  app = express();
  
  // Configurar CORS y middleware
  app.use(cors());
  app.use(express.json());
  
  // Configurar rutas
  app.use('/tasks', tasksRouter);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Tasks Routes', () => {
  beforeEach(async () => {
    // Limpiar todas las colecciones antes de cada prueba
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  });

  // Prueba para POST /tasks
  it('should create a new task and return the correct data', async () => {
    const taskData = {
      description: 'Test task',
      date: '2025-01-01T12:00:00.000Z',
    };

    const response = await request(app)
      .post('/tasks/createTasks')
      .send(taskData)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('Created');
    expect(response.body.data.description).toBe(taskData.description);
    expect(response.body.data.date).toBe(taskData.date);
  });

  // Prueba para GET /tasks/:id
  it('should retrieve a task by its ID', async () => {
    const taskData = {
      description: 'Sample task',
      date: '2025-01-01T12:00:00.000Z',
    };

    const createdTask = await request(app)
      .post('/tasks/createTasks')
      .send(taskData);

    const taskId = createdTask.body.data._id;

    const response = await request(app)
      .get(`/tasks/getTask/${taskId}`)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.data.description).toBe(taskData.description);
  });

  it('should return 404 if task is not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/tasks/getTask/${nonExistentId}`)
      .expect('Content-Type', /json/);
      
    expect(response.status).toBe(404);
    expect(response.body.status).toBe('Not Found');
  });

  // Prueba para GET /tasks
  it('should retrieve all tasks', async () => {
    const response = await request(app)
      .get('/tasks/getAllTasks')
      .expect('Content-Type', /json/);
      
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Prueba para PUT /tasks/:id
  it('should update a task', async () => {
    const taskData = {
      description: 'Task to update',
      date: '2025-01-01T12:00:00.000Z',
    };

    const createdTask = await request(app)
      .post('/tasks/createTasks')
      .send(taskData);

    const updatedData = {
      description: 'Updated task description',
    };

    const response = await request(app)
      .put(`/tasks/editTasks/${createdTask.body.data._id}`)
      .send(updatedData)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Updated');
    expect(response.body.data.description).toBe(updatedData.description);
  });

  it('should delete a task', async () => {
    const taskData = {
      description: 'Task to delete',
      date: '2025-01-01T12:00:00.000Z',
    };
  
    const createdTask = await request(app)
      .post('/tasks/createTasks')
      .send(taskData);
  
    const response = await request(app)
      .delete(`/tasks/deleteTask/${createdTask.body.data._id}`)
      .expect('Content-Type', /json/);
  
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Deleted');
  });
});