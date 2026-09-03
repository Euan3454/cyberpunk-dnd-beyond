const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const characterRoutes = require('./routes/characters');
const catalogRoutes = require('./routes/catalogs');
const calculationRoutes = require('./routes/calculations');
const errorHandler = require('./middleware/error');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/calculations', calculationRoutes);

app.use(errorHandler);

module.exports = app;
