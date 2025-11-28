class RockPaperScissors {
    constructor() {
        this.userScore = 0;
        this.computerScore = 0;
        this.ties = 0;
        this.turnCount = 0;
        this.maxTurns = 10;
        this.playerName = localStorage.getItem('rps_playerName') || 'Player';
        this.init();
    }

    init() {
        document.getElementById('playerName').value = this.playerName;
        this.updateDisplay();
        this.loadLeaderboard();
        this.attachEvents();
    }

    attachEvents() {
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choice = e.currentTarget.dataset.choice;
                this.makeChoice(choice);
            });
        });
    }

    getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        return choices[Math.floor(Math.random() * 3)];
    }

    getWinner(user, computer) {
        if (user === computer) return 'tie';
        if (
            (user === 'rock' && computer === 'scissors') ||
            (user === 'paper' && computer === 'rock') ||
            (user === 'scissors' && computer === 'paper')
        ) return 'win';
        return 'lose';
    }

    createParticles(x, y, color = '#00ff88') {
        const container = document.getElementById('particles');
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = color;
            particle.style.animationDelay = (i * 0.05) + 's';
            container.appendChild(particle);
            setTimeout(() => particle.remove(), 2000);
        }
    }

    makeChoice(choice) {
        if (this.turnCount >= this.maxTurns) return;

        const computerChoice = this.getComputerChoice();
        const result = this.getWinner(choice, computerChoice);
        
        this.turnCount++;
        
        if (result === 'win') this.userScore++;
        else if (result === 'lose') this.computerScore++;
        else this.ties++;

        this.showResult(choice, computerChoice, result);
        this.updateDisplay();

        if (this.turnCount >= this.maxTurns) {
            setTimeout(() => this.showFinalResult(), 1500);
        }
    }

    showResult(user, computer, result) {
        const messageEl = document.getElementById('resultMessage');
        const messages = {
            win: `🎉 YOU WIN! ${user.toUpperCase()} beats ${computer}!`,
            lose: `😤 YOU LOSE! ${computer} beats ${user}!`,
            tie: `🤝 IT'S A TIE! Both chose ${user}!`
        };
        
        messageEl.textContent = messages[result];
        messageEl.className = `result-message show ${result}`;
        
        const rect = document.querySelector('.container').getBoundingClientRect();
        this.createParticles(
            rect.left + rect.width / 2, 
            rect.top + rect.height / 2,
            result === 'win' ? '#00ff88' : result === 'lose' ? '#ff4757' : '#ffa502'
        );
    }

    updateDisplay() {
        document.getElementById('userScore').textContent = this.userScore;
        document.getElementById('computerScore').textContent = this.computerScore;
        document.getElementById('ties').textContent = this.ties;
        document.getElementById('turnCount').textContent = this.turnCount;
        
        const progress = (this.turnCount / this.maxTurns) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
    }

    showFinalResult() {
        let message = '';
        if (this.userScore > this.computerScore) {
            message = `🏆 CHAMPION! ${this.userScore}-${this.computerScore}`;
        } else if (this.userScore < this.computerScore) {
            message = `💻 COMPUTER WINS! ${this.userScore}-${this.computerScore}`;
        } else {
            message = `🤝 PERFECT TIE! ${this.userScore}-${this.computerScore}`;
        }
        
        document.getElementById('resultMessage').innerHTML = 
            `<div style="font-size: 2.5rem; font-weight: 900;">${message}</div>`;
    }

    resetGame() {
        this.userScore = 0;
        this.computerScore = 0;
        this.ties = 0;
        this.turnCount = 0;
        document.getElementById('resultMessage').className = 'result-message';
        this.updateDisplay();
    }

    toggleLeaderboard() {
        const modal = document.getElementById('leaderboardModal');
        modal.classList.toggle('active');
    }

    saveScore() {
        localStorage.setItem('rps_highscore', Math.max(
            localStorage.getItem('rps_highscore') || 0, 
            this.userScore
        ));
        alert('Score saved locally!');
    }

    submitScore() {
        this.playerName = document.getElementById('playerName').value || 'Anonymous';
        localStorage.setItem('rps_playerName', this.playerName);
        
        const scores = JSON.parse(localStorage.getItem('rps_leaderboard') || '[]');
        scores.push({
            name: this.playerName,
            score: this.userScore,
            winRate: this.userScore / (this.userScore + this.computerScore) * 100 || 0,
            date: new Date().toLocaleDateString()
        });
        
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('rps_leaderboard', JSON.stringify(scores.slice(0, 10)));
        this.loadLeaderboard();
        this.toggleLeaderboard();
    }

    loadLeaderboard() {
        const scores = JSON.parse(localStorage.getItem('rps_leaderboard') || '[]');
        const tbody = document.querySelector('#leaderboardTable tbody');
        tbody.innerHTML = '';
        
        scores.forEach((score, index) => {
            const row = document.createElement('tr');
            row.className = index < 3 ? `rank-${index + 1}` : '';
            row.innerHTML = `
                <td>${index + 1} ${['🥇', '🥈', '🥉'][index] || ''}</td>
                <td>${score.name}</td>
                <td>${score.score}</td>
                <td>${score.winRate.toFixed(1)}%</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Initialize Game
const game = new RockPaperScissors();
