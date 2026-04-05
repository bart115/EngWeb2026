const Filme = require('../models/filmeModel');
const Ator = require('../models/atorModel');
const Genero = require('../models/generoModel');

const cinemaController = {
    getAllFilmes: async function(req, res) {
        try {
            const filmes = await Filme.find();
            res.render('allFilmes', { list: filmes });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getFilmeById: async function(req, res) {
        try {
            const filme = await Filme.findOne({ id: req.params.id });
            if (!filme) {
                res.status(404).json({ error: "Filme não encontrado" });
            }
            else {
                res.render('filmeID', { filme: filme });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllAtores: async function(req, res) {
        try {
            const atores = await Ator.find();
            res.render('atores', { atores: atores });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAtorById: async function(req, res) {
        try {
            const ator = await Ator.findOne({ id: req.params.id });
            if (!ator) {
                res.status(404).json({ error: "Ator não encontrado" });
            }
            else {
                res.render('atorID', { ator: ator });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllGeneros: async function(req, res) {
        try {
            const generos = await Genero.find();
            res.render('generos', { generos: generos });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = cinemaController;