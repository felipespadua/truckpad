```
#TruckPad Challenge
```

Technical challenge for TruckPad selective process

## Requirements

For building and running the application you need:

- [Node](https://nodejs.org/en/)
- [Npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

## Documentation
[Postman](https://documenter.getpostman.com/view/9680019/SWE29fp7)


## Running

First, clone the project:

```shell
git clone https://github.com/felipespadua/truckpad.git
cd truckpad
```

#### Running locally 

To get the Node server running locally:

- `npm install` to install all required dependencies
- Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
- `npm run dev` to start the local server

## Populatin Database

```shell
./truckpad node seed.js
```

##  Testing

```shell
./truckpad mocha
```

## Built With

- [JavaScript](https://www.javascript.com/) - Programming language
- [Visual Studio Code](https://code.visualstudio.com/) - IDE
- [Express](https://expressjs.com/pt-br/) - JavaScript Framework
- [Npm](https://www.npmjs.com/) - Dependency Management
