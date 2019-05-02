const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'El valor de {VALUE} no es un rol válido.'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El campo nombre del usuario es requerido.']
    },
    email: {
        type: String,
        required: [true, 'El campo eMail del usuario es requerido.']
    },
    password: {
        type: String,
        required: [true, 'El campo de contraseña (password) del usuario es requerida.']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    activo: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {

    // console.log('\nEn usuarioSchema.methods.toJSON ...\n')
    let userObject = this.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
    message: 'El campo {PATH} debe de ser único'
})

module.exports = mongoose.model('Usuario', usuarioSchema);