const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();

const PORT = 3000;
const HOSTNAME = '127.0.0.1';
const SERVER_RUNNING_MESSAGE = `O servidor está sendo executado em http://${HOSTNAME}:${PORT}/`;

const Usuario = require('./models/usuario');
const db_access = require('./setup/db');

mongoose
    .connect(db_access.mongoURL)
    .then(() => { console.log("Conexão ao MongoDB bem sucedida!") })
    .catch(err => console.log(err));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const catchRequestTime = (req, res, next) => {
    if (req.method === 'POST') {
        req.requestTime = new Date();
    }
    next();
};

app.use(catchRequestTime);

app.get('/', (req, res) => {
    res.render('contato');
});

app.get('/contato', (req, res) => {
    res.render('contato');
});

app.post('/contato', async (req, res) => {
    const { nome, email, comentario, senha } = req.body;
    const requestTime = req.requestTime;

    try {
        const existingUser = await Usuario.findOne({ 
            name: nome, 
            email: email, 
            comentario: comentario 
        });

        if (existingUser) {
            return res.status(400).send('Nome de usuário, e-mail e comentário já existem.');
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const newUser = new Usuario({
            name: nome,
            email: email,
            senha: hashedPassword,
            comentario: comentario,
            date: req.requestTime,
        });

        await newUser.save();

        res.render('resposta', { nome, email, comentario, requestTime });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao processar a solicitação.');
    }
});

app.use((req, res) => {
    res.status(404).send('Página não encontrada');
});

app.listen(PORT, HOSTNAME, () => {
    console.log(SERVER_RUNNING_MESSAGE);
});