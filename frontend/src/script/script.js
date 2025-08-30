// Localização: calculadora-de-frete-app/frontend/script.js

document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const originCepInput = document.getElementById('origin-cep');
    const destinationCepInput = document.getElementById('destination-cep');
    const weightInput = document.getElementById('weight');
    const resultContainer = document.getElementById('result-container');
    const freightResult = document.getElementById('freight-result');
    const errorMessage = document.getElementById('error-message');

    calculateBtn.addEventListener('click', async () => {
        errorMessage.textContent = '';
        resultContainer.style.display = 'none';

        const originCep = originCepInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        const destinationCep = destinationCepInput.value.replace(/\D/g, '');
        const weight = parseFloat(weightInput.value);

        if (!originCep || !destinationCep || isNaN(weight) || weight < 0) {
            errorMessage.textContent = 'Por favor, preencha todos os campos corretamente.';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/calculate-freight', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ originCep, destinationCep, weight })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro no servidor. Tente novamente.');
            }

            const data = await response.json();
            
            freightResult.textContent = `R$ ${data.freightValue.toFixed(2)}`;
            resultContainer.style.display = 'block';
        } catch (error) {
            errorMessage.textContent = error.message;
            console.error('Erro na requisição:', error);
        }
    });
});