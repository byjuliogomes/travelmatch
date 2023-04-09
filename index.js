const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Bem vindo a plataforma de roteiros de viagens!')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor iniciado na porta ${PORT}')
});