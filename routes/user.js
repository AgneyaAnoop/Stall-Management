const express = require('express');
const router = express.Router();


const userController = require('../controllers/user');

//Get All Users
router.get('/', userController.getAllUsers);
//Get User by RFID

router.get('/RFID/', userController.getRFID);

router.get('/getUser/:RFID', userController.getUserByRFID);
//Create User
router.post('/createUser', userController.createUser);
//Add Balance
router.post('/addBalance', userController.addBalance);
//Purchase
router.post('/purchase', userController.purchase);

module.exports = router;
