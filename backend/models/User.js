const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//#region Hook Pre-Save (CORREGIDO)
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  // Generar salt y hashear de forma asíncrona
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // NO LLAMES A next(), al ser async Mongoose sabe cuándo termina.
});
//#endregion

module.exports = mongoose.model('User', userSchema);