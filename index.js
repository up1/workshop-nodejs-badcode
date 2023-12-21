const express = require('express');
const jwt = require('jsonwebtoken');
const pino = require('pino');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const users = [
  { id: 1, name: 'User 1', refresh: null },
  { id: 2, name: 'User 2', refresh: null },
  { id: 3, name: 'User 3', refresh: null },
];

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const jwtGenerate = (user) => {
  const accessToken = jwt.sign(
    { name: user.name, id: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '3m', algorithm: 'HS256' },
  );

  return accessToken;
};

const jwtRefreshTokenGenerate = (user) => {
  const refreshToken = jwt.sign(
    { name: user.name, id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d', algorithm: 'HS256' },
  );

  return refreshToken;
};

app.post('/auth/login', (req, res) => {
  const { name } = req.body;

  const user = users.findIndex((e) => e.name === name);

  if (!name || user < 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  const accessToken = jwtGenerate(users[user]);
  const refreshToken = jwtRefreshTokenGenerate(users[user]);

  users[user].refresh = accessToken;

  res.json({
    accessToken,
    refreshToken,
  });
});

const jwtValidate = async (req, res, next) => {
  try {
    if (!req.headers.authorization) return res.sendStatus(401);

    const token = req.headers.authorization.replace('Bearer ', '');

    await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

app.get('/hello', jwtValidate, (req, res) => {
  res.send('Hello World!');
});

const logger = pino();

app.listen(port, () => {
  logger.info(`app listening on port ${port}`);
});
