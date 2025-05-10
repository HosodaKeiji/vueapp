// backend/controllers/storeController.js
const { Store } = require('../models');

exports.getStores = async (req, res) => {
    try {
        const stores = await Store.findAll();
        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createStore = async (req, res) => {
    try {
        const store = await Store.create(req.body);
        res.status(201).json(store);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteStore = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Store.destroy({ where: { id } });
        if (deleted) {
            res.status(200).json({ message: '店舗を削除しました' });
        } else {
            res.status(404).json({ error: '店舗が見つかりません' });
        }
        } catch (error) {
        console.error('削除エラー:', error);
        res.status(500).json({ error: 'サーバーエラーにより削除できませんでした' });
    }
};