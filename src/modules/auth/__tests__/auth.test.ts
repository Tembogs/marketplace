// import request from 'supertest';
// import { Express } from 'express';

// describe('Auth Routes', () => {
//   let app: Express;

//   beforeAll(() => {
//     // Import your Express app here
//     // For example: app = require('../../app').default;
//   });

//   describe('POST /auth/register', () => {
//     it('should register a new user', async () => {
//       const response = await request(app)
//         .post('/auth/register')
//         .send({
//           email: 'test@example.com',
//           password: 'TestPassword123',
//           name: 'Test User'
//         });

//       expect(response.status).toBe(201);
//       expect(response.body).toHaveProperty('user');
//       expect(response.body.user.email).toBe('test@example.com');
//     });

//     it('should return error for invalid email', async () => {
//       const response = await request(app)
//         .post('/auth/register')
//         .send({
//           email: 'invalid-email',
//           password: 'TestPassword123',
//           name: 'Test User'
//         });

//       expect(response.status).toBe(400);
//       expect(response.body).toHaveProperty('error');
//     });
//   });

//   describe('POST /auth/login', () => {
//     it('should login user with correct credentials', async () => {
//       const response = await request(app)
//         .post('/auth/login')
//         .send({
//           email: 'test@example.com',
//           password: 'TestPassword123'
//         });

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('token');
//     });

//     it('should return error for incorrect credentials', async () => {
//       const response = await request(app)
//         .post('/auth/login')
//         .send({
//           email: 'test@example.com',
//           password: 'WrongPassword'
//         });

//       expect(response.status).toBe(401);
//     });
//   });
// });
