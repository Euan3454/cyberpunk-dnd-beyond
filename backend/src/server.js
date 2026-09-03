require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on ${port}`);
    });
  })
  .catch((error) => {
    console.error('DB connection failed:', error);
    process.exit(1);
  });
