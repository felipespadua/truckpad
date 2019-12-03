require('dotenv').config();

const mongoose = require('mongoose');
const Driver = require('./models/driverModel');
const Journey = require('./models/journeyModel');
const Vehicle = require('./models/vehicleModel');
const VehicleType = require('./models/vehicleTypeModel');


let vehicleTypes = [
  {
    name: "Caminhão 3/4",
    code: 1
  },
  {
    name: "Caminhão Toco",
    code: 2
  },
  {
    name: "Caminhão Truck",
    code: 3
  },
  {
    name: "Carreta Simples",
    code: 4
  },
  {
    name: "Carreta Eixo Extendido",
    code: 5
  }
]

let vehicles = [
  {
    plate: "FIK2671",
    loaded: true
  },
  {
    plate: "GDE2149",
    loaded: false
  },
  {
    plate: "OPE9032",
    loaded: false
  },
  {
    plate: "HPO2134",
    loaded: true
  },
  {
    plate: "JEK9083",
    loaded: true
  }
]

let drivers = [
  {
    name: "José da Silva",
    age: 29,
    gender: "M",
    hasVehicle: true,
    licenseType: "C"
  },
  {
    name: "Francisco Soares",
    age: 44,
    gender: "M",
    hasVehicle: true,
    licenseType: "C"
  },
  {
    name: "Maria de Jesus",
    age: 52,
    gender: "F",
    hasVehicle: true,
    licenseType: "C"
  },
  {
    name: "João Matarazzo",
    age: 34,
    gender: "M",
    hasVehicle: true,
    licenseType: "C"
  },
  {
    name: "Fernanda Souza",
    age: 49,
    gender: "F",
    hasVehicle: true,
    licenseType: "C"
  },
  {
    name: "Francielle Martins",
    age: 31,
    gender: "F",
    hasVehicle: false,
    licenseType: "C"
  },
]

let journeys = [
  {
    origin: {
      location: {
        type: 'Point',
        coordinates: [-46.5534166, -23.5346071],
      },
    },
    destination: {
      location: {
        type: 'Point',
        coordinates: [-46.5523411, -21.5346071],
      },
    },
    status: "GOING_TO_DESTINATION"
  },
  {
    origin: {
      location: {
        type: 'Point',
        coordinates: [-45.5534166, -23.5346071],
      },
    },
    destination: {
      location: {
        type: 'Point',
        coordinates: [-46.5523411, -21.5346071],
      },
    },
    status: "RETURNING_TO_ORIGIN"
  },
  {
    origin: {
      location: {
        type: 'Point',
        coordinates: [-44.5523411, -21.5346071],
      },
    },
    destination: {
      location: {
        type: 'Point',
        coordinates: [-46.5534166, -23.5346071],
      },
    },
    status: "ARRIVED_ON_DESTINATION"
  },
  {
    origin: {
      location: {
        type: 'Point',
        coordinates: [-43.5534166, -23.5346071],
      },
    },
    destination: {
      location: {
        type: 'Point',
        coordinates: [-46.5534166, -23.5346071],
      },
    },
    status: "JOURNEY_CONCLUDED"
  },
  {
    origin: {
      location: {
        type: 'Point',
        coordinates: [-42.5534166, -23.5346071],
      },
    },
    destination: {
      location: {
        type: 'Point',
        coordinates: [-41.5534166, -23.5346071],
      },
    },
    status: "RETURNING_TO_ORIGIN"
  },
]
const create = (array, model) => {
  return array.map(el => {
    return new model(el).save()
  })
}

mongoose
.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
.then(connection => {
  VehicleType.collection.drop();
  Vehicle.collection.drop();
  Driver.collection.drop();
  Journey.collection.drop();
  let createVehicleTypes = create(vehicleTypes, VehicleType)
  Promise.all(createVehicleTypes)
    .then((vehicleTypesFromDb) => {
      console.log("Vehicle types created succesfully");
      vehicleTypesFromDb.forEach((type,index) => vehicles[index].vehicleType = type.id)
      let createVehicles = create(vehicles, Vehicle)
      Promise.all(createVehicles)
      .then(vehiclesFromDb => {
        console.log("Vehicles created succesfully");
        vehiclesFromDb.forEach((vehicle,index) => drivers[index].vehicle = vehicle )
        let createDrivers = create(drivers,Driver)
        Promise.all(createDrivers)
        .then((driversFromDb) => {
          console.log("Drivers created succesfully");
          // console.log(driversFromDb)
          driversFromDb.forEach((driver,index) =>{
            if(journeys[index] != null ){
              journeys[index].driver = driver.id 
            }
          })
          console.log(journeys)
        
          let createJourneys = create(journeys, Journey)
          Promise.all(createJourneys)
          .then(journeysFromDb => {
            console.log("Journeys created successfully")
            console.log(journeysFromDb)
            process.exit(0)
          })
          .catch(err => console.log("Error creating journeys", err))
        })
        .catch(err => console.log("Error creating drivers", err))
      })
      .catch(err => console.log("Error creating vehicles", err))
    })
    .catch(err => console.log("Error creating vehicle types", err))
   
})
.catch(err => {
  console.error('Error connecting to mongo', err)
})
