import request from 'supertest';
import app from '../../index.js';

describe('POST /api/user/signup', () => {
  describe('when the name and email and password is missing', () => {
    test('should respond with a 400 status code', async () => {
      const bodyData = [
        {},
        { name: 'name' },
        { email: 'email' },
        { password: 'password' },
        { name: 'name', password: 'password' },
        { name: 'name', email: 'email' },
        { email: 'email', password: 'password' },
      ];

      for (const body of bodyData) {
        // eslint-disable-next-line no-await-in-loop
        const response = await request(app).post('/signup').send(body);
        expect(response.statusCode).toBe(400);
      }
    });
  });
});
