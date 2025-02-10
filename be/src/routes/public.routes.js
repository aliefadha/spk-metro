const express = require('express')
const publicRoute = express.Router()
const userController = require('../controllers/user.controller.js')

publicRoute.post("/api/v1/login",userController.login)

module.exports= publicRoute