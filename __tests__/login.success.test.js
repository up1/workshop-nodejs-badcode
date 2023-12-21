const request = require('supertest')
const app = require('../app')

test('Success with login with user=User 1', async () => {
    const response = await request(app).post('/auth/login').send({
        name: 'User 1',})
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('accessToken')
})

test('Success with login and access to /hello', async () => {
    // Call POST /auth/login to get accessToken
    const response = await request(app).post('/auth/login').send({
        name: 'User 1',})
    const accessToken = response.body.accessToken
    
    // Call GET /hello with accessToken
    const responseHello = await request(app).get('/hello')
    .set('Authorization', 'Bearer ' + accessToken)
    expect(responseHello.statusCode).toBe(200)
    expect(responseHello.text).toBe('Hello World!')
})