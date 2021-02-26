import express from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import mysql from 'mysql2';

import bodyParser from 'body-parser';

import { Date13YearAgo, DateToYMDString, AddDaysToDate } from '../../shared/Utils/Date';

import authConfig from '../auth_config.json';

import * as AuthManager from './AuthManager';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create a new Express app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  namespace Express {
    export interface Request {
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

    const values = {
      auth0_id: req.user.sub,
      name: req.body.name,
      date_of_birth: req.body.dob,
      bio_description: req.body.bio,
    };

    try {
      pool.query('INSERT INTO user SET ?', values);
      AuthManager.updateAppMetadata(req.user.sub, { onboarded: true });
      return res.sendStatus(201);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  });
// Start the app
app.listen(3001, () => console.log('API listening on 3001'));
