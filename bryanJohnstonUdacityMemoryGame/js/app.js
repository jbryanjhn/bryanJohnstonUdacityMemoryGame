/*
                                                                       \|||/
Bryan Johnston                                                         (o o)
10/14/18                                                         ,~oo0~~(_)~~0oo~,
"Memory Game"	project		                                         |  |  |  |  |  |
Udacity Front-end Developer Nanodegreee

 * Create a list that holds all of your cards
 */
var cards = ['fa-diamond', 'fa-diamond',
              'fa-paper-plane-o', 'fa-paper-plane-o',
              'fa-anchor', 'fa-anchor',
              'fa-bolt', 'fa-bolt',
              'fa-cube', 'fa-cube',
              'fa-leaf', 'fa-leaf',
              'fa-bicycle', 'fa-bicycle',
              'fa-bomb', 'fa-bomb'
            ];
let moves = 0;
let timer = 0;
let timeCount = 0;
let timeHolder;
let startGame = false;
let openCards = [];
let allCards;
let matchedCards = 0;


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function generateCard(card) {
  return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


function createCards() {
    let deck = document.querySelector('.deck');
    let cardHTML = shuffle(cards).map(function(card) {
        return generateCard(card);
  });
    deck.innerHTML = cardHTML.join('');
    allCards = document.querySelectorAll('.card');
}

function initGame() {
    createCards();
    start();
    addStars();
}

function startTimer() {
    timeCount++ ;
    $('#timer').html(timeCount);
    timeHolder = setTimeout(startTimer, 1000);
}
// clear existing stars, add new
function addStars() {
    $('.stars').html("");
    for (let i=0; i<3; i++){
        $('.stars').append(`<li><i class="fa fa-star"></i></li>`);
    }
}
// adjust star rating
function removeStars() {
    let stars = $('.fa-star');
    $(stars[stars.length-1]).toggleClass('fa-star fa-star-o');
}
//increase number of moves
function incMove() {
    moves ++;
    $('#moves').html(moves);
    if (moves === 14 || moves === 20) {
        removeStars();
    }
}

function restartGame() {
    moves = 0;
    startGame = false;
    openCards = [];
    timeCount = 0;
    matchedCards = 0;
    clearTimeout(timeHolder);
    $('#timer').html(0);
    $('#moves').html(0);
    initGame();
}

function endGame() {
    clearTimeout(timeHolder);
    // set stars value for messasge
    let stars = $('.fa-star').length;
    // show message
    vex.dialog.confirm({
        message: `Hooray! You finished the game in ${timeHolder} seconds with a ${stars}/3 star rating. Do you want to play again?`,
        callback: function(value){
            if (value) {
                restartGame();
            }
        }
    });
}

function checkCards() {
    incMove();
    if (openCards[0].dataset.card == openCards[1].dataset.card) {
        openCards[0].classList.add('open', 'show', 'match');
        openCards[1].classList.add('open', 'show','match');
          // animation for a match
        openCards.forEach(function(card) {
            $(card).animateCss('tada', function() {});
        });
        matchedCards++;
    }
    else {
        openCards.forEach(function(card) {
              // animation for a mismatch
            $(card).animateCss('shake', function() {
                $(card).toggleClass('open show');
            });
        });
    }
    if (matchedCards === 8) {
      endGame();
    }
    openCards = [];
}

function start() {
    allCards.forEach(function(card) {
        card.addEventListener('click', function(e) {
        // start game, if not started
        if (!startGame) {
            startGame = true;
            timeCount = 0;
            timeHolder = setTimeout(startTimer, 1000);
        }
        // check if cards have been turned
        if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
          //check number of turned cards
            if (openCards.length < 2) {
              openCards.push(card);
              $(card).toggleClass('open show');
            if (openCards.length == 2) {
                checkCards();
            }
          }
        }
     });
  });
}

$(document).ready(function(){
  initGame();
  $('#restart').click(restartGame);
  vex.defaultOptions.className = 'vex-theme-os';
  vex.dialog.buttons.YES.text = 'Yes!';
  vex.dialog.buttons.NO.text = 'No';
});

// load animation from https://github.com/daneden/animate.css/#usage
$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },
});
