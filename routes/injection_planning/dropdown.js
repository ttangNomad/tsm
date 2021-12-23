const express = require('express');
const router = express.Router();
const dbCon = require('../../../lib/db');

router.get('/part', (req, res) => {
    let selectPart = `SELECT * FROM MasterPart order by PartCode`;
})

router.get('/mold', (req, res) => {
    let selectMold = `SELECT * FROM `;
})