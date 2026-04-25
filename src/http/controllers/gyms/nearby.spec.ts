import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user';

describe('Nearby gym (e2e)', () => {

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TS GYM',
        description: 'Some Description.',
        phone: '119999999999999',
        latitude: -27.8610928,
        longitude: -49.640191
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'NODE GYM',
        description: 'Some Description.',
        phone: '119999999999999',
        latitude: -9.9500000,
        longitude: -36.4000000,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -27.8610928,
        longitude: -49.640191
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'TS GYM',
      })]
    );

  });
});