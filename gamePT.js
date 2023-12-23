'use strict';

const buttonColours = ['red', 'blue', 'green', 'yellow'];
let gamePattern = [];
let userClickedPattern = [];
let scores = [];
let highScore = [];
let started = false;
let game = true;
let displayMsgs = false;
let startMsgInterval;
let startMsgClick;
let time = 15;
let timeOver = false;
let level = 0;
let count = 0;
let players;
let playersName = [];
let leaderBoard = [];

const storedLeaderBoard = JSON.parse(localStorage.getItem('leaderBoard'));
if (storedLeaderBoard) {
  leaderBoard = storedLeaderBoard;
}

//* Functions / Funções
// Start message / Mensagem inicial
function displayStartMsg(element, t1, t2) {
  startMsgInterval = setInterval(() => {
    if (!displayMsgs) {
      $(element).text('Pressione Jogar');
      $('#level-title').addClass(`glow-title`);
    }
  }, t1);
  startMsgClick = setInterval(() => {
    if (!displayMsgs) {
      $(element).text('Jogo da Memória');
      $('#level-title').removeClass('glow-title');
    }
  }, t2);
  glowMsg(element, 2500, 5000);
}

// Glow function / Função brilhar texto
function glowMsg(element, t1, t2) {
  startMsgInterval = setInterval(() => {
    $(element).addClass('glow-title');
  }, t1);
  startMsgClick = setInterval(() => {
    $(element).removeClass('glow-title');
  }, t2);
}

// Wrong answer-time's up function / Função resposta errada-acabou o tempo
function wrongAnswer() {
  playSound('wrong');
  $('body').addClass('game-over');
  setTimeout(() => {
    $('body').removeClass('game-over');
  }, 200);
  $('#level-title').text('Fim de Jogo! Pressione Jogar');
  startOver();
}

// Scoreboard slide in and out / Deslizar placar
function scoreBoardIn() {
  setTimeout(() => {
    $('.score-board').addClass('active');
    $('.score-board').animate({ left: '-10%' });
  }, 800);
}

function scoreBoardOut() {
  $('.score-board').removeClass('active');
  $('.score-board').animate({ left: '-100%' });
}

// Leaderboard / Placar dos melhores
function addScore(arr) {
  let sorted = arr.sort((a, b) => b.score - a.score);
  for (let i = 0; i < sorted.length; i++) {
    sorted[i].formattedScore =
      i === 0
        ? `${'🥇'}`
        : i === 1
        ? `${'🥈'}`
        : i === 2
        ? `${'🥉'}`
        : `${'🎗️'}`;
  }
  return sorted;
}

// Reset game / Reiniciar jogo
function startOver() {
  started = false;
  level = 0;
  gamePattern = [];
  scoreBoardIn();
  if (count !== playersName.length) $('.start-btn').addClass('glow-btn');
}

// Answer checking / Verificação da resposta
function checkAnswer(currentLevel) {
  players = $('#p-num').val();
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      nextSequence();
      repeatSequence(gamePattern);
    }
  } else {
    // Scoreboard counting / Contagem do placar
    scores.push(level);
    count++;
    $('.score-board').append(
      `<p>${playersName[count - 1]}: ${scores[scores.length - 1] - 1}</p>`
    );
    highScore.push(scores[scores.length - 1] - 1);

    if (count === playersName.length) {
      const highestScore = Math.max(...highScore);
      const highestScoreindex = highScore.indexOf(highestScore);

      leaderBoard.push({
        playerName: playersName[highestScoreindex],
        score: highestScore,
      });

      let draw;
      if (playersName.length > 1) {
        draw = scores.every((el) => el - 1 === highestScore);
      }

      if (draw) {
        $('.score-board').append(`<p>Empate: ${highestScore}</p>`);
      } else {
        $('.score-board').append(
          `<p>Pontuação mais alta (${playersName[highestScoreindex]}): ${highestScore}</p>`
        );

        // Leaderboard / Placar dos melhores
        leaderBoard = addScore(leaderBoard);
        setLocalStorage();
      }

      $('.score-board').append(
        `<button class='retry-btn'>Tente novamente</button>`
      );
      glowMsg('.retry-btn', 1000, 5000);
      $('.retry-btn').on('click', () => {
        location.reload(true);
      });
    }

    wrongAnswer();
  }
}

// Repeat sequence / Repetir sequência
function repeatSequence(pattern) {
  pattern.forEach((colour, i) =>
    setTimeout(() => {
      $(`#${colour}`).fadeIn(100).fadeOut(100).fadeIn(100);
      playSound(colour);
      animatePress(colour);
    }, (i + 1) * 1000)
  );
}

