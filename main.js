class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                button {
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    margin: 20px 0;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: background-color 0.3s ease;
                }
                button:hover {
                    background-color: #45a049;
                }
                .lotto-numbers {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 20px;
                }
                .lotto-set {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 10px;
                }
                .lotto-number {
                    background-color: #333333;
                    color: #ffffff;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 5px;
                    font-size: 18px;
                    font-weight: bold;
                }
            </style>
            <button id="generate-btn">새 번호 생성</button>
            <div class="lotto-numbers"></div>
        `;

        this.generateBtn = this.shadowRoot.querySelector('#generate-btn');
        this.lottoNumbersContainer = this.shadowRoot.querySelector('.lotto-numbers');

        this.generateBtn.addEventListener('click', () => this.generateLottoNumbers());
    }

    generateLottoNumbers() {
        this.lottoNumbersContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const numberSet = this.createNumberSet();
            const lottoSetDiv = document.createElement('div');
            lottoSetDiv.classList.add('lotto-set');
            numberSet.forEach(number => {
                const lottoNumberDiv = document.createElement('div');
                lottoNumberDiv.classList.add('lotto-number');
                lottoNumberDiv.textContent = number;
                lottoSetDiv.appendChild(lottoNumberDiv);
            });
            this.lottoNumbersContainer.appendChild(lottoSetDiv);
        }
    }

    createNumberSet() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }
}

customElements.define('lotto-generator', LottoGenerator);