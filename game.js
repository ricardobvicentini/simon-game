'use strict';

const buttonColours = ['red', 'blue', 'green', 'yellow'];
let gamePattern = [];
let userClickedPattern = [];
let scores = [];
let highScore = [];
let started = false;
let startMsgInterval;
let startMsgClick;
let level = 0;
let count = 0;
let players = 2;

/* $(document).on('keydown', (e) => {
  if (!started) {
    $('#level-title').text(`Level ${level}`);
    nextSequence();
    started = true;
  }
});
 */

//* Functions

function glowMsg(element) {
  startMsgInterval = setInterval(() => {
    $(element).addClass(`glow-title`);
  }, 3000);
  startMsgClick = setInterval(() => {
    $(element).removeClass(`glow-title`);
  }, 6000);
}

function displayStartMsg() {
  startMsgInterval = setInterval(() => {
    $('#level-title').text(`Press Start to Play`);
    /* $('#level-title').addClass(`glow-title`); */
  }, 3000);
  startMsgClick = setInterval(() => {
    $('#level-title').text(`Simon Game`);
    /* $('#level-title').removeClass(`glow-title`); */
  }, 6000);
  glowMsg('#level-title');
}

function retry() {
  $('.retry-btn').on('click', () => {
    $('.score-board').empty();
    scores = [];
    highScore = [];
    count = 0;
    if ($('.score-board').hasClass('active')) {
      scoreBoardOut();
    }
  });
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
      nextSequence();
      repeatSequence(gamePattern);
    }
  } else {
    //* Score Board counting
    scores.push(level);
    count++;
    $('.score-board').append(
      `<p>Score ${count}: ${scores[scores.length - 1] - 1}</p>`
    );
    highScore.push(scores[scores.length - 1] - 1);

    if (count === players) {
      $('.score-board').append(
        `<p>Highest score: ${Math.max(...highScore)}</p>`
      );
      $('.score-board').append(`<button class='retry-btn'>Retry</button>`);
      glowMsg('.retry-btn');
      retry();
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
    /* displayStartMsg(); */
  }
});

$(document).on('click', () => {
  if ($('.score-board').hasClass('active')) scoreBoardOut();
});

$('.start-btn').on('click', () => {
  if (!started) {
    $('#level-title').text(`Level ${level}`);
    nextSequence();
    started = true;
  }
  $('#level-title').removeClass(`glow-title`);
  clearInterval(startMsgInterval);
  clearInterval(startMsgClick);
});

$('.btn').on('click', function () {
  const userChosenColour = $(this).attr('id');
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
});
