const express = require("express");
const cors = require("cors");
const DBInitializer = require('./Initializers/DBInitializers');
const TrainController = require('./Controllers/TrainController');
const UserController = require('./Controllers/UserController');

const app = express();

//Importing the Cross Origin Resource Policy with default access
app.use(cors());

//Initializers
DBInitializer();
app.use(express.json());

//Importing Controllers
app.use('/api/trains',TrainController);
app.use('/api/users',UserController);

//Starting the Server
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening at port ${port}`));