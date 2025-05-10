// backend/routes/store.js
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.get('/', storeController.getStores);
router.post('/', storeController.createStore);
router.delete('/:id', storeController.deleteStore);

module.exports = router;
