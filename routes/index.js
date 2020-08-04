const express = require("express");
const routes = express.Router();

// Importar express-validator
const { body } = require("express-validator/check");

const homeController = require("../controllers/homeController");
const usersController = require("../controllers/usersController");
const cursoController = require("../controllers/cursosController");
const inscripcionController = require("../controllers/inscripcionController");
const authController = require("../controllers/authController");
const leccionController = require("../controllers/leccionController");
const comentarioController = require("../controllers/comentarioController");
const Usuario = require("../models/Usuario");

// Rutas disponibles
module.exports = function () {
    routes.get("/", homeController.inicio);

    routes.get("/inicio", authController.userVerifyAuth, homeController.home);

    // Rutas para registrarse
    routes.get("/registrate", usersController.signUpCharge);

    routes.post(
        "/registrate",
        // Sanitizar el contenido del formulario
        body("nombre").notEmpty().trim().escape(),
        body("apellido").notEmpty().trim().escape(),
        body("user").notEmpty().trim().escape(),
        body("password").notEmpty().trim(),
        body("password_verify").notEmpty().trim(),
        usersController.signUpVerify
    );

    // Para iniciar sesion
    routes.get("/iniciar_sesion", usersController.loginCharge);

    routes.post(
        "/iniciar_sesion",
        // Sanitizando
        body("email").notEmpty().trim(),
        body("password").notEmpty().trim(),
        authController.autenticarUsuario,
    );

    // Rutas para restablecer contraseñas de un usuario
    routes.get(
        "/restablecer_password",
        usersController.cargarFormularioRestablecerPassword
    );

    routes.post(
        "/restablecer_password",
        // Sanitizando
        body("email").notEmpty().trim(),
        authController.enviarToken);

    // Reseteo de contraseña
    routes.get("/resetear_password/:token", authController.validarToken);

    routes.post(
        "/resetear_password/:token",
        // Sanitizando
        body("password").notEmpty().trim(),
        body("passwordVerify").notEmpty().trim(),
        authController.actualizarContraseña);

    // Rutas para los cursos
    //Cargar la vista para agregar los cursos
    routes.get(
        "/agregar_curso",
        authController.userVerifyAuth,
        cursoController.agregarCurso
    );
    // Metodo POST para insertar los cursos
    routes.post(
        "/agregar_curso",
        authController.userVerifyAuth,
        // Sanitizando
        body("nombre").notEmpty().trim().escape(),
        body("precio").notEmpty().trim().escape(),
        body("descripcion").notEmpty().trim().escape(),
        body("categoria").notEmpty().trim().escape(),
        cursoController.insertarCurso
    );
    // Cargar la vista para ver la lista de los cursos que se estan impartiendo
    routes.get(
        "/lista_curso_doc",
        authController.userVerifyAuth,
        cursoController.listaCursoDoc
    );

    // Cargar la vista para ver la lista de los cursos que se puede inscribir
    routes.get(
        "/lista_curso_alu",
        authController.userVerifyAuth,
        cursoController.listaCursoAlu
    );

    // Cargar la vista para ver la informacion del curso
    routes.get(
        "/info_curso/:url",
        authController.userVerifyAuth,
        cursoController.infoCurso
    );
    routes.get(
        "/inscripcion_curso/:url",
        authController.userVerifyAuth,
        inscripcionController.inscripcionCurso
    );

    routes.get(
        "/lista_curso_inscrito",
        authController.userVerifyAuth,
        inscripcionController.listaInscrito
    );

    // Cargar la vista para ver la informacion del curso inscrito
    routes.get(
        "/info_curso_inscrito/:url",
        authController.userVerifyAuth,
        inscripcionController.infoCursoInscrito
    );

    // Abrir informacion para la administracion del curso
    routes.get(
        "/admin_curso/:url",
        authController.userVerifyAuth,
        cursoController.infoCursoDoc
    );

    // Cargar la vista para editar los campos del curso
    routes.get(
        "/actualizar_curso/:id",
        authController.userVerifyAuth,
        cursoController.cargarActualizarCurso
    );
    // Ejecutar la actualizacion del curso
    routes.post(
        "/actualizar_curso/:id",
        authController.userVerifyAuth,
        // Sanitizando
        body("nombre").notEmpty().trim().escape(),
        body("precio").notEmpty().trim().escape(),
        body("descripcion").notEmpty().trim().escape(),
        body("categoria").notEmpty().trim().escape(),
        cursoController.actualizarCurso
    );

    // Ver el perfil del usuario
    routes.get(
        "/actualizar_perfil",
        authController.userVerifyAuth,
        usersController.verPerfilUsuario
    );
    routes.post(
        "/actualizar_perfil",
        authController.userVerifyAuth,
        // Sanitizando
        body("nombre").notEmpty().trim().escape(),
        body("apellido").notEmpty().trim().escape(),
        body("usuario").notEmpty().trim().escape(),
        usersController.actualizarPerfil
    );

    // Ver contenido de la leccion
    routes.get(
        "/leccion_info_ins/:url",
        authController.userVerifyAuth,
        leccionController.leccionInfoInscrito
    );
    // Agregar leccion
    routes.get(
        "/agregar_leccion/:id",
        authController.userVerifyAuth,
        leccionController.cargarFormularioInsertarLeccion
    );
    routes.post(
        "/agregar_leccion/:id",
        authController.userVerifyAuth,
        // Sanitizando
        body("nombre").notEmpty().trim().escape(),
        body("descripcion").notEmpty().trim().escape(),
        leccionController.insertarLeccion
    );

    // Actualizar leccion
    routes.get(
        "/actualizar_leccion/:url/:cursoId",
        authController.userVerifyAuth,
        leccionController.cargarFormularioactualizarLeccion
    );
    routes.post(
        "/actualizar_leccion/:id/:cursoUrl",
        authController.userVerifyAuth,
        // Sanitizando
        body("nombre").notEmpty().trim().escape(),
        body("descripcion").notEmpty().trim().escape(),
        leccionController.actualizarLeccion
    );

    // eliminar leccion
    routes.delete(
        "/leccion/:id",
        authController.userVerifyAuth,
        leccionController.eliminarLeccion
    );

    // Agregar comentario/reseña al curso inscrito
    routes.post(
        "/agregar_comentario/:url",
        authController.userVerifyAuth,
        // Sanitizando
        body("comentario").notEmpty().trim().escape(),
        comentarioController.publicarComentario
    );

    // cargar todos los cursos
    routes.get("/lista_cursos", cursoController.listaCursos);

    // Buscar un curso
    routes.post(
        "/busqueda",
        authController.userVerifyAuth,
        // Sanitizando
        body("busqueda").notEmpty().trim().escape(),
        cursoController.buscarCurso
    );
    // Buscar un curso de acuerdo a la categoria principal
    routes.get("/categoria/:categoria", cursoController.cursoCategoria);

    routes.post(
        "/busqueda_general",
        // Sanitizando
        body("busqueda").notEmpty().trim().escape(),
        cursoController.buscarCursoGeneral
    );
    // Cerrar sesion
    routes.get("/cerrar_sesion", authController.logout);
    return routes;
};
