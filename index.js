const express = require('express')
const router= require('./routes/router')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const server = app.listen(process.env.PORT || PORT, () => {
    console.log(`Servidor operando con normalidad puerto: ${PORT}`)
    
})
server.on('Error', err => console.log(`El servidor tiene problemas en: ${err}`))

app.use('/api', router) 