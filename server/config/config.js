// ============================================================
// Puerto (según valores de entorno de Heroku)
// ============================================================
process.env.PORT = process.env.PORT || 3000;

// ============================================================
// Entorno de trabajo (según valores de entorno de Heroku)
// ============================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================================================
// Variables para JWT Token según entorno
//             (según valores de entorno de Heroku)
// ============================================================
process.env.JWT_EXPIRY = process.env.JWT_EXPIRY || '30d';
process.env.JWT_SEED = process.env.JWT_SEED || 'este-es-el-seed-de-desarrollo';

// ============================================================
// Cadenas de conexión a Base de Datos según entorno 
//             (según valores de entorno de Heroku)
// ============================================================
process.env.URLDB = process.env.MONGO_URI || 'mongodb://localhost:27017/cafe';