// ============================================================
// Puerto (según valores de entorno de Heroku)
// ============================================================
process.env.PORT = process.env.PORT || 3000;

// ============================================================
// Entorno de trabajo (según valores de entorno de Heroku)
// ============================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================================================
// Cadenas de conexión a Base de Datos según entorno 
//             (según valores de entorno de Heroku)
// ============================================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;