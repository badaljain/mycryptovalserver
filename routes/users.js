var express = require('express')
var router = express.Router()
const users = require('../public/data/users.json')

router.get('/:id/portfolio', (req, res, next) => {
    const id = req.params.id
    const user = users[id]
    console.log(user)
    res.send(user.portfolio)
})

module.exports = { 
    router: router
}
