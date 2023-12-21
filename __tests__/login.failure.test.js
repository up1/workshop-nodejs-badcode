const request = require('supertest')
const app = require('../app')

test('Login failure :: User not found', async () => {
    const response = await request(app).post('/auth/login').send({
        name: 'not found',})
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('User not found')
})

test('Failure to access without JWT token', async () => {
    const responseHello = await request(app).get('/hello')
    expect(responseHello.statusCode).toBe(401)
})

test('Failure to access with bad JWT token', async () => {
    const accessToken = "dummy"
    
    // Call GET /hello with accessToken
    const responseHello = await request(app).get('/hello')
    .set('Authorization', 'Bearer ' + accessToken)
    expect(responseHello.statusCode).toBe(403)
})