const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.log('❌ Error MongoDB:', err.message));

app.use('/api/auth', require('./routes/users'));
app.use('/api/habits', require('./routes/habits'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));

module.exports = app;