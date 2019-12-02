const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Journey = require('./journeyModel');

const driverSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  hasVehicle: { type: Boolean, required: true },
  licenseType: { type: String, required: true },
  vehicle:  { 
    type: Schema.Types.ObjectId,
    ref: 'Vehicle'
  }

}, {
  timestamps: true
});

driverSchema.methods.loaded = function(status) {
  let driver = this
  console.log(driver)
  Journey.findOne({ driver: driver.id})
  .populate({
    path: 'driver',
    populate: { path: 'vehicle' }
  })
  .then(journeyFromDb => {
    if(journeyFromDb === null){
      return null
    }else{
      return journeyFromDb.driver.vehicle.loaded
    }
  })
  .catch(err => console.log("Error finding journey",err))
} 
const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;