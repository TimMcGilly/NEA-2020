import express, { ErrorRequestHandler } from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import dotenv from 'dotenv';
import path from 'path';

import { SearchIndividualController } from './controllers/searchController';
import { GetUserController, OnboardController } from './controllers/userController';
import {
  CreateTripController, FindAllTripsController, FindTripByIdController, DeleteTripByIdController,
} from './controllers/tripController';
import { GetActivitesCategoriesController } from './controllers/activityController';

import authConfig from '../auth_config.json';

import * as AuthManager from './authManager';

import { initDb } from './db';
import { ErrorFmt } from './utils/response';

initDb();

dotenv.config();

// Create a new Express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', express.static(path.join(__dirname, '../public/uploads')));

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

app.use(checkJwt.unless({ path: ['/api/avatars/'] }));

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user?: any
    }
  }
}

/**
 * Global express error handler.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).send(ErrorFmt('Internal server error'));
}) as ErrorRequestHandler);

// Define an endpoint that must be called with an access token
app.get('/api/external', (req, res) => {
  res.send({
    msg: req.user.sub,
  });
});

/// Trip Route ///
app.get('/api/trip', ...FindAllTripsController);
app.get('/api/trip/:uuid', ...FindTripByIdController);
app.post('/api/trip', ...CreateTripController);
app.delete('/api/trip/:uuid', ...DeleteTripByIdController);

/// User Route ///
app.get('/api/user', ...GetUserController);
app.post('/api/onboard', ...OnboardController);
/// Activity Route ///
app.get('/api/activites/categories', ...GetActivitesCategoriesController);

/// Search Route ///
app.get('/api/search/individuals', SearchIndividualController);

// Start the app
app.listen(3001, () => console.log('API listening on 3001'));
