const e = require('express')
const fs = require('fs')
const path = require('path')
const productos = require('../productos/productos')

class carrito {
    pathFile = ''

    constructor(name) {
        name ? name : name = 'noName'
        this.pathFile = path.join(process.cwd(), `/db/cart/${name}.json`)
        if (!fs.existsSync(`./db/cart/${name}.json`)) {
            fs.writeFileSync(`./db/cart/${name}.json`, "", "utf-8")
        }
    }
    async getId() {
        let array = await this.getAll()

        if (array) {
            return array.length + 1
        }
        else
            return 1
    }
    async existence() {
        let array = await this.getAll()
        return array ? true : false
    }

    async getAll() {

        try {
            const data = await fs.promises.readFile(this.pathFile, 'utf-8')

            if (data != '') {
                const arrayData = JSON.parse(data)
                return arrayData
            }
            else {
                return false
            }
        }
        catch (error) {
            console.log('Error al obtener archivo: ', error);
        }

    }

    async createCart(data) {
        let temp = []
        data.productos = temp
        try {
            let array = await this.getAll()

            if (array.length > 0) {
                array.push(data)
                this.writeData(array)
            }
            else {
                let newArray = []
                newArray.push(data)
                this.writeData(newArray)
            }
            let resp = {
                "status": 200,
                "newCartId": data.id
            }
            return resp
        }
        catch (error) {

        }

    }

    async deleteCart(id) {
        try {
            let array = await this.getAll()

            let update = array.filter(el => el.id != id)

            if (array.length == update.length) {
                return false
            }
            else {
                this.writeData(update)
                return true
            }
        } catch (error) {

        }
    }
    async getCart(id) {
        let resp = {}
        let array = await this.getAll()
        let find = array.find(el => el.id == id)
        if (find) {
            let index = array.indexOf(find)
            resp = {
                'exist': true,
                'index': index,
                'value': find
            }
        }
        else {
            resp = {
                'exist': false
            }
        }
        return resp

    }
    async getAllProducts(id) {
        try {
            let cart = await this.getCart(id)

            if (cart.exist) {
                let carrito = cart.value

                if (carrito.productos.length > 0) {
                    return carrito.productos
                }
                else
                    return 'Carrito vacio'
            }
            else
                return false
        }
        catch (error) {
            console.log('Error al obtener archivo: ', error);
        }

    }
    async addProduct(id, idProducto) {

        try {
            let resp = {}
            let product = await productos.findById(idProducto)
            if (product) {
                let cart = await this.getCart(id)
                if (cart.exist) {
                    let all = await this.getAll()

                    all[cart.index].productos.push(product)
                    this.writeData(all)
                    return resp = {
                        'status': 200,
                        'message': 'Producto Agregado al carrito'
                    }
                }
                else
                    return resp = {
                        'status': 200,
                        'message': 'No existe el carrito'
                    }
            }
            else
                return resp = {
                    'status': 200,
                    'message': 'No existe el producto'
                }
        } catch (error) {
            console.log('Error al adicionar producto');
        }
    }


    async removeProduct(id, idProducto) {
        let resp = {}
        try {
            let cart = await this.getCart(id)
            if (cart.exist) {
                let array = await this.getAll()
                let productos = array[cart.index].productos
                let newProductos = productos.filter(el => el.id != idProducto)
                if (newProductos.length != productos.length) {
                    array[cart.index].productos = newProductos
                    this.writeData(array)
                    return resp = {
                        'status': 200,
                        'message': 'Producto eliminado del carrito'
                    }
                }
                else
                    return resp = {
                        'status': 200,
                        'message': 'No existe el producto en el carrito'
                    }
            }
            else
                return resp = {
                    'status': 200,
                    'message': 'No existe el carrito'
                }

        } catch (error) {

        }

    }


    async writeData(data) {
        fs.writeFileSync(this.pathFile, JSON.stringify(data, null, 2));
    }
}
module.exports = carrito