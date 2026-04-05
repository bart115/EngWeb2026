const mongoose = require('mongoose');

const generoSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String },
    filmes: []
});

const Genero = mongoose.model('Genero', generoSchema, 'generos');

module.exports = Genero;