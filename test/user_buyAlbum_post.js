const request = require('supertest');
const dictum = require('dictum.js');

const app = require('../app');
const albums = require('../app/services/albums');
const Purchase = require('../app/models').purchases;

describe('POST /albums/:id', () => {
  it('test 01 : should be fail buy an album because token is incorrect', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan11@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan11@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(() =>
            request(app)
              .post('/albums/45')
              .set('Authorization', '654654654654')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Bad Token/))
          )
      ));

  it('test 02 : should be fail buy an album because token field is empty', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan123@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan123@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(() =>
            request(app)
              .post('/albums/45')
              .set('Authorization', ' ')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Authorized/))
          )
      ));

  it('test 03 : should be fail buy an album because token field has less than 22 characters', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan1asdasd23@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan1asdasd23@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(() =>
            request(app)
              .post('/albums/23')
              .set('Authorization', '565')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Bad Token/))
          )
      ));

  it('test 04 : should be fail buy an album because album Id is less than 1', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan1asdasd23@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan1asdasd23@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(response =>
            request(app)
              .post('/albums/0')
              .set('Authorization', response.body.token)
              .send({})
              .expect(400)
              .then(res => expect(res.text).toMatch(/between 1 and 100/))
          )
      ));

  it('test 05 : should be fail buy an album because album Id is greater than 100', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan1asdasd23@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan1asdasd23@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(response =>
            request(app)
              .post('/albums/667')
              .set('Authorization', response.body.token)
              .send({})
              .expect(400)
              .then(res => expect(res.text).toMatch(/between 1 and 100/))
          )
      ));

  it('test 06 : should be success because user could buy the album and it is unique', () => {
    albums.getAlbums = jest.fn(() => [{ userId: '1', id: '1', title: 'abcd' }]);
    return request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan124@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan124@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(response =>
            request(app)
              .post('/albums/1')
              .set('Authorization', response.body.token)
              .send({})
              .expect(200)
              .then(resp =>
                Purchase.findOne({ where: { albumId: '1' } }).then(res => {
                  expect(res).not.toBeNull();
                  expect(albums.getAlbums).toHaveBeenCalled();
                  dictum.chai(resp);
                })
              )
          )
      );
  });

  it('test 07 : should be fail because user tried to buy twice the same album and it has to be unique', () => {
    albums.getAlbums = jest.fn(() => [{ userId: '1', id: '1', title: 'abcd' }]);
    return request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan124@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan124@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(response =>
            request(app)
              .post('/albums/1')
              .set('Authorization', response.body.token)
              .send({})
              .then(() =>
                request(app)
                  .post('/albums/1')
                  .set('Authorization', response.body.token)
                  .send({})
                  .expect(400)
                  .then(resp => {
                    expect(resp.text).toMatch(/twice/);
                    return Purchase.findAll({ where: { albumId: '1' } }).then(res => {
                      expect(albums.getAlbums).toHaveBeenCalled();
                      expect(res).toHaveLength(1);
                    });
                  })
              )
          )
      );
  });

  it('test 08 : should be success because user bought two different albums.', () => {
    albums.getAlbums = jest
      .fn(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '2', title: 'abcd' }]);
    return request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan124@wolox.com.ar',
        password: '1234asdf85asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan124@wolox.com.ar',
            password: '1234asdf85asd'
          })
          .then(response =>
            request(app)
              .post('/albums/1')
              .set('Authorization', response.body.token)
              .send({})
              .then(() =>
                request(app)
                  .post('/albums/2')
                  .set('Authorization', response.body.token)
                  .send({})
                  .expect(200)
                  .then(() =>
                    Purchase.findAll().then(res => {
                      expect(albums.getAlbums.mock.calls).toHaveLength(2);
                      expect(res).toHaveLength(2);
                    })
                  )
              )
          )
      );
  });
});
