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
  const RESTART_WITH_COUNTDOWN = true; // se quiser contagem também no restart, true

  // Estado
  let gameOver = true;      // travado até apertar START
  let loop = null;
  let score = 0;
  let scoreInterval = null;
  let isCounting = false;   // trava durante a contagem para evitar inputs repetidos

  // ===== utilitários =====
  function clearLoops() {
    if (loop) { clearInterval(loop); loop = null; }
    if (scoreInterval) { clearInterval(scoreInterval); scoreInterval = null; }
  }

  // Põe a tela "no menu" / prepara estado inicial (sem movimentos)
  function softReset() {
    clearLoops();

    // Botões
    restartBtn.style.visibility = 'hidden';
    startBtnBox.style.visibility = 'visible';

    // Mario no estado inicial
    mario.src = './img/mario.gif';
    mario.style.width = '150px';
    mario.style.left = '0px';
    mario.style.bottom = '0px';
    mario.style.animation = '';
    mario.classList.remove('jump');

    // Pipe parado (sem animação) até começar o jogo
    pipe.style.animation = 'none';
    pipe.style.left = '';

    // Contagem escondida
    countdownEl.style.visibility = 'hidden';
    countdownEl.style.opacity = '0';
    countdownEl.textContent = '';

    // Estado e pontuação
    gameOver = true;
    score = 0;
    scoreEl.textContent = `Pontos: 0`; // ← reseta a HUD também
    isCounting = false;
  }

  // Mostra contagem (ex.: 3,2,1, GO) e chama onDone quando terminar
  function showCountdown(seconds = 3, onDone) {
    // Esconde botões para ficar tudo limpo e garante que o overlay fique visível sobre tudo
    startBtnBox.style.visibility = 'hidden';
    restartBtn.style.visibility = 'hidden';

    //Música de fundo
    bgMusic.currentTime = 0; // começa do início
    bgMusic.play();          // toca
    bgMusic.loop = true;     // repete

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
        // Fade out e esconder
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

  // Inicia o jogo de fato (liga animação do pipe, pontuação e checagem de colisão)
  function startGame() {
    clearLoops();

    // Garante que o botão START esteja escondido
    startBtnBox.style.visibility = 'hidden';

    // Destrava o jogo
    gameOver = false;

    // Ativa a animação do pipe
    pipe.style.animation = 'pipe-animation 1.5s infinite linear';

    // Inicia pontuação
    score = 0;
    scoreEl.textContent = `Pontos: ${score}`;
    scoreInterval = setInterval(() => {
      score++;
      scoreEl.textContent = `Pontos: ${score}`;
    }, 100);

    // Loop de colisão
    loop = setInterval(checkCollision, 10);
  }

  // Checa colisão Mario x Pipe
  function checkCollision() {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = parseFloat(getComputedStyle(mario).bottom) || 0;

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
      // Congela pipe
      pipe.style.animation = 'none';
      pipe.style.left = `${pipePosition}px`;

      // Congela Mario e troca sprite
      mario.style.animation = 'none';
      mario.style.bottom = `${marioPosition}px`;
      mario.src = './img/game-over.png';
      mario.style.width = '75px';
      mario.style.left = '50px';

      // Mostra Restart
      restartBtn.style.visibility = 'visible';

      // Para loops
      clearLoops();
      gameOver = true;

      //parar a musica
      bgMusic.pause();

    }
  }

  // Pulo (teclado/toque)
  function jump() {
    if (gameOver || isCounting) return; // não permite pular no menu ou durante contagem
    if (!mario.classList.contains('jump')) {
      mario.classList.add('jump');
      setTimeout(() => mario.classList.remove('jump'), 500);
    }
  }

  document.addEventListener('keydown', jump);
  document.addEventListener('touchstart', jump, { passive: true });

  // ===== LISTENERS DO START / RESTART =====

  // START (prepara, conta e inicia)
  startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isCounting) return; // evita clique duplo
    softReset();            // garante estado inicial limpo (stop pipes, sprite, etc)
    showCountdown(3, () => startGame());
  });

  // RESTART (sempre faz softReset antes de iniciar)
  restartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isCounting) return;
    // Sempre reseta o estado antes de iniciar (isso corrige o problema)
    softReset();

    if (RESTART_WITH_COUNTDOWN) {
      showCountdown(3, () => startGame());
    } else {
      startGame();
    }
  });

  // Estado inicial
  softReset();
});
