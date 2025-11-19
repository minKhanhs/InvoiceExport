require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoute = require('./routes/userRoute.js');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoute);

// Error fallback
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
