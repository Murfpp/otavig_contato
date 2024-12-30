const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL/TLS
    auth: {
        user: process.env.TRANSPORTER_USER,
        pass: process.env.TRANSPORTER_USER_PASS
    }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rota para enviar e-mail
app.post('/api/entrar-contato', async (req, res) => {
    const { nome, email, assunto, mensagem } = req.body;

    if (!nome || !email || !assunto || !mensagem) {
        return res.status(400).send({ message: 'Todos os campos são obrigatórios' });
    }

    const mailOptions = {
        from: email,
        to: 'otaviogarcia.santos4@gmail.com',
        subject: `${assunto} - Enviado por ${nome}`,
        text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Email enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).send({ message: 'Erro ao enviar email', error: error.message });
    }
});

// Rota para retornar "Oi"
app.get('/api/oi', (req, res) => {
    res.status(200).send({ message: 'Oi' });
});

// Rota de fallback para endpoints não encontrados
app.use((req, res) => {
    res.status(404).send({ message: 'Endpoint não encontrado' });
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server está rodando na porta ${PORT}`);
});

// Acessa a rota '/api/oi' a cada 50 segundos
setInterval(async () => {
    try {
        const response = await axios.get(`http://localhost:${PORT}/api/oi`);
        console.log('Resposta da rota /api/oi:', response.data.message);
    } catch (error) {
        console.error('Erro ao acessar a rota /api/oi:', error.message);
    }
}, 50000); // 50 segundos
