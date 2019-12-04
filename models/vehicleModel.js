const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vehicleSchema = new Schema({
  plate: { type: String, required: true},
  loaded: { type: Boolean, default: false},
  vehicleType: { 
    type: Schema.Types.ObjectId,
    ref: 'VehicleType',
    required: true
  }
}, {
  timestamps: true
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;