// Localização: /script.js

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

        // Validação básica no frontend
        if (isNaN(distance) || isNaN(weight) || distance < 0 || weight < 0) {
            errorMessage.textContent = 'Por favor, insira valores válidos e positivos para distância e peso.';
            return;
        }

        try {
            // Chamada à API do backend usando a API nativa 'fetch'
            const response = await fetch('http://localhost:3000/calculate-freight', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ distance, weight })
            });

            if (!response.ok) {
                // Se a resposta da API não for bem-sucedida, lança um erro
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro no servidor. Tente novamente.');
            }

            const data = await response.json();
            
            // Exibe o resultado
            freightResult.textContent = `R$ ${data.freightValue.toFixed(2)}`;
            resultContainer.style.display = 'block';
        } catch (error) {
            errorMessage.textContent = error.message;
            console.error('Erro:', error);
        }
    });
});