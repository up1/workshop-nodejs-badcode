const app = require('./app');
const pino = require('pino');
require('dotenv').config();

const port = process.env.PORT || 3000;
const logger = pino();

app.listen(port, () => {
  logger.info(`app listening on port ${port}`);
});
