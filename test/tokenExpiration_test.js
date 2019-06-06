const request = require('supertest');
const dictum = require('dictum.js');

const app = require('../app');

describe('/users/sessions POST', () => {
  it("test 01 : should be success because the token's expiration time is ok", () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juanrepeatedasdasd@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juanrepeatedasdasd@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .expect(200)
          .then(response => {
            expect(response.body.timeExpiration).toBe(320);
          })
      ));

  it('test 02 : should be fail get the list of users because token has expired', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'noadmin',
        lastName: 'Perez',
        email: 'noaqweaasfsdfsdsadaasaadmain@wolox.com.ar',
        password: '12404asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'noaqweaasfsdfsdsadaasaadmain@wolox.com.ar',
            password: '12404asdf65asd'
          })
          .then(() =>
            request(app)
              .get('/users?limit=23')
              .set(
                'Authorization',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJub2Fxd2VhYXNmc2Rmc2RzYWRhYXNhYWRtYWluQHd' +
                  'vbG94LmNvbS5hciIsInBhc3N3b3JkIjoiJDJiJDEwJGNIVElQYmhGUTdIZl' +
                  'pjQlJqRnpBUi5iS1VLYTFWZFg1Llg0aGU4QmZUa29FdVV3NDNuQ0txIiwiZmly' +
                  'c3ROYW1lIjoibm9hZG1pbiIsImxhc3ROYW1lIjoiUGVyZXoiLCJoYXNoIjoiYmhoQ' +
                  '3dRQndoU2lOb1hUMmt4V2EiLCJpYXQiOjE1NTk4MzcxNzUsImV4cCI6MTU1OTgzNzE3NX0.' +
                  'uzavQbLkO1DfTMgW0osDaJP2leuPQrihnQmQz4FgyZ4'
              )
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/log in/))
          )
      ));

  it('test 03 : should be success get the list of users because token has not expired yet', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'noadmin',
        lastName: 'Perez',
        email: 'noaqweaasfsdfsdsadaasaadmain@wolox.com.ar',
        password: '12404asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'noaqweaasfsdfsdsadaasaadmain@wolox.com.ar',
            password: '12404asdf65asd'
          })
          .then(response =>
            request(app)
              .get('/users?limit=23')
              .set('Authorization', response.body.token)
              .send({})
              .expect(200)
              .then(res => expect(res.body).toHaveLength(1))
          )
      ));

  it('test 04 : should be success because token has expired but user log in again with a longer exp time', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'noadmin',
        lastName: 'Perez',
        email: 'noaqweaasfsdfsdsadaasaadmain@wolox.com.ar',
        password: '12404asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'noaqweaasfsdfsdsadaasaadmain@wolox.com.ar',
            password: '12404asdf65asd'
          })
          .then(() =>
            request(app)
              .get('/users?limit=23')
              .set(
                'Authorization',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJub2Fxd2VhYXNmc2Rmc2RzYWRhYXNhYWRtYWluQHd' +
                  'vbG94LmNvbS5hciIsInBhc3N3b3JkIjoiJDJiJDEwJGNIVElQYmhGUTdIZl' +
                  'pjQlJqRnpBUi5iS1VLYTFWZFg1Llg0aGU4QmZUa29FdVV3NDNuQ0txIiwiZmly' +
                  'c3ROYW1lIjoibm9hZG1pbiIsImxhc3ROYW1lIjoiUGVyZXoiLCJoYXNoIjoiYmhoQ' +
                  '3dRQndoU2lOb1hUMmt4V2EiLCJpYXQiOjE1NTk4MzcxNzUsImV4cCI6MTU1OTgzNzE3NX0.' +
                  'uzavQbLkO1DfTMgW0osDaJP2leuPQrihnQmQz4FgyZ4'
              )
              .send({})
              .then(() =>
                request(app)
                  .post('/users/sessions')
                  .send({
                    email: 'noaqweaasfsdfsdsadaasaadmain@wolox.com.ar',
                    password: '12404asdf65asd'
                  })
                  .then(response =>
                    request(app)
                      .get('/users?limit=23')
                      .set('Authorization', response.body.token)
                      .send({})
                      .expect(200)
                      .then(res => {
                        expect(res.body).toHaveLength(1);
                        dictum.chai(res);
                      })
                  )
              )
          )
      ));

  it('test 04 : should be fail because token belongs to a non registered user', () =>
    request(app)
      .get('/users?limit=23')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          'eyJpZCI6MiwiZW1haWwiOiJub2Fxd2VhYXNmc2Rmc2' +
          'RzYWRhYXNhYWRtYWluQHdvbG94LmNvbS5hciIsInBhc' +
          '3N3b3JkIjoiJDJiJDEwJHJnWVhPT0tmYnZicWp1MEF2UV' +
          'lOd2VnQmtta1V5Mmx0dGNVSnJIN3I5REJ0VVQ4SjFJV2JH' +
          'IiwiZmlyc3ROYW1lIjoibm9hZG1pbiIsImxhc3ROYW1lIjoi' +
          'UGVyZXoiLCJoYXNoIjoicDVTVzFjandUbn' +
          'RaZGlwUjVhTnQiLCJpYXQiOjE1NTk4MzkyMTF9.AjQstdfhnoIvQ7B4quS_tPwVawZho6pYVI3N9BvGqPo'
      )
      .send({})
      .expect(400)
      .then(response => expect(response.text).toMatch(/is not registered/)));
});
