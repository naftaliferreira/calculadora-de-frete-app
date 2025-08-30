// Localização: calculadora-de-frete-app/backend/index.js

const express = require('express');
const cors = require('cors');
const Joi = require('joi'); 
const config = require('./config');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Função para buscar informações do CEP na API ViaCEP
async function getCepInfo(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.erro) {
        throw new Error(`CEP ${cep} não encontrado.`);
    }
    return data;
}

// Função para calcular a distância simulada com base na cidade/estado
async function getDistance(originCep, destinationCep) {
    const originInfo = await getCepInfo(originCep);
    const destinationInfo = await getCepInfo(destinationCep);

    // Se as UFs (estados) forem diferentes, é uma distância longa
    if (originInfo.uf !== destinationInfo.uf) {
        return 1500; // Simula uma longa distância
    }
    // Se as cidades forem diferentes, mas os estados iguais, é uma distância média
    else if (originInfo.localidade !== destinationInfo.localidade) {
        return 250; // Simula uma média distância
    }
    // Se a cidade for a mesma, a distância é curta
    else {
        return 25; // Simula uma curta distância
    }
}

// Novo esquema de validação para os CEPs
const freightSchema = Joi.object({
  originCep: Joi.string().pattern(/^\d{8}$/).required(),
  destinationCep: Joi.string().pattern(/^\d{8}$/).required(),
  weight: Joi.number().min(0).max(1000).required(),
});

// Rota de cálculo
app.post('/calculate-freight', async (req, res) => {
  const { error, value } = freightSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ 
      error: 'Dados de entrada inválidos',
      details: error.details.map(d => d.message)
    });
  }
  
  const { originCep, destinationCep, weight } = value;

  try {
    const distance = await getDistance(originCep, destinationCep);
    const freightValue = config.BASE_RATE + (distance * config.COST_PER_KM) + (weight * config.COST_PER_KG);
    res.json({ freightValue: parseFloat(freightValue.toFixed(2)) });
  } catch (err) {
    return res.status(400).json({ 
      error: err.message
    });
  }
});

app.get('/', (req, res) => {
  res.send('API de Frete está online!');
});

app.listen(port, () => {
  console.log(`API de Frete rodando em http://localhost:${port}`);
});