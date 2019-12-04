const server = require("../bin/www");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);

var driverId
describe('Drivers Service', function() {
  let driver = {
    name: "Felipe Sekkar",
    age: 24,
    gender: "M",
    hasVehicle: true,
    licenseType: "C"
  } 
  describe('Create Driver', () => {
    
    it('Should create a user', done => {
      chai
        .request(server)
        .post("/api/drivers")
        .send(driver)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.name).to.exist
          expect(res.body.age).to.exist
          expect(res.body.gender).to.exist
          expect(res.body.hasVehicle).to.exist
          expect(res.body.licenseType).to.exist
          expect(res.body._id).to.exist
  
          driverId = res.body._id
          done()
        });
    });
    let driver2 = {
      age: 24,
      gender: "M",
      hasVehicle: true,
      licenseType: "C"
    }
    it('When name is missing, then the response status is 422', ()=> {
      chai
        .request(server)
        .post("/api/drivers")
        .send(driver2)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.errors).to.exist
        });
    });
    var updateDriver = {
      hasVehicle: false,
      licenseType: "B"
    }
    it("Should update a user", done => {
      chai
        .request(server)
        .put("/api/drivers/" + driverId)
        .send(updateDriver)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.name).to.equal("Felipe Sekkar")
          expect(res.body.age).to.equal(24)
          expect(res.body.gender).to.equal("M")
          expect(res.body.hasVehicle).to.equal(false)
          expect(res.body.licenseType).to.equal("B")
          expect(res.body._id).to.exist
          done();
        });
    });
  });

  describe('Get Drivers', () => {
    it("Should return a array of drivers", done => {
      chai
        .request(server)
        .get("/api/drivers")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.drivers).to.exist
          done();
        });
    });
  });
  describe('Get Drivers Unloaded Returning to Origin', () => {
    it("Should return a array of drivers", done => {
      chai
        .request(server)
        .get("/api/drivers/unloaded?status=RETURNING_TO_ORIGIN")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.drivers).to.exist
          done();
        });
    });
  });
  describe('Get Drivers Loaded Returning to Origin', () => {
    it("Should return a array of drivers", done => {
      chai
        .request(server)
        .get("/api/drivers/loaded?status=RETURNING_TO_ORIGIN")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.drivers).to.exist
          done();
        });
    });
  });
  describe('Get Number of Drivers Who Have Own Vehicle', () => {
    it("Should return a count of drivers", done => {
      chai
        .request(server)
        .get("/api/drivers/vehicles/owned/count")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.count).to.exist
          done();
        });
    });
  });
  describe('Get Drivers Journey', () => {
    it("Should return null", done => {
      chai
        .request(server)
        .get("/api/drivers/journeys/driver/" + driverId)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.null
          done();
        });
    });
  });
});
var vehicleId
let vehicle = {
  "plate": "SOP9234",
  "vehicleType": "5de74aca3fae0971079d0e2e"
}
describe('Vehicles Service', function() {
  describe('Get Vehicles', () => {
    it("Should return a array of vehicles", done => {
      chai
        .request(server)
        .get("/api/vehicles")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.vehicles).to.exist
          done();
        });
    });
  });
  describe('Creating Vehicle', () => {
    it("Should return a vehicle", done => {
      chai
        .request(server)
        .post("/api/vehicles")
        .send(vehicle)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.plate).to.exist
          expect(res.body._id).to.exist
          vehicleId = res.body._id
          done();
        });
    });
  });
  describe('Get a Vehicle', () => {
    it("Should return a vehicle plate " + vehicle.plate, done => {
      chai
        .request(server)
        .get("/api/vehicles/" + vehicleId)
        .send(vehicle)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.plate).to.equal(vehicle.plate)
          expect(res.body._id).to.exist
          done();
        });
    });
  });
  describe('Get Drivers Terminal', () => {
    it("By Day", done => {
      chai
        .request(server)
        .get("/api/vehicles/terminal/day?date=2019-12-04")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.date).to.equal("2019-12-04")
          expect(res.body.count).to.exist
          done();
        });
    });
    it("By Week", done => {
      chai
        .request(server)
        .get("/api/vehicles/terminal/week?startDate=2019-12-04")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.startDate).to.equal("2019-12-04")
          expect(res.body.count).to.exist
          done();
        });
    });
    it("By Month", done => {
      chai
        .request(server)
        .get("/api/vehicles/terminal/month?date=2019-12-04")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.month).to.equal(12)
          expect(res.body.count).to.exist
          done();
        });
    });
  });
})
describe('Journeys Service', function() {
  describe('Get Journeys Grouped By Origin Destination', () => {
    it("Should return all origins and destinations", done => {
      chai
        .request(server)
        .get("/api/journeys/origin-destination")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.origins).to.exist
          expect(res.body.destinations).to.exist
          done();
        });
    });
  })
})