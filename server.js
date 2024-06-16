const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const HOSTNAME = '127.0.0.1';
const SERVER_RUNNING_MESSAGE = `O servidor está sendo executado em http://${HOSTNAME}:${PORT}/`;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

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

app.post('/contato', (req, res) => {
	const { nome, email, comentarios } = req.body;
	const requestTime = req.requestTime;

	res.render('resposta', { nome, email, comentarios, requestTime });
});

app.use((req, res) => {
    res.status(404).send('Página não encontrada');
});

app.listen(PORT, HOSTNAME, () => {
    console.log(SERVER_RUNNING_MESSAGE);
});