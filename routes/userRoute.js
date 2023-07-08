const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const authMiddleware = require('../middleWare/authMiddleware');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let User = require('../models/User');

router.get("/login", async (req, res) => {
  try {
    const Users = await User.find();
    res.send(Users);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});