// Next sequence / Próxima sequência
function nextSequence() {
  userClickedPattern = [];
  level++;
  $('#level-title').text(`${playersName[count]} - Nível ${level}`);
  setTimeout(() => {
    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    $(`#${randomChosenColour}`).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
    animatePress(randomChosenColour);
  }, 1000 * (gamePattern.length + 1));
}

// Sound function / Função para tocar sons
function playSound(name) {
  return new Audio(`sounds/${name}.mp3`).play();
}

// Button color (pressed) / Acender botões (pressionados)
function animatePress(currentColour) {
  $(`#${currentColour}`).addClass(`pressed-${currentColour}`);
  setTimeout(() => {
    $(`#${currentColour}`).removeClass(`pressed-${currentColour}`);
  }, 100);
}

// Add inputs for players' name / Adicionar inputs para nomes dos jogadores
function repeatAppendEl(num) {
  for (let i = 0; i < num; i++) {
    $('.p-name-ok-btn').before(
      `<div><span>P${
        i + 1
      }:</span><input class="p-name" type="text" maxlength="20" autocomplete="off" /></div>`
    );
  }
}

// Display modals / Exibir modais
function displayModals() {
  $('.overlay').removeClass('hidden');
  $('.players-num').removeClass('hidden');
  // Event 1
  $('#p-num').focus();
  $('.p-num-ok-btn').on('click', () => {
    if (!$('#p-num').val()) $('#p-num').css('border-color', 'red');
    else {
      $('#p-num').css('border-color', 'black');
      players = $('#p-num').val();
      $('#p-num').val('');
      $('.players-num').addClass('hidden');

      $('.players-name').removeClass('hidden');
      repeatAppendEl(players);
      $('.p-name').first().focus();
    }

    // Event 2
    $('.p-name').on('blur', () => {
      $('.p-name').css({ 'border-color': 'black', 'border-width': '1px' });
    });

    // Event 3
    $('.p-name-ok-btn').on('click', () => {
      const anyEmpty = $('.p-name').is((i, input) => {
        return !input.value;
      });
      if (anyEmpty) $('.p-name').css('border-color', 'red');
      else {
        $('.p-name').each((i, input) => {
          const name =
            input.value[0].toUpperCase() + input.value.slice(1).toLowerCase();
          playersName.push(name);
        });
        $('.overlay').addClass('hidden');
        $('.players-name').addClass('hidden');
        game = false;
        started = true;

        if (started) {
          nextSequence();
        }
      }
    });
  });
}

//* Events
$(window).on('load', () => {
  if (!started) {
    displayStartMsg('#level-title', 2500, 5000);
  }
});

$(document).on('click', () => {
  if ($('.score-board').hasClass('active') && count !== playersName.length)
    scoreBoardOut();
});

$('.start-btn').on('click', () => {
  $('.start-btn').removeClass('glow-btn');
  $('#level-title').removeClass('glow-title');
  displayMsgs = true;
  clearInterval(startMsgInterval);
  clearInterval(startMsgClick);
  $('#level-title').removeClass('glow-title');
  if (game) {
    displayModals();
  }
  if (!game) {
    nextSequence();
  }
});

$('.btn').on('click', function () {
  const userChosenColour = $(this).attr('id');
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
});

// Leaderboard btns / Botões do Placar dos Melhores
$('#trophy-btn').on('click', () => {
  if (count !== playersName.length || playersName.length === 0)
    $('.leader-board').css('bottom', '-5%');
});

$('#close-btn').on('click', () => {
  $('.leader-board').css('bottom', '-100%');
});

$('#reset-btn').on('click', () => {
  $('.overlay').removeClass('hidden');
  $('.confirm-reset').removeClass('hidden');
});

$('.n-btn').on('click', () => {
  $('.overlay').addClass('hidden');
  $('.confirm-reset').addClass('hidden');
});

$('.y-btn').on('click', () => {
  $('.overlay').addClass('hidden');
  $('.confirm-reset').addClass('hidden');
  reset();
});

//* Local storage
const setLocalStorage = () => {
  localStorage.setItem('leaderBoard', JSON.stringify(leaderBoard));
};

const getLocalStorage = () => {
  const info = JSON.parse(localStorage.getItem('leaderBoard'));
  if (!info) return;
  leaderBoard = info;
  leaderBoard.reverse().forEach((el) => {
    $('h5').after(`<p>${el.formattedScore} ${el.playerName}: ${el.score}</p>`);
  });
};

getLocalStorage();

const reset = () => {
  localStorage.removeItem('leaderBoard');
  location.reload();
};
