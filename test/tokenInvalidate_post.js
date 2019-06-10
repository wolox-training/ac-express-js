const request = require('supertest');
const { factory } = require('factory-girl');

const app = require('../app');
const Purchase = require('../app/models').purchases;
const albums = require('../app/services/albums');

describe('POST /users/sessions/invalidate_all', () => {
  it('test 01 : should be fail log out because token is incorrect', async () => {
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
              .post('/users/sessions/invalidate_all')
              .set('Authorization', '654654654654')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Bad Token/))
          )
      );
  });

  it('test 02 : should be fail log out because token field is empty', async () => {
    const userNew = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: userNew.dataValues.email,
            password: userNew.dataValues.email
          })
          .then(() =>
            request(app)
              .post('/users/sessions/invalidate_all')
              .set('Authorization', ' ')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Authorized/))
          )
      );
  });

  it('test 03 : should be fail log out because token field has less than 22 characters', async () => {
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
              .post('/users/sessions/invalidate_all')
              .set('Authorization', '565')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Bad Token/))
          )
      );
  });

  it('test 04 : should be fail because user logged out before trying to buy another album', async () => {
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
              .post('/albums/1')
              .set('Authorization', response.body.token)
              .send({})
              .then(() =>
                request(app)
                  .post('/users/sessions/invalidate_all')
                  .set('Authorization', response.body.token)
                  .send({})
                  .then(() =>
                    request(app)
                      .post('/albums/2')
                      .set('Authorization', response.body.token)
                      .send({})
                      .expect(400)
                      .then(rep => expect(rep.text).toMatch(/Token is old/))
                  )
              )
          )
      );
  });

  it('test 05 : should be success because user 1 logged out but another user can operate normally', async () => {
    albums.getAlbums = jest
      .fn(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '2', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '2', title: 'abcd' }]);
    const userNew = await factory.build('User').then(user => user);
    const userTwo = await factory.build('User').then(user => user);
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
              .post('/albums/1')
              .set('Authorization', response.body.token)
              .send({})
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
                      .then(res =>
                        request(app)
                          .post('/albums/2')
                          .set('Authorization', res.body.token)
                          .send({})
                          .then(() =>
                            request(app)
                              .post('/users/sessions/invalidate_all')
                              .set('Authorization', res.body.token)
                              .send({})
                              .then(() =>
                                request(app)
                                  .post('/albums/2')
                                  .set('Authorization', response.body.token)
                                  .send({})
                                  .expect(200)
                                  .then(() =>
                                    Purchase.findOne({ where: { albumId: '2' } }).then(resp => {
                                      expect(resp).not.toBeNull();
                                      expect(albums.getAlbums).toHaveBeenCalled();
                                    })
                                  )
                              )
                          )
                      )
                  )
              )
          )
      );
  });
});
