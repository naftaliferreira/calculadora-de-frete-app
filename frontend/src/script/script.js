// Localização: calculadora-de-frete-app/frontend/script.js

document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const originCepInput = document.getElementById('origin-cep');
    const destinationCepInput = document.getElementById('destination-cep');
    const weightInput = document.getElementById('weight');
    const resultContainer = document.getElementById('result-container');
    const freightResult = document.getElementById('freight-result');
    const errorMessage = document.getElementById('error-message');
    const loadingMessage = document.getElementById('loading-message');

    calculateBtn.addEventListener('click', async () => {
        // Limpa mensagens de erro e resultados anteriores
        errorMessage.textContent = '';
        resultContainer.style.display = 'none';

        const originCep = originCepInput.value.replace(/\D/g, '');
        const destinationCep = destinationCepInput.value.replace(/\D/g, '');
        const weight = parseFloat(weightInput.value);

        // Validação no frontend: verifica se os campos estão preenchidos
        if (!originCep || !destinationCep || isNaN(weight) || weight < 0) {
            errorMessage.textContent = 'Por favor, preencha todos os campos corretamente.';
            return;
        }

        // Início do estado de carregamento
        loadingMessage.style.display = 'block';
        calculateBtn.disabled = true;

        try {
            // A requisição agora envia os CEPs para o backend
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
        } finally {
            // Fim do estado de carregamento
            loadingMessage.style.display = 'none';
            calculateBtn.disabled = false;
        }
    });
});