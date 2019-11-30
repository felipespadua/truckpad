const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const driverSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: Number, required: true },
  hasVehicle: { type: Boolean, required: true },
  licenseType: { type: Number, required: true },
  loaded: { type: Boolean, required: true},
  vehicleType: { 
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  }

}, {
  timestamps: true
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;