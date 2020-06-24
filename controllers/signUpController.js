// const routes = require("../routes");
const Usuario = require("../models/Usuario");

exports.signUp = (req, res, next) => {
    res.render("signUp");
};


// Verificacion y creacion de un nuevo usuario
// La conexion es asincrona con async / await
exports.signUpVerify = async (req, res, next) => {
    /* console.log(req.body); */

    const { nombre, apellido, email, user, password } = req.body;
    const usuario = user;
    const mensajes = [];

    if(!nombre)
    {
        mensajes.push({error : "Ud tiene que tener un nombre",
        type: "alert-danger"});
    }
    if(!apellido)
    {
        mensajes.push({error : "Ud tiene que tener un apellido",
        type: "alert-danger"});
    }
    if(!email)
    {
        mensajes.push({error : "Tiene que ingresar un correo",
        type: "alert-danger"});
    }
    if(!user)
    {
        mensajes.push({error : "El usuario no puede estar vacio",
        type: "alert-danger"});
    }
    if(!password)
    {
        mensajes.push({error : "La contraseña no puede estar vacia",
        type: "alert-danger"});
    }

    // Si hay mensajes
    if(mensajes.length)
    {
        res.render("signUp", {
           mensajes 
        });
    }
    else
    {
        try {
            // Insertar en la base de datos
            await Usuario.create({ nombre, apellido, email, usuario, password });

            mensajes.push({
                error: "Se inserto en la base de datos",
                type: "alert-success"
            });

            res.render("signUp", {
                mensajes
            });

        } catch (error) {
            mensajes.push({
                error: "No se logro insertar, intente de nuevo",
                type: "alert-danger"
            });

            res.render("signUp", {
                mensajes
            });

            /* console.log(error); */
        }


    }
};