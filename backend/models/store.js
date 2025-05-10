// backend/models/store.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Store extends Model {}
    
    Store.init({
        name: DataTypes.STRING,
        genre: DataTypes.STRING,
        priceRange: DataTypes.STRING,
        addedDate: DataTypes.DATE,
        lastEatenDate: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Store',
    });

    return Store;
};
