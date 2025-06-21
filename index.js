const express = require('express')

const server = express()

server.use(express.json())

//Query params = ?nome=Eu (passados direto na rota)
//Route Params = /curso/2 (direto na rota como id)
// Request Body = { nome: 'eu' }(obj no corpo da requisição)

const cursos = ['UI', 'node', 'JS']

//middleware global - o next é usado para apontar p/ onde "seguir o fluxo"
server.use((req, res, next) => {
    console.log(`req middleware global após chamar a URL: ${req.url}`)

    return next()
})

function checkName(req, res, next){
    if(!req.body.name){
        return res.status(400).json({ error: 'Name curso é obrigatório' })
    }
    return next()
}

function checkIndexGet(req, res, next){
    
    const curso = cursos[req.params.index]
    
    if(!curso){
        return res.status(400).json({ error: 'Index não existe' })
    }
    return next()
}

server.get('/cursos', checkIndexGet, (req, res) => {
    return res.json(cursos)
})

server.get('/curso/:index', checkIndexGet, (req, res) => {
    // return res.send('deu bom')

    // const name = req.query.nome;
    const { index } = req.params;
    return res.json(cursos[index])
})

server.post('/cursos', checkName, (req, res) => {
    const { name } = req.body
    cursos.push(name)
    return res.json(cursos)
})

server.put('/cursos/:index', checkName, checkIndexGet, (req, res) => {
    const { index } = req.params;
    const { name } = req.body

    cursos[index] = name
    return res.json(cursos)
})

server.delete('/cursos/:index', checkIndexGet, (req, res) => {

    const { index } = req.params
    cursos.splice(index, 1)
    return res.json(cursos)
})

server.listen(3000)
