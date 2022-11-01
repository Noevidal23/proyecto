const fs = require('fs')
const path = require('path')

class producto {
    pathFile = ''

    constructor(name) {
        name ? name : name = 'noName'
        this.pathFile = path.join(process.cwd(), `/db/product/${name}.json`)
        if (!fs.existsSync(`./db/product/${name}.json`)) {
            fs.writeFileSync(`./db/product/${name}.json`, "", "utf-8")
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
    async findById(id) {
        let array = await this.getAll()
        let find = array.find(el => el.id == id)
        return find ? find : false


    }

    async addProduct(data) {
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
        } catch (error) {
            console.log(error);
        }

    } 
    async updateProduct(id, data) {
        try {

            let array = await this.getAll()
            data.id = Number(id)
            let update = array.find(el => el.id == id)

            if (update) {
                let index = array.indexOf(update)
                array[index] = data
                this.writeData(array)
                return true
            }
            else {
                return false
            }

        }
        catch (error) {
            console.log('Error al actualizar datos:', error);
        }
    }
    async deleteProduct(id) {
        let array = await this.getAll()

        let update = array.filter(el => el.id != id)

        if (array.length == update.length) {
            return false
        }
        else {
            this.writeData(update)
            return true
        }
    }


    validate(data) {

        // let check = Object.values(data)

        // let noData = check.find(el => el == "" || el == undefined)

        // if (noData) {
        //     return false
        // }
        // else
        //     return true

        // if (data.nombre == "" || data.descripcion == "" || data.codigo == "" || data.url == "" || data.precio == "" || data.stock == "") {

        //     return false
        // }
        // else if (data.nombre == undefined || data.descripcion == undefined || data.codigo == undefined || data.url == undefined || data.precio == undefined || data.stock == undefined)
        //     return false
        // else
        //     return true
    }



    async writeData(data) {
        fs.writeFileSync(this.pathFile, JSON.stringify(data, null, 2));
    }
}

module.exports = producto