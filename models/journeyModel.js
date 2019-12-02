const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Driver = require('./driverModel');


const journeySchema = new Schema({
  origin: {
    location: {
      type: {
        type: String,
        enum: ['Point'],
        require: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  destination: {
    location: {
      type: {
        type: String,
        enum: ['Point'],
        require: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  driver : { 
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  status: {
    type: String,
    enum: ["GOING_TO_DESTINATION","RETURNING_TO_ORIGIN", "ARRIVED_ON_DESTINATION","JOURNEY_CONCLUDED"]
  }
}, {
  timestamps: true
});


journeySchema.index({ location: '2dsphere' });
const Journey = mongoose.model('Journey', journeySchema);

module.exports = Journey;