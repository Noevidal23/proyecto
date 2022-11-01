const router = require('express').Router()
const productos = require('../models/productos/productos')
const carritos = require('../models/carritos/carritos')
const isAdmin = require('../middlewares/isAdmin.middleware')
const { existence, setId, timestamp, } = require('../middlewares/product.middleware')

const { setIdCArt } = require('../middlewares/cart.middleware')


// Productos
router.get('/productos', existence, (req, res) => {
    productos.getAll().then(productos => {
        res.send(productos)
    })
})

router.get('/productos/:id', existence, (req, res) => {
    let id = req.params.id
    productos.findById(id).then(producto => {
        producto ? res.send(producto) : res.send(`El producto con id: ${id} no existe`)
    })
})

router.post('/productos', isAdmin, setId, timestamp, (req, res) => {
    productos.addProduct(req.body)
    res.sendStatus(200)
})

router.put('/productos/:id', isAdmin, timestamp, (req, res) => {
    let id = req.params.id
    let body = req.body
    productos.updateProduct(id, body).then(resp => {
        resp ? res.send('Acualizado con exito') : res.send(`El producto con id: ${id} no existe`)
    })
})

router.delete('/productos/:id', isAdmin, (req, res) => {
    let id = req.params.id
    productos.deleteProduct(id).then(resp => {
        resp ? res.send('Producto eliminado con exito') : res.send(`El producto con id: ${id} no existe`)
    })
})



// Carrito
router.post('/carrito', setIdCArt, timestamp, (req, res) => {

    carritos.createCart(req.body).then(resp => {
        res.send(resp)
    })
})
router.delete('/carrito/:id', (req, res) => {
    let id = req.params.id
    carritos.deleteCart(id).then(resp => {
        resp ? res.send('carrito eliminado con exito') : res.send(`El carrito con id: ${id} no existe`)
    })
})

router.get('/carrito/:id/productos', (req, res) => {
    let id = req.params.id
    carritos.getAllProducts(id).then(productos => {
        productos ? res.send(productos) : res.send(`El carrito con id: ${id} no existe`)
    })
})

router.post('/carrito/:id/productos', (req, res) => {
    let id = req.params.id
    let idProducto = req.body.id
    carritos.addProduct(id, idProducto).then(resp => {
        res.status(resp.status).send(resp.message)
    })
})

router.delete('/carrito/:id/productos/:idProducto', (req, res) => {
    let id = req.params.id
    let idProducto = req.params.idProducto

    carritos.removeProduct(id, idProducto).then(resp => {
        res.status(resp.status).send(resp.message)
    })

})



router.all('*', (req, res) => {
    let resp = {
        "error": -2,
        "descripcion": "La ruta no existe"
    }
    res.status(404).send(resp)
})
module.exports = router 