import express from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import dotenv from 'dotenv';
import authConfig from '../auth_config.json';

dotenv.config();
// Create a new Express app
const app = express();

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

app.use(checkJwt);

// Define an endpoint that must be called with an access token
app.get('/api/external', (req: any, res) => {
  res.send({
    msg: req.user,
  });
});

// Start the app
app.listen(3001, () => console.log('API listening on 3001'));
