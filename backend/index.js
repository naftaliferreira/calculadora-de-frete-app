// Localização: calculadora-de-frete-app/backend/index.js

const express = require('express');
const cors = require('cors');
const Joi = require('joi'); 
const config = require('./config'); // <-- Importa o novo arquivo

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Esquema de validação com Joi
const freightSchema = Joi.object({
  distance: Joi.number().min(0).max(10000).required(),
  weight: Joi.number().min(0).max(1000).required(),
});

// Rota de cálculo
app.post('/calculate-freight', (req, res) => {
  const { error, value } = freightSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ 
      error: 'Dados de entrada inválidos',
      details: error.details.map(d => d.message)
    });
  }
  
  const { distance, weight } = value;

  // Usa as variáveis do arquivo de configuração
  const freightValue = config.BASE_RATE + (distance * config.COST_PER_KM) + (weight * config.COST_PER_KG);

  res.json({ freightValue: parseFloat(freightValue.toFixed(2)) });
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('API de Frete está online!');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`API de Frete rodando em http://localhost:${port}`);
});