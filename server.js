const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT Exception, shutting down....');
  console.log('1.', err.name, '\n2.', err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('1.', err.name, '\n2.', err.message);
  console.log('UNHANDLED Rejection, shutting down....');
  server.close(() => {
    process.exit(1);
  });
});
