const carritos = require('../models/carritos/carritos')

function existenceCart(req, res, next) {

    carritos.existence().then(inventario => {
        inventario ? next() : res.send('No hay productos en existencia')
    })
}

function setIdCArt(req, res, next) {
    carritos.getId().then(id => {
        req.body.id = id
        next()
    })

}







module.exports = { existenceCart, setIdCArt }
