const express = require('express');
const router = express.Router();
const cinemaController = require('../controllers/cinemaController');

// Listar filmes
router.get('/filmes', cinemaController.getAllFilmes);

// Consultar um filme
router.get('/filmes/:id', cinemaController.getFilmeById);

// Listar atores
router.get('/atores', cinemaController.getAllAtores);

// Consultar um ator
router.get('/atores/:id', cinemaController.getAtorById);

// Listar generos
router.get('/generos', cinemaController.getAllGeneros);

module.exports = router;