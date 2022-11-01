const e = require("express")

function isAdmin(req, res, next) {
    let admin = req.query.admin
    let resp = {
        "Error": -1,
        "Descripcion": "No cuentas con autorizacion"
    }
    if (admin == 'true')
        next()
    else

        res.status(401).send(resp)
}
module.exports = isAdmin