const mongoose = require('mongoose');

const filmeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: String },
    cast: [{ type: String }],
    genres: [{ type: String, required: true }],
    id: { type: Number, required: true, unique: true }
});

const Filme = mongoose.model('Filme', filmeSchema, 'filmes');

module.exports = Filme;