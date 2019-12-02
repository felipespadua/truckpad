const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vehicleTypeSchema = new Schema({
  name: { type: String, required: true },
  code: { type: Number, required: true },
}, {
  timestamps: true
});

const VehicleType = mongoose.model('VehicleType', vehicleTypeSchema);

module.exports = VehicleType;