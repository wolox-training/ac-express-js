const request = require('supertest');
const dictum = require('dictum.js');
const { factory } = require('factory-girl');

const app = require('../app');

describe('GET /users', () => {
  it('test 01 : should be fail get the list of users because token is incorrect', async () => {
    const userNew = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: userNew.dataValues.email,
            password: userNew.dataValues.password
          })
          .then(() =>
            request(app)
              .get('/users?limit=23')
              .set('Authorization', '654654654654')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Bad Token/))
          )
      );
  });

  it('test 02 : should be fail get the list of users because token field is empty', async () => {
    const userNew = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: userNew.dataValues.email,
            password: userNew.dataValues.password
          })
          .then(() =>
            request(app)
              .get('/users?limit=23')
              .set('Authorization', ' ')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Authorized/))
          )
      );
  });

  it('test 02 : should be fail get the list of users because token field has less than 22 characters', async () => {
    const userNew = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: userNew.dataValues.email,
            password: userNew.dataValues.password
          })
          .then(() =>
            request(app)
              .get('/users?limit=23')
              .set('Authorization', '565')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Bad Token/))
          )
      );
  });

  it('test 03 : should be success get the list of users token is correct', async () => {
    const userNew = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: userNew.dataValues.email,
            password: userNew.dataValues.password
          })
          .then(response =>
            request(app)
              .get('/users?limit=23')
              .set('Authorization', response.body.token)
              .send({})
              .expect(200)
              .then(res => expect(res.body).toHaveLength(1))
          )
      );
  });

  it('test 04 : should be success get the list of users because limit is 2 and there is 2 users showed', async () => {
    const userNew = await factory.build('User').then(user => user);
    const userTwo = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users')
          .send(userTwo.dataValues)
          .then(() =>
            request(app)
              .post('/users/sessions')
              .send({
                email: userNew.dataValues.email,
                password: userNew.dataValues.password
              })
              .then(response =>
                request(app)
                  .get('/users?limit=2')
                  .set('Authorization', response.body.token)
                  .send({
                    token: response.body.token
                  })
                  .expect(200)
                  .then(res => {
                    expect(res.body).toHaveLength(2);
                    dictum.chai(res);
                  })
              )
          )
      );
  });

  it('test 05 : should be success because limit is 1 and there is 1 users showed but 2 registered', async () => {
    const userNew = await factory.build('User').then(user => user);
    const userTwo = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users')
          .send(userTwo.dataValues)
          .then(() =>
            request(app)
              .post('/users/sessions')
              .send({
                email: userTwo.dataValues.email,
                password: userTwo.dataValues.password
              })
              .then(response =>
                request(app)
                  .get('/users?limit=1')
                  .set('Authorization', response.body.token)
                  .send({})
                  .expect(200)
                  .then(res => expect(res.body).toHaveLength(1))
              )
          )
      );
  });

  it('test 06 : should be fail get the list of users because limit of pages field is empty', async () => {
    const userNew = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: userNew.dataValues.email,
            password: userNew.dataValues.password
          })
          .then(response =>
            request(app)
              .get('/users')
              .set('Authorization', response.body.token)
              .send({})
              .expect(400)
              .then(res => expect(res.body.message).toMatch(/pagination is empty/))
          )
      );
  });

  it('test 07 : should be fail get the list of users because limit of pages field is 0', async () => {
    const userNew = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: userNew.dataValues.email,
            password: userNew.dataValues.password
          })
          .then(response =>
            request(app)
              .get('/users?limit=0')
              .set('Authorization', response.body.token)
              .send({})
              .expect(400)
              .then(res => expect(res.body.message).toMatch(/can not be 0/))
          )
      );
  });

  it('test 08 : should be fail get the list of users because limit of pages field has no value', async () => {
    const userNew = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: userNew.dataValues.email,
            password: userNew.dataValues.password
          })
          .then(response =>
            request(app)
              .get('/users?limit=')
              .set('Authorization', response.body.token)
              .send({})
              .expect(400)
              .then(res => expect(res.body.message).toMatch(/number of pages/))
          )
      );
  });
});
