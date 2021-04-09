import express from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';

import { CreateTripController, FindAllTripsController } from './controllers/tripController';
import { Date13YearAgo, DateToYMDString, AddDaysToDate } from '../../shared/Utils/Date';

import authConfig from '../auth_config.json';

import * as AuthManager from './authManager';

import { initDb, getDb } from './db';

initDb();

dotenv.config();

// Create a new Express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define middleware that validates incoming bearer tokens
// using JWKS from dev-eh5-3nx1.eu.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256'],
});

AuthManager.init();

app.use(checkJwt);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user?: any
    }
  }
}

// Define an endpoint that must be called with an access token
app.get('/api/external', (req, res) => {
  res.send({
    msg: req.user.sub,
  });
});

app.post('/api/onboard',
  body('name', 'Empty name').trim().isLength({ min: 1 }).escape(),
  body('dob', 'Invalid age or under 13').isISO8601().toDate().isBefore(DateToYMDString(AddDaysToDate(Date13YearAgo(), 1))),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const values = [
      req.user.sub,
      req.body.name,
      req.body.dob,
      req.body.bio,
    ];

    let conn = null;
    try {
      conn = await getDb().getConnection();
      await conn.beginTransaction();

      // Inserts new user
      await getDb().execute('INSERT INTO user(auth0_id, name, date_of_birth, bio_description) VALUES (?,?,?,?)', values);

      // Updates auth0 onboarded metabads
      AuthManager.updateAppMetadata(req.user.sub, { onboarded: true });
      await conn.commit();
      conn.release();

      return res.sendStatus(201);
    } catch (e) {
      // If db error and conn still exists rollback and release
      if (conn) {
        await conn.rollback();
        conn.release();
      }
      console.log(e);
      return res.sendStatus(500);
    }
  });

/// Trip Route ///
app.get('/api/trip', ...FindAllTripsController);
app.post('/api/trip', ...CreateTripController);

// Start the app
app.listen(3001, () => console.log('API listening on 3001'));
