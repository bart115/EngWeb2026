const mongoose = require('mongoose');

const atorSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String },
    filmes : []
});

const Ator = mongoose.model('Ator', atorSchema, 'atores');

module.exports = Ator;