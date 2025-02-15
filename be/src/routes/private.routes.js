const express = require('express')
const api = express.Router()
const userController = require('../controllers/user.controller.js')
const { authenticate, authorize } = require('../middlewares/auth.middleware.js')

api.use(authenticate)

// user
api.post("/api/v1/user", authorize('SUPERADMIN'), userController.createUser)
api.patch("/api/v1/user", authorize('SUPERADMIN'), userController.updateUser)
api.get("/api/v1/users", authorize('SUPERADMIN'), userController.getAllUsers)
api.delete("/api/v1/user", authorize('SUPERADMIN'), userController.deleteUser)
api.patch("/api/v2/user", authorize('SUPERADMIN'), userController.deleteUserDivisionId)





module.exports = api