'use strict';

const buttonColours = ['red', 'blue', 'green', 'yellow'];
let gamePattern = [];
let userClickedPattern = [];
let started = false;
let level = 0;
let startMsgInterval;
let startMsgClick;
let scores = [];
let count = 0;

/* $(document).on('keydown', (e) => {
  if (!started) {
    $('#level-title').text(`Level ${level}`);
    nextSequence();
    started = true;
  }
});
 */

function displayStartMsg() {
  startMsgInterval = setInterval(() => {
    $('#level-title').text(`Press Start to Play`);
    $('#level-title').addClass(`glow-title`);
  }, 3000);
  startMsgClick = setInterval(() => {
    $('#level-title').removeClass(`glow-title`);
    $('#level-title').text(`Simon Game`);
  }, 6000);
}

$(window).on('load', () => {
  if (!started) {
    /* displayStartMsg(); */
  }
});

$(document).on('click', () => {
  if ($('.score-board').hasClass('active')) scoreBoardOut();
});

$('.start-btn').on('click', (e) => {
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
    scores.push(level);
    count++;
    $('.score-board').append(
      `<p>Score ${count}: ${scores[scores.length - 1] - 1}`
    );
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
