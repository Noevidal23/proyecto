const productos = require('../models/productos/productos')

function existence(req, res, next) {

    productos.existence().then(inventario => {
        inventario ? next() : res.send('No hay productos en existencia')
    })
}

function setId(req, res, next) {
    productos.getId().then(id => {
        req.body.id = id
        next()
    })

}

function timestamp(req, res, next) {
    req.body.timestamp = Date.now()
    next()

}

function validateData(req, res, next) {
    // let resp = productos.validate(req.body)
    // console.log(req.body.codigo);
    // resp ? next() : res.send('Todos los campos deben estar llenos')


}



module.exports = { existence, setId, timestamp, validateData }
