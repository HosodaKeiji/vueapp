// backend/index.js
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const storeRoutes = require('./routes/store');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/stores', storeRoutes);

app.listen(3000, async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');
    } catch (error) {
        console.error('Unable to connect to DB:', error);
    }
    console.log('Server running on http://localhost:3000');
});
