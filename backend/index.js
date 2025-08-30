// Localização: calculadora-de-frete-app/backend/index.js

const express = require('express');
const cors = require('cors');
const Joi = require('joi'); 
const config = require('./config');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Novo esquema de validação para os CEPs
const freightSchema = Joi.object({
  originCep: Joi.string().pattern(/^\d{8}$/).required(),
  destinationCep: Joi.string().pattern(/^\d{8}$/).required(),
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
  
  const { originCep, destinationCep, weight } = value;

  // Lógica de cálculo de distância simulada
  // Em uma implementação real, esta seria a chamada para uma API de geolocalização.
  let simulatedDistance = 0;
  if (originCep.substring(0, 5) === destinationCep.substring(0, 5)) {
    simulatedDistance = 25; // Distância curta para CEPs próximos
  } else {
    simulatedDistance = 500; // Distância longa para CEPs diferentes
  }
  
  const freightValue = config.BASE_RATE + (simulatedDistance * config.COST_PER_KM) + (weight * config.COST_PER_KG);

  res.json({ freightValue: parseFloat(freightValue.toFixed(2)) });
});

app.get('/', (req, res) => {
  res.send('API de Frete está online!');
});

app.listen(port, () => {
  console.log(`API de Frete rodando em http://localhost:${port}`);
});