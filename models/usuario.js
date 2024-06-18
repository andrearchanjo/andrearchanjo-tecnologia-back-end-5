const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required: true,
    },
    comentario: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
