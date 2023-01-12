//dotEnv
require('dotenv').config()
// Require Express
const express = require('express');

// Express server handling requests and responses
const app = express();
//Define db
const db = require('./database');

const axios = require('axios');

const cookieParser = require('cookie-parser');

const cors = require('cors');

app.use(express.json()); // Access data sent as json @req.body
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Initialisation de la base avec les deux tables nécessaires (à garder)
db.init();
// exemple de requete sql à supprimer
// db.all('select * from city').then((rows) => {
//   console.table(rows);
// });

// our first Route:
app.get('/home', (request, response, next) =>
  response.send('<h1>Welcome  :)</h1>')
);

//connexion with meteoConcept
app.get('/meteo/city/:name', async (req, res, next) => {
  try {
    const getInfo = await db.get(
      `select insee from city where name = '${req.params.name}'`
    );

    const test = await axios.get(
      `https://api.meteo-concept.com/api/forecast/daily/0?token=${process.env.METEO_TOKEN}&insee=${getInfo.insee}`
    );


    res.status(200).json(test.data);
  } catch (error) {
    console.log(error);
  }
});

// const routes = require("./routes/meteo");
// app.use("/", routes);

app.get('/meteo/city', async function (req, res, next) {
  try {
    const dbResult = await db.all('select * from city');
    res.status(200).json(dbResult);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// pour permettre la communication entre le front et le back en dev.
//const corsOptions = { origin: process.env.FRONTEND_URL, credentials: true };
//app.use(cors(corsOptions));

// a ajouter pour la communication entre le front et le back en dev lorsque express est instancié
/*app.use(cors({
  credentials: true
}));*/

// 404 Middleware
app.use((req, res, next) => {
  const error = new Error('Ressource not found.');
  error.status = 404;
  next(error);
});

// Server Started
app.listen(3000, () => console.log('My app listening on port 3000! '));

// dans le cas où le front est fait en js natif, voici une ligne de commande à ajouter pour servir le front à partir du projet node
// si vous faîtes du VueJS ou du React ce n'est pas nécessaire
// dans ce cas il n'est pas nécessaire d'utiliser la partie cors (ligne 6 à 8)
//app.use('/', express.static('../../front/'));
