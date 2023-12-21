const request = require('supertest')
const app = require('../app')

test('Login failure :: User not found', async () => {
    const response = await request(app).post('/auth/login').send({
        name: 'not found',})
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('User not found')
})