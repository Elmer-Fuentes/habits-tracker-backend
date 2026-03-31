const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.log('❌ Error conectando a MongoDB:', err));

module.exports = mongoose;