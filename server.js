const express = require('express');
const path = require('path');

const imagesRoutes = require('./routes/imagesRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 


app.use('/images', imagesRoutes);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});