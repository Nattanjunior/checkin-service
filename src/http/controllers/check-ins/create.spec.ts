import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Create Check-In (e2e)', () => {

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'NODE GYM',
        latitude: -9.9500000,
        longitude: -36.4000000
      }
    })


    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -9.9500000,
        longitude: -36.4000000
      })

    expect(response.statusCode).toEqual(201)

  });
});