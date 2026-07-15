require('dotenv').config();
const express = require('express');
const cors = require('cors');

const universidadesRouter = require('./routes/universidades');
const emprendimientosRouter = require('./routes/emprendimientos');
const productosRouter = require('./routes/productos');

const app = express();

app.use(cors()); // en dev, permite que tu frontend (otro puerto/origen) llame a esta API
app.use(express.json());

app.get('/', (req, res) => res.send('Unimarket API funcionando'));

app.use('/api/universidades', universidadesRouter);
app.use('/api/emprendimientos', emprendimientosRouter);
app.use('/api/productos', productosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
