const request = require('supertest');
const dictum = require('dictum.js');
const { factory } = require('factory-girl');

const app = require('../app');
const albums = require('../app/services/albums');

const Purchase = require('../app/models').purchases;

describe('GET /users/albums/:id/photos', () => {
  it("test 01 : should be fail list album's photos because token is incorrect", () =>
    request(app)
      .get('/users/albums/1/photos')
      .set('Authorization', '654654654654')
      .send({})
      .expect(400)
      .then(response => expect(response.text).toMatch(/Bad Token/)));

  it("test 02 : should be fail list album's photos because token field is empty", () =>
    request(app)
      .get('/users/albums/1/photos')
      .set('Authorization', ' ')
      .send({})
      .expect(400)
      .then(response => expect(response.text).toMatch(/Authorized/)));

  it("test 03 : should be fail list album's photos because token field has less than 22 characters", () =>
    request(app)
      .get('/users/albums/1/photos')
      .set('Authorization', '565')
      .send({})
      .expect(400)
      .then(response => expect(response.text).toMatch(/Bad Token/)));

  it("test 04 : should be fail list album's photos because user Id is less than 1", async () => {
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
              .get('/users/albums/0/photos')
              .set('Authorization', response.body.token)
              .send({})
              .expect(400)
              .then(res => expect(res.text).toMatch(/between 1 and 100/))
          )
      );
  });

  it("test 05 : should be fail list album's photos because user is not registered", async () => {
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
              .get('/users/albums/1503/photos')
              .set('Authorization', response.body.token)
              .send({})
              .expect(400)
              .then(res => expect(res.text).toMatch(/between 1 and 100/))
          )
      );
  });

  it("test 06 : should be fail list album's photos because regular user did not buy that album", async () => {
    albums.getPictures = jest.fn(() => [
      {
        albumId: 1,
        id: 201,
        title: 'nesciunt dolorum consequatur ullam tempore accusamus debitis sit',
        url: 'https://via.placeholder.com/600/250289',
        thumbnailUrl: 'https://via.placeholder.com/150/250289'
      }
    ]);
    albums.getAlbums = jest.fn(() => [{ userId: '1', id: '1', title: 'abcd' }]);
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
                  .get('/users/albums/10/photos')
                  .set('Authorization', response.body.token)
                  .send({})
                  .expect(400)
                  .then(res => expect(res.text).toMatch(/did not buy/))
              )
          )
      );
  });

  it("test 07 : should be fail list album's photos because admin user did not buy album that regular did", async () => {
    albums.getAlbums = jest
      .fn(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '2', title: 'abcd' }]);
    const userNew = await factory.build('User').then(user => user);
    const userAdmin = await factory.build('User').then(user => user);
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
                  .send(userAdmin.dataValues)
                  .then(() =>
                    request(app)
                      .post('/users/sessions')
                      .send({
                        email: userAdmin.dataValues.email,
                        password: userAdmin.dataValues.password
                      })
                      .then(respo =>
                        request(app)
                          .post('/admin/users')
                          .set('Authorization', respo.body.token)
                          .send(userAdmin.dataValues)
                          .then(() =>
                            request(app)
                              .post('/albums/2')
                              .set('Authorization', respo.body.token)
                              .send({})
                              .then(() =>
                                request(app)
                                  .get('/users/albums/1/photos')
                                  .set('Authorization', respo.body.token)
                                  .send({})
                                  .expect(400)
                                  .then(res => {
                                    expect(albums.getAlbums).toHaveBeenCalled();
                                    expect(res.text).toMatch(/did not buy/);
                                    return Purchase.findAll({ where: { albumId: '1' } }).then(resp =>
                                      expect(resp).toHaveLength(1)
                                    );
                                  })
                              )
                          )
                      )
                  )
              )
          )
      );
  });

  it("test 08 : should be fail list album's photos because album does not have any photos", async () => {
    albums.getAlbums = jest.fn(() => [{ userId: '1', id: '1', title: 'abcd' }]);
    albums.getPictures = jest.fn(() => []);
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
                  .get('/users/albums/1/photos')
                  .set('Authorization', response.body.token)
                  .send({})
                  .expect(200)
                  .then(res => expect(res.text).toMatch(/any photos/))
              )
          )
      );
  });

  it("test 09 : should be success list album's photos because user bought that album", async () => {
    albums.getAlbums = jest.fn(() => [{ userId: '1', id: '1', title: 'abcd' }]);
    albums.getPictures = jest.fn(() => [
      {
        albumId: 1,
        id: 201,
        title: 'nesciunt dolorum consequatur ullam tempore accusamus debitis sit',
        url: 'https://via.placeholder.com/600/250289',
        thumbnailUrl: 'https://via.placeholder.com/150/250289'
      }
    ]);
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
                  .get('/users/albums/1/photos')
                  .set('Authorization', response.body.token)
                  .send({})
                  .expect(200)
                  .then(res => {
                    expect(albums.getAlbums).toHaveBeenCalled();
                    expect(albums.getPictures).toHaveBeenCalled();
                    expect(res.body).toHaveLength(1);
                    return Purchase.findAll({ where: { albumId: '1' } }).then(resp => {
                      expect(resp).toHaveLength(1);
                      dictum.chai(response);
                    });
                  })
              )
          )
      );
  });
});
