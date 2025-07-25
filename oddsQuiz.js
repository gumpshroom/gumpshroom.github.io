// Texas Hold'em Odds Quiz Game Logic

class PokerOddsQuiz {
    constructor() {
        this.suits = ['♠', '♥', '♦', '♣'];
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
        this.currentSituation = null;
        this.stats = this.loadStats();
        this.currentMode = 'quiz'; // 'quiz' or 'calculator'
        
        this.initializeTheme();
        this.initializePWA();
        this.initializeEventListeners();
        this.updateSliderValues();
        this.updateStatsDisplay();
        this.generateNewHand();
    }

    initializeTheme() {
        // Load saved theme
        const savedTheme = localStorage.getItem('poker-quiz-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    initializePWA() {
        // Check if PWA can be installed
        let deferredPrompt;
        const installButton = document.getElementById('install-btn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installButton.style.display = 'flex';
        });

        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    installButton.style.display = 'none';
                }
                deferredPrompt = null;
            }
        });

        // Hide install button if already installed
        window.addEventListener('appinstalled', () => {
            installButton.style.display = 'none';
        });
    }

    initializeEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

        // Mode toggle
        document.getElementById('quiz-mode').addEventListener('click', () => this.switchMode('quiz'));
        document.getElementById('calc-mode').addEventListener('click', () => this.switchMode('calculator'));

        // Slider value updates
        const sliders = ['pot-odds', 'equity', 'bluff-rate', 'implied-odds', 'reverse-implied'];
        sliders.forEach(id => {
            const slider = document.getElementById(id);
            if (slider) {
                const valueSpan = document.getElementById(id + '-value');
                slider.addEventListener('input', () => {
                    valueSpan.textContent = slider.value + '%';
                });
            }
        });

        // Quiz mode button listeners
        document.getElementById('submit-answer').addEventListener('click', () => this.submitAnswer());
        document.getElementById('new-hand').addEventListener('click', () => this.generateNewHand());
        document.getElementById('reset-stats').addEventListener('click', () => this.resetStats());

        // Calculator mode listeners
        document.getElementById('calculate-odds').addEventListener('click', () => this.calculateCustomOdds());
        document.getElementById('calc-stage').addEventListener('change', () => this.updateCalculatorBoard());
        
        // Initialize calculator board visibility
        this.updateCalculatorBoard();
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('poker-quiz-theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#theme-toggle .material-symbols-outlined');
        themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        document.getElementById('quiz-mode').classList.toggle('active', mode === 'quiz');
        document.getElementById('calc-mode').classList.toggle('active', mode === 'calculator');
        
        // Show/hide sections
        document.getElementById('quiz-section').classList.toggle('active', mode === 'quiz');
        document.getElementById('calculator-section').classList.toggle('active', mode === 'calculator');
    }

    updateCalculatorBoard() {
        const stage = document.getElementById('calc-stage').value;
        const turnCard = document.getElementById('turn-card');
        const riverCard = document.getElementById('river-card');
        
        turnCard.style.display = stage === 'flop' ? 'none' : 'flex';
        riverCard.style.display = stage === 'river' ? 'flex' : 'none';
    }

    calculateCustomOdds() {
        const stage = document.getElementById('calc-stage').value;
        const potSize = parseInt(document.getElementById('calc-pot-size').value);
        const betSize = parseInt(document.getElementById('calc-bet-size').value);
        
        // Get hero cards
        const heroCard1 = this.getCardFromSelectors('hero-card1');
        const heroCard2 = this.getCardFromSelectors('hero-card2');
        
        if (!heroCard1 || !heroCard2) {
            alert('Please select both hero cards');
            return;
        }
        
        // Get board cards
        const boardCards = [];
        const requiredBoardCards = stage === 'flop' ? 3 : stage === 'turn' ? 4 : 5;
        
        for (let i = 1; i <= 5; i++) {
            const card = this.getCardFromSelectors(`board-card${i}`);
            if (i <= requiredBoardCards) {
                if (!card) {
                    alert(`Please select all ${requiredBoardCards} board cards for ${stage}`);
                    return;
                }
                boardCards.push(card);
            }
        }
        
        // Check for duplicate cards
        const allCards = [heroCard1, heroCard2, ...boardCards];
        const cardStrings = allCards.map(card => card.rank + card.suit);
        const uniqueCards = new Set(cardStrings);
        
        if (uniqueCards.size !== allCards.length) {
            alert('Duplicate cards detected. Please ensure all cards are unique.');
            return;
        }
        
        // Create situation object
        const situation = {
            stage,
            heroCards: [heroCard1, heroCard2],
            communityCards: boardCards,
            potSize,
            betSize,
            deck: this.getRemainingDeck(allCards)
        };
        
        // Calculate and display results
        const results = this.calculateCorrectAnswers(situation);
        this.displayCalculatorResults(results);
    }

    getCardFromSelectors(prefix) {
        const rank = document.getElementById(`${prefix}-rank`).value;
        const suit = document.getElementById(`${prefix}-suit`).value;
        
        if (!rank || !suit) return null;
        return { rank, suit };
    }

    getRemainingDeck(usedCards) {
        const deck = this.createDeck();
        const usedCardStrings = usedCards.map(card => card.rank + card.suit);
        
        return deck.filter(card => {
            const cardString = card.rank + card.suit;
            return !usedCardStrings.includes(cardString);
        });
    }

    displayCalculatorResults(results) {
        document.getElementById('calc-results').style.display = 'block';
        document.getElementById('calc-pot-odds').textContent = results.potOdds.toFixed(1) + '%';
        document.getElementById('calc-equity').textContent = results.equity.toFixed(1) + '%';
        document.getElementById('calc-bluff-rate').textContent = results.bluffRate.toFixed(1) + '%';
        
        // Calculate EV of call
        const ev = (results.equity / 100) * (results.potOdds / 100) - (results.betSize / (results.potSize + results.betSize));
        document.getElementById('calc-ev').textContent = ev.toFixed(2);
        
        // Scroll to results
        document.getElementById('calc-results').scrollIntoView({ behavior: 'smooth' });
    }

    updateSliderValues() {
        const sliders = ['pot-odds', 'equity', 'bluff-rate', 'implied-odds', 'reverse-implied'];
        sliders.forEach(id => {
            const slider = document.getElementById(id);
            const valueSpan = document.getElementById(id + '-value');
            valueSpan.textContent = slider.value + '%';
        });
    }

    generateNewHand() {
        // Hide results
        document.getElementById('results').style.display = 'none';
        
        // Generate random stage (flop, turn, or river)
        const stages = ['flop', 'turn', 'river'];
        const stage = stages[Math.floor(Math.random() * stages.length)];
        
        // Generate deck and deal cards
        const deck = this.createDeck();
        this.shuffleDeck(deck);
        
        // Deal hero cards
        const heroCards = [deck.pop(), deck.pop()];
        
        // Deal community cards based on stage
        let communityCards = [];
        if (stage === 'flop') {
            communityCards = [deck.pop(), deck.pop(), deck.pop()];
        } else if (stage === 'turn') {
            communityCards = [deck.pop(), deck.pop(), deck.pop(), deck.pop()];
        } else { // river
            communityCards = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()];
        }
        
        // Generate pot and bet sizes
        const potSize = Math.floor(Math.random() * 400) + 50; // 50-450
        const betSize = Math.floor(potSize * (0.3 + Math.random() * 0.8)); // 30-110% of pot
        
        this.currentSituation = {
            stage,
            heroCards,
            communityCards,
            potSize,
            betSize,
            deck: [...deck] // Remaining deck for equity calculations
        };
        
        this.displaySituation();
    }

    createDeck() {
        const deck = [];
        for (let suit of this.suits) {
            for (let rank of this.ranks) {
                deck.push({ rank, suit });
            }
        }
        return deck;
    }

    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    displaySituation() {
        const situation = this.currentSituation;
        
        // Update stage and betting info
        document.getElementById('stage').textContent = situation.stage.charAt(0).toUpperCase() + situation.stage.slice(1);
        document.getElementById('pot-size').textContent = situation.potSize;
        document.getElementById('bet-size').textContent = situation.betSize;
        
        // Display hero cards
        const heroCardsEl = document.getElementById('hero-cards');
        heroCardsEl.innerHTML = '';
        situation.heroCards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.textContent = card.rank + card.suit;
            heroCardsEl.appendChild(cardEl);
        });
        
        // Display community cards
        const communityCardsEl = document.getElementById('community-cards');
        communityCardsEl.innerHTML = '';
        
        // Show known community cards
        situation.communityCards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.textContent = card.rank + card.suit;
            communityCardsEl.appendChild(cardEl);
        });
        
        // Show hidden cards for incomplete boards
        const totalCommunityCards = 5;
        const hiddenCards = totalCommunityCards - situation.communityCards.length;
        for (let i = 0; i < hiddenCards; i++) {
            const cardEl = document.createElement('div');
            cardEl.className = 'card hidden';
            cardEl.textContent = '?';
            communityCardsEl.appendChild(cardEl);
        }
    }

    calculateCorrectAnswers(situation = null) {
        const currentSituation = situation || this.currentSituation;
        
        // Calculate pot odds
        const potOdds = (currentSituation.betSize / (currentSituation.potSize + currentSituation.betSize)) * 100;
        
        // Calculate equity (simplified Monte Carlo simulation)
        const equity = this.calculateEquity(currentSituation);
        
        // Calculate villain's profitable bluff rate
        // Formula: (Pot Size) / (Pot Size + Bet Size) * 100
        const bluffRate = (currentSituation.potSize / (currentSituation.potSize + currentSituation.betSize)) * 100;
        
        // Calculate implied odds (estimated based on hand strength and position)
        const impliedOdds = this.calculateImpliedOdds(currentSituation, equity);
        
        // Calculate reverse implied odds (estimated based on hand vulnerability)
        const reverseImpliedOdds = this.calculateReverseImpliedOdds(currentSituation, equity);
        
        return {
            potOdds: Math.round(potOdds * 100) / 100,
            equity: Math.round(equity * 100) / 100,
            bluffRate: Math.round(bluffRate * 100) / 100,
            impliedOdds: Math.round(impliedOdds * 100) / 100,
            reverseImpliedOdds: Math.round(reverseImpliedOdds * 100) / 100,
            potSize: currentSituation.potSize,
            betSize: currentSituation.betSize
        };
    }

    calculateEquity(situation) {
        // Simplified equity calculation
        // This is a basic implementation - a full Monte Carlo would be more accurate
        const handStrength = this.evaluateHandStrength(situation.heroCards, situation.communityCards);
        const outs = this.calculateOuts(situation.heroCards, situation.communityCards);
        
        let equity;
        if (situation.stage === 'flop') {
            // Two cards to come
            equity = (outs * 4) - (outs - 8) * (outs > 8 ? 1 : 0);
        } else if (situation.stage === 'turn') {
            // One card to come
            equity = outs * 2.2;
        } else {
            // River - current hand strength
            equity = handStrength;
        }
        
        return Math.min(Math.max(equity, 5), 95); // Clamp between 5% and 95%
    }

    evaluateHandStrength(heroCards, communityCards) {
        // Simplified hand strength evaluation
        const allCards = [...heroCards, ...communityCards];
        
        // Check for pairs, draws, etc.
        const ranks = allCards.map(card => card.rank);
        const suits = allCards.map(card => card.suit);
        
        const rankCounts = {};
        ranks.forEach(rank => rankCounts[rank] = (rankCounts[rank] || 0) + 1);
        
        const suitCounts = {};
        suits.forEach(suit => suitCounts[suit] = (suitCounts[suit] || 0) + 1);
        
        // Basic hand evaluation
        const pairs = Object.values(rankCounts).filter(count => count >= 2).length;
        const flushDraw = Math.max(...Object.values(suitCounts)) >= 4;
        const straightDraw = this.hasStraightDraw(ranks);
        
        if (pairs >= 2) return 80; // Two pair or better
        if (pairs === 1) return 60; // One pair
        if (flushDraw) return 40; // Flush draw
        if (straightDraw) return 35; // Straight draw
        
        // High card evaluation
        const heroRanks = heroCards.map(card => this.ranks.indexOf(card.rank));
        const maxHeroRank = Math.max(...heroRanks);
        return 15 + (maxHeroRank * 2); // 15-39% based on high card
    }

    calculateOuts(heroCards, communityCards) {
        // Simplified outs calculation
        const allCards = [...heroCards, ...communityCards];
        const ranks = allCards.map(card => card.rank);
        const suits = allCards.map(card => card.suit);
        
        let outs = 0;
        
        // Count potential outs for pairs, straights, flushes
        const rankCounts = {};
        ranks.forEach(rank => rankCounts[rank] = (rankCounts[rank] || 0) + 1);
        
        const suitCounts = {};
        suits.forEach(suit => suitCounts[suit] = (suitCounts[suit] || 0) + 1);
        
        // Flush outs
        const maxSuitCount = Math.max(...Object.values(suitCounts));
        if (maxSuitCount === 4) outs += 9; // Flush draw
        
        // Straight outs (simplified)
        if (this.hasStraightDraw(ranks)) outs += 8;
        
        // Pair outs
        heroCards.forEach(card => {
            if (!ranks.includes(card.rank) || rankCounts[card.rank] === 1) {
                outs += 3; // Three cards to make a pair
            }
        });
        
        return Math.min(outs, 15); // Cap at 15 outs
    }

    hasStraightDraw(ranks) {
        const uniqueRanks = [...new Set(ranks)].map(rank => this.ranks.indexOf(rank)).sort((a, b) => a - b);
        
        // Check for open-ended straight draws
        for (let i = 0; i < uniqueRanks.length - 2; i++) {
            if (uniqueRanks[i + 1] === uniqueRanks[i] + 1 && uniqueRanks[i + 2] === uniqueRanks[i] + 2) {
                return true;
            }
        }
        return false;
    }

    calculateImpliedOdds(situation, equity) {
        // Implied odds estimation based on hand potential and stage
        let impliedMultiplier = 1;
        
        if (situation.stage === 'flop') impliedMultiplier = 1.5;
        else if (situation.stage === 'turn') impliedMultiplier = 1.2;
        else impliedMultiplier = 1.0; // River has no implied odds
        
        const potOdds = (situation.betSize / (situation.potSize + situation.betSize)) * 100;
        const impliedOdds = potOdds / impliedMultiplier;
        
        return Math.max(impliedOdds, potOdds * 0.8); // At least 80% of pot odds
    }

    calculateReverseImpliedOdds(situation, equity) {
        // Reverse implied odds estimation
        let reverseMultiplier = 1;
        
        // Higher reverse implied odds for vulnerable draws
        if (equity < 30) reverseMultiplier = 1.3;
        else if (equity < 50) reverseMultiplier = 1.15;
        else reverseMultiplier = 1.0;
        
        const potOdds = (situation.betSize / (situation.potSize + situation.betSize)) * 100;
        return potOdds * reverseMultiplier;
    }

    submitAnswer() {
        const userAnswers = {
            potOdds: parseFloat(document.getElementById('pot-odds').value),
            equity: parseFloat(document.getElementById('equity').value),
            bluffRate: parseFloat(document.getElementById('bluff-rate').value),
            impliedOdds: parseFloat(document.getElementById('implied-odds').value),
            reverseImpliedOdds: parseFloat(document.getElementById('reverse-implied').value)
        };
        
        const correctAnswers = this.calculateCorrectAnswers();
        const scores = this.calculateScores(userAnswers, correctAnswers);
        
        this.displayResults(userAnswers, correctAnswers, scores);
        this.updateStats(scores);
        this.updateStatsDisplay();
    }

    calculateScores(userAnswers, correctAnswers) {
        const scores = {};
        let totalScore = 0;
        
        Object.keys(userAnswers).forEach(key => {
            const userValue = userAnswers[key];
            const correctValue = correctAnswers[key];
            const difference = Math.abs(userValue - correctValue);
            
            // Score based on how close the answer is (100 = perfect, 0 = >20% off)
            const score = Math.max(0, 100 - (difference * 5));
            scores[key] = Math.round(score);
            totalScore += score;
        });
        
        scores.overall = Math.round(totalScore / Object.keys(userAnswers).length);
        return scores;
    }

    displayResults(userAnswers, correctAnswers, scores) {
        const resultsEl = document.getElementById('results');
        const correctAnswersEl = document.getElementById('correct-answers');
        const scoreEl = document.getElementById('score');
        
        // Display correct answers
        correctAnswersEl.innerHTML = `
            <h3>Correct Answers:</h3>
            <p><strong>Pot Odds:</strong> ${correctAnswers.potOdds}% (You: ${userAnswers.potOdds}%) - Score: ${scores.potOdds}/100</p>
            <p><strong>Your Equity:</strong> ${correctAnswers.equity}% (You: ${userAnswers.equity}%) - Score: ${scores.equity}/100</p>
            <p><strong>Villain's Profitable Bluff Rate:</strong> ${correctAnswers.bluffRate}% (You: ${userAnswers.bluffRate}%) - Score: ${scores.bluffRate}/100</p>
            <p><strong>Implied Odds:</strong> ${correctAnswers.impliedOdds}% (You: ${userAnswers.impliedOdds}%) - Score: ${scores.impliedOdds}/100</p>
            <p><strong>Reverse Implied Odds:</strong> ${correctAnswers.reverseImpliedOdds}% (You: ${userAnswers.reverseImpliedOdds}%) - Score: ${scores.reverseImpliedOdds}/100</p>
        `;
        
        // Display overall score
        const overallScore = scores.overall;
        scoreEl.textContent = `Overall Score: ${overallScore}/100`;
        
        // Color code the score
        scoreEl.className = 'score';
        if (overallScore >= 80) scoreEl.classList.add('excellent');
        else if (overallScore >= 65) scoreEl.classList.add('good');
        else if (overallScore >= 50) scoreEl.classList.add('fair');
        else scoreEl.classList.add('poor');
        
        resultsEl.style.display = 'block';
    }

    updateStats(scores) {
        Object.keys(scores).forEach(key => {
            if (!this.stats[key]) this.stats[key] = [];
            this.stats[key].push(scores[key]);
        });
        
        this.saveStats();
    }

    updateStatsDisplay() {
        const categories = ['potOdds', 'equity', 'bluffRate', 'impliedOdds', 'reverseImpliedOdds', 'overall'];
        const displayNames = {
            'potOdds': 'pot-odds-avg',
            'equity': 'equity-avg',
            'bluffRate': 'bluff-rate-avg',
            'impliedOdds': 'implied-odds-avg',
            'reverseImpliedOdds': 'reverse-implied-avg',
            'overall': 'overall-avg'
        };
        
        categories.forEach(category => {
            const elementId = displayNames[category];
            const element = document.getElementById(elementId);
            
            if (this.stats[category] && this.stats[category].length > 0) {
                const average = this.stats[category].reduce((a, b) => a + b, 0) / this.stats[category].length;
                const count = this.stats[category].length;
                element.textContent = `${Math.round(average)}/100 (${count} hands)`;
            } else {
                element.textContent = '-';
            }
        });
    }

    loadStats() {
        const stored = localStorage.getItem('pokerOddsQuizStats');
        return stored ? JSON.parse(stored) : {};
    }

    saveStats() {
        localStorage.setItem('pokerOddsQuizStats', JSON.stringify(this.stats));
    }

    resetStats() {
        if (confirm('Are you sure you want to reset all statistics?')) {
            this.stats = {};
            this.saveStats();
            this.updateStatsDisplay();
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PokerOddsQuiz();
});