import app from './webserver'
import request from 'supertest'

describe('Test the root path', () => {
  it('should respond with 200', (done) => {
    request(app).get('/')
      .then((response) => {
        expect(response.status).toBe(200)
        done()
      })
  })
})
