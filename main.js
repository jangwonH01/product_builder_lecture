document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const resultsContainer = document.getElementById('lotto-results');
    const gameCountSelect = document.getElementById('game-count');
    const roundInfo = document.getElementById('round-info');

    // 대략적인 회차 계산 (2002년 12월 7일 1회차 기준)
    const firstDraw = new Date(2002, 11, 7);
    const now = new Date();
    const weeksDiff = Math.floor((now - firstDraw) / (7 * 24 * 60 * 60 * 1000));
    roundInfo.textContent = `제 ${weeksDiff}회차 기준`;

    generateBtn.addEventListener('click', generateNumbers);

    function generateNumbers() {
        const gameCount = parseInt(gameCountSelect.value);
        resultsContainer.innerHTML = '';

        const labels = ['A', 'B', 'C', 'D', 'E'];

        for (let i = 0; i < gameCount; i++) {
            const numbers = createNumberSet();
            const row = document.createElement('div');
            row.className = 'game-row';
            row.style.animationDelay = `${i * 0.1}s`;

            const label = document.createElement('div');
            label.className = 'game-label';
            label.textContent = labels[i];

            const numbersDiv = document.createElement('div');
            numbersDiv.className = 'game-numbers';

            numbers.forEach((num, idx) => {
                const ball = document.createElement('div');
                ball.className = `lotto-ball ${getBallColor(num)}`;
                ball.textContent = num;
                ball.style.animationDelay = `${i * 0.1 + idx * 0.08}s`;
                numbersDiv.appendChild(ball);
            });

            row.appendChild(label);
            row.appendChild(numbersDiv);
            resultsContainer.appendChild(row);
        }
    }

    function createNumberSet() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function getBallColor(num) {
        if (num <= 10) return 'ball-yellow';
        if (num <= 20) return 'ball-blue';
        if (num <= 30) return 'ball-red';
        if (num <= 40) return 'ball-gray';
        return 'ball-green';
    }
});