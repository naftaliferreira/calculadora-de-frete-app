// Localização: calculadora-de-frete-app/frontend/script.js

document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const distanceInput = document.getElementById('distance');
    const weightInput = document.getElementById('weight');
    const resultContainer = document.getElementById('result-container');
    const freightResult = document.getElementById('freight-result');
    const errorMessage = document.getElementById('error-message');

    calculateBtn.addEventListener('click', async () => {
        // Limpa mensagens de erro e resultados anteriores
        errorMessage.textContent = '';
        resultContainer.style.display = 'none';

        const distance = parseFloat(distanceInput.value);
        const weight = parseFloat(weightInput.value);

        // Validação no frontend: Verifica se os campos estão vazios
        if (distanceInput.value === '' || weightInput.value === '') {
            errorMessage.textContent = 'Por favor, preencha todos os campos.';
            return;
        }

        // Validação no frontend: Verifica se os valores são números e não são negativos
        if (isNaN(distance) || isNaN(weight) || distance < 0 || weight < 0) {
            errorMessage.textContent = 'A distância e o peso devem ser números positivos.';
            return;
        }

        try {
            // Chamada à API do backend
            const response = await fetch('http://localhost:3000/calculate-freight', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ distance, weight })
            });

            if (!response.ok) {
                // Se o backend retornar um erro, lê a mensagem dele
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro no servidor. Tente novamente.');
            }

            const data = await response.json();
            
            // Exibe o resultado
            freightResult.textContent = `R$ ${data.freightValue.toFixed(2)}`;
            resultContainer.style.display = 'block';
        } catch (error) {
            // Exibe a mensagem de erro da requisição ou do backend
            errorMessage.textContent = error.message;
            console.error('Erro na requisição:', error);
        }
    });
});