const express = require("express");

const exphbs = require("express-handlebars");

const bodyParser = require("body-parser");

const routes = require("./routes");

const passport = require("./config/passport");

// Importar express-session para manejar las sesiones de usuario
const session = require("express-session");

// Se necesita cookie parser para habilitar el manejo de cookies
const cookieParser = require("cookie-parser");

const db = require("./config/dbdev-acad");

require("./models/Usuario");

db.sync()
.then(() => console.log("===================== Se conecto con el servidor de DB =============="))
.catch((error) => console.log(error));

const app = express();

app.engine(
    "hbs",
    exphbs({
        defaultLayout: 'main',
        extname: ".hbs"
    })
);

app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));

// Usar el uso de las cookies en el sitio
app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar valores mediante el middleware
app.use((req, res, next) => {
    res.locals.usuario = { ...req.user } || null;
    next();
});

app.use("/", routes());

app.listen(7891, () => {
    console.log("================== Servidor ejecutandose en el puerto 7891 ======================");
});