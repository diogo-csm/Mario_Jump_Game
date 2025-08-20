// Espera DOM
document.addEventListener('DOMContentLoaded', () => {
    // ==== Seletores ====
    const mario = document.querySelector('.mario');
    const pipe = document.querySelector('.pipe');
    const restartBtn = document.querySelector('.restart-btn');
    const startBtnBox = document.querySelector('.start-btn');
    const startBtn = startBtnBox?.querySelector('button');
    const countdownEl = document.querySelector('.countdown');
    const scoreEl = document.querySelector('.score');
    const bgMusic = document.getElementById('bg-music');

    // Validação
    if (!mario || !pipe || !restartBtn || !startBtnBox || !startBtn || !countdownEl) {
        console.error('Elemento obrigatório não encontrado.', { mario, pipe, restartBtn, startBtnBox, startBtn, countdownEl });
        return;
    }

    // Config
    const RESTART_WITH_COUNTDOWN = true;

    // Estado
    let gameOver = true;
    let loop = null;
    let score = 0;
    let scoreInterval = null;
    let isCounting = false;

    // ===== utilitários =====
    function clearLoops() {
        if (loop) { clearInterval(loop); loop = null; }
        if (scoreInterval) { clearInterval(scoreInterval); scoreInterval = null; }
    }

    function softReset() {
        clearLoops();

        restartBtn.style.visibility = 'hidden';
        startBtnBox.style.visibility = 'visible';

        mario.src = './img/mario.gif';
        mario.style.width = '80px';
        mario.style.left = '0px';
        mario.style.bottom = '0px';
        mario.style.animation = '';
        mario.classList.remove('jump');

        pipe.style.animation = 'none';
        pipe.style.left = '';

        countdownEl.style.visibility = 'hidden';
        countdownEl.style.opacity = '0';
        countdownEl.textContent = '';

        gameOver = true;
        score = 0;
        scoreEl.textContent = `Pontos: 0`;
        isCounting = false;
    }

    function showCountdown(seconds = 3, onDone) {
        startBtnBox.style.visibility = 'hidden';
        restartBtn.style.visibility = 'hidden';

        bgMusic.currentTime = 0;
        bgMusic.play();
        bgMusic.loop = true;

        isCounting = true;
        let n = seconds;

        countdownEl.textContent = n;
        countdownEl.style.visibility = 'visible';
        countdownEl.style.opacity = '1';

        const timer = setInterval(() => {
            n--;
            if (n > 0) {
                countdownEl.textContent = n;
            } else if (n === 0) {
                countdownEl.textContent = 'GO!';
            } else {
                clearInterval(timer);
                countdownEl.style.opacity = '0';
                setTimeout(() => {
                    countdownEl.style.visibility = 'hidden';
                    countdownEl.textContent = '';
                    isCounting = false;
                    if (typeof onDone === 'function') onDone();
                }, 250);
            }
        }, 1000);
    }

    function startGame() {
        clearLoops();
        startBtnBox.style.visibility = 'hidden';
        gameOver = false;
        pipe.style.animation = 'pipe-animation 1.5s infinite linear';
        score = 0;
        scoreEl.textContent = `Pontos: ${score}`;
        scoreInterval = setInterval(() => {
            score++;
            scoreEl.textContent = `Pontos: ${score}`;
        }, 100);
        loop = setInterval(checkCollision, 10);
    }

    function checkCollision() {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = parseFloat(getComputedStyle(mario).bottom) || 0;

        if (pipePosition <= 65 && pipePosition > 0 && marioPosition < 50) {
            pipe.style.animation = 'none';
            pipe.style.left = `${pipePosition}px`;
            mario.style.animation = 'none';
            mario.style.bottom = `${marioPosition}px`;
            mario.src = './img/game-over.png';
            mario.style.width = '40px';
            mario.style.left = '30px';
            restartBtn.style.visibility = 'visible';
            clearLoops();
            gameOver = true;
            bgMusic.pause();
        }
    }

    function jump() {
        if (gameOver || isCounting) return;
        if (!mario.classList.contains('jump')) {
            mario.classList.add('jump');
            setTimeout(() => mario.classList.remove('jump'), 500);
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            e.preventDefault();
            jump();
        }
    });
    document.addEventListener('touchstart', jump, { passive: true });

    startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isCounting) return;
        softReset();
        showCountdown(3, () => startGame());
    });

    restartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isCounting) return;
        softReset();
        if (RESTART_WITH_COUNTDOWN) {
            showCountdown(3, () => startGame());
        } else {
            startGame();
        }
    });

    softReset();
});