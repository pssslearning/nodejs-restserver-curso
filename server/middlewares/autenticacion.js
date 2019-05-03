// ----------------------------------------------------------------
// Requires
// ----------------------------------------------------------------
const jwt = require('jsonwebtoken');

// ----------------------------------------------------------------
// Verificar Token
// ----------------------------------------------------------------
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    console.log(`En verifica Token. Token[${token}]`);

    jwt.verify(token, process.env.JWT_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                funcion: 'Token Validation',
                url: req.url,
                method: req.method,
                error: {
                    code: '890INVALIDTOKEN',
                    msg: 'Credenciales incorrectas.',
                    err
                }
            });
        } else {
            req.usuarioREQ = decoded.usuario;
            console.log(`En verifica Token. Usuario[${req.usuarioREQ }]`);
            next();
        }


    });


};

// ----------------------------------------------------------------
// Verificar Rol Administrador (ADMIN_ROLE)
// ----------------------------------------------------------------
let verificaAdminRole = (req, res, next) => {

    console.log(`En verifica ADMIN_ROLE. Role[${req.usuarioREQ.role}]`);

    if (req.usuarioREQ.role === 'ADMIN_ROLE') {
        console.log(`En verifica ADMIN_ROLE. Usuario VERIFICADO`);
        next();
    } else {
        return res.status(401).json({
            funcion: 'ADMIN_ROLE Verification',
            url: req.url,
            method: req.method,
            error: {
                code: '890NOADMINROLE',
                msg: `Se requiere disponer de Rol 'ADMIN_ROLE' para esta función.`
            }
        });
    }
};


module.exports = {
    verificaToken,
    verificaAdminRole
}