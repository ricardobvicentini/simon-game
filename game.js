'use strict';

const buttonColours = ['red', 'blue', 'green', 'yellow'];
let gamePattern = [];
let userClickedPattern = [];
let scores = [];
let highScore = [];
let started = false;
let displayMsgs = false;
let game = true;
let startMsgInterval;
let startMsgClick;
let level = 0;
let count = 0;
let players = 0;
let playersName = [];
console.log(playersName);

/* $(document).on('keydown', (e) => {
  if (!started) {
    $('#level-title').text(`Level ${level}`);
    nextSequence();
    started = true;
  }
});
 */

//* Functions
function displayStartMsg(element, t1, t2) {
  startMsgInterval = setInterval(() => {
    if (!displayMsgs) {
      if (!document.startViewTransition) {
        $(element).text('Press Start to Play');
        $('#level-title').addClass(`glow-title`);
      }
      document.startViewTransition(() => {
        $(element).text('Press Start to Play');
        $('#level-title').addClass(`glow-title`);
      });
    }
  }, t1);
  startMsgClick = setInterval(() => {
    if (!displayMsgs) {
      if (!document.startViewTransition) {
        $(element).text('Simon Game');
        $('#level-title').removeClass('glow-title');
      }
      document.startViewTransition(() => {
        $(element).text('Simon Game');
        $('#level-title').removeClass('glow-title');
      });
    }
  }, t2);
  glowMsg(element, 2500, 5000);
}

function glowMsg(element, t1, t2) {
  startMsgInterval = setInterval(() => {
    $(element).addClass('glow-title');
  }, t1);
  startMsgClick = setInterval(() => {
    $(element).removeClass('glow-title');
  }, t2);
}

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

function startOver() {
  started = false;
  level = 0;
  gamePattern = [];
  scoreBoardIn();
}

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      if (!document.startViewTransition) {
        nextSequence();
      }
      document.startViewTransition(() => {
        nextSequence();
      });
      repeatSequence(gamePattern);
    }
  } else {
    //* Score Board counting
    scores.push(level);
    count++;
    $('.score-board').append(
      `<p>Player ${count}: ${scores[scores.length - 1] - 1}</p>`
    );
    highScore.push(scores[scores.length - 1] - 1);

    if (count === players) {
      $('.score-board').append(
        `<p>Highest score: ${Math.max(...highScore)}</p>`
      );
      $('.score-board').append(`<button class='retry-btn'>Retry</button>`);
      glowMsg('.retry-btn', 1000, 5000);
      $('.retry-btn').on('click', () => {
        location.reload(true);
      });
    }

    playSound('wrong');
    $('body').addClass('game-over');
    setTimeout(() => {
      $('body').removeClass('game-over');
    }, 200);
    $('#level-title').text('Game Over! Press Start to Play');
    startOver();
  }
}

function repeatSequence(pattern) {
  pattern.forEach((colour, i) =>
    setTimeout(() => {
      $(`#${colour}`).fadeIn(100).fadeOut(100).fadeIn(100);
      playSound(colour);
      animatePress(colour);
    }, (i + 1) * 1000)
  );
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $('#level-title').text(`Level ${level}`);
  setTimeout(() => {
    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    $(`#${randomChosenColour}`).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
    animatePress(randomChosenColour);
  }, 1000 * (gamePattern.length + 1));
}

function playSound(name) {
  return new Audio(`sounds/${name}.mp3`).play();
}

function animatePress(currentColour) {
  $(`#${currentColour}`).addClass(`pressed-${currentColour}`);
  setTimeout(() => {
    $(`#${currentColour}`).removeClass(`pressed-${currentColour}`);
  }, 100);
}

//* Events
$(window).on('load', () => {
  if (!started) {
    displayStartMsg('#level-title', 2400, 4800);
  }
});

$(document).on('click', () => {
  if ($('.score-board').hasClass('active') && count !== players)
    scoreBoardOut();
});

/* $('.start-btn').on('click', () => {
  if (!started) {
    $('#level-title').text(`Level ${level}`);
    if (!document.startViewTransition) {
      nextSequence();
    }
    document.startViewTransition(() => {
      nextSequence();
    });
    started = true;
  }
  displayMsgs = true;
  clearInterval(startMsgInterval);
  clearInterval(startMsgClick);
  $('#level-title').removeClass('glow-title');
}); */

function repeatAppendEl(num) {
  for (let i = 0; i < num; i++) {
    $('.p-name-ok-btn').before(
        i + 1
      }:</span><input class="p-name" type="text" maxlength="20" autocomplete="off" /></div>`
    );
  }
}

function displayModals() {
  $('.overlay').removeClass('hidden');
  // Event 1
  $('.p-num-ok-btn').on('click', () => {
    if (!$('#p-num').val()) $('#p-num').css('border-color', 'red');
    else {
      $('#p-num').css('border-color', 'black');
      players = $('#p-num').val();
      $('#p-num').val('');
      $('.players-num').addClass('hidden');

      $('.players-name').removeClass('hidden');
      repeatAppendEl(players);
    }

    // Event 2
    $('.p-name-ok-btn').on('click', () => {
      if (!$('.p-name').val()) $('.p-name').css('border-color', 'red');
      else {
        $('.name-input').css('border-color', 'black');
        $('.p-name').css('border-color', 'black');
        $('.p-name').each((i, input) => {
          const name = input.value[0].toUpperCase() + input.value.slice(1, -1);
          playersName.push(name);
        });

        $('.start-btn').addClass('glow-btn');
        $('.overlay').addClass('hidden');
        $('.players-name').addClass('hidden');
        game = false;
        started = true;
      }
    });
  });
}

//* Fix here!!!!
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
    if (!document.startViewTransition) {
      nextSequence();
    }
    document.startViewTransition(() => {
      nextSequence();
    });
  }
});

$('.btn').on('click', function () {
  const userChosenColour = $(this).attr('id');
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
});
