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
let players;
let playersName = [];

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
  if (count !== playersName.length) $('.start-btn').addClass('glow-btn');
}

function checkAnswer(currentLevel) {
  players = $('#p-num').val();
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
    //* Scoreboard counting
    console.log('Count:', count);
    console.log('Players:', playersName);
    console.log(playersName.length);

    scores.push(level);
    count++;
    $('.score-board').append(
      `<p>${playersName[count - 1]}: ${scores[scores.length - 1] - 1}</p>`
    );
    highScore.push(scores[scores.length - 1] - 1);

    if (count === playersName.length) {
      const highestScore = Math.max(...highScore);
      const highestScoreindex = highScore.indexOf(highestScore);

      let draw;
      if (playersName.length > 1) {
        draw = scores.every((el) => el - 1 === highestScore);
      }

      if (draw) {
        $('.score-board').append(`<p>Draw: ${highestScore}</p>`);
      } else {
        $('.score-board').append(
          `<p>Highest score (${playersName[highestScoreindex]}): ${highestScore}</p>`
        );

        // Leaderboard
        $('.leader-board').append(
          `<p>${playersName[highestScoreindex]}: ${highestScore}</p>`
        );
      }
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
  $('#level-title').text(`${playersName[count]} - Level ${level}`);
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

function repeatAppendEl(num) {
  for (let i = 0; i < num; i++) {
    $('.p-name-ok-btn').before(
      `<div><span>P${
        i + 1
      }:</span><input class="p-name" type="text" maxlength="20" autocomplete="off" /></div>`
    );
  }
}

function displayModals() {
  $('.overlay').removeClass('hidden');
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

        /* $('.start-btn').removeClass('glow-btn'); */
        $('.overlay').addClass('hidden');
        $('.players-name').addClass('hidden');
        game = false;
        started = true;

        if (started) nextSequence();
      }
    });
  });
}

//* Events
$(window).on('load', () => {
  if (!started) {
    /* displayStartMsg('#level-title', 2500, 5000); */
  }
});

$(document).on('click', () => {
  if ($('.score-board').hasClass('active') && count !== playersName.length)
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

// Leaderscore btns
$('#trophy-btn').on('click', () => {
  $('.leader-board').css('bottom', '0%');
});

$('#close-btn').on('click', () => {
  $('.leader-board').css('bottom', '-100%');
});
