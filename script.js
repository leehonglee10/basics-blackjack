//global vars
var playerHand = [];
var dealerHand = [];
var deck = [];
var mode = "dealStartingHand";

//==========================================
//==========================================
//HELPER FUNCTIONS
//==========================================
//==========================================

//==========================================
//deck generation func
var makeDeck = function () {
  // Initialise an empty deck array
  var cardDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  var suits = ["hearts", "diamonds", "clubs", "spades"];

  // Loop over the suits array
  var suitIndex = 0;
  while (suitIndex < suits.length) {
    // Store the current suit in a variable
    var currentSuit = suits[suitIndex];

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    var rankCounter = 1;
    while (rankCounter <= 13) {
      // By default, the card name is the same as rankCounter
      var cardName = rankCounter;

      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName == 1) {
        cardName = "ace";
      } else if (cardName == 11) {
        cardName = "jack";
      } else if (cardName == 12) {
        cardName = "queen";
      } else if (cardName == 13) {
        cardName = "king";
      }

      // Create a new card with the current name, suit, and rank
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // Add the new card to the deck
      cardDeck.push(card);

      // Increment rankCounter to iterate over the next rank
      rankCounter += 1;
    }

    // Increment the suit index to iterate over the next suit
    suitIndex += 1;
  }

  // Return the completed card deck
  return cardDeck;
};

//============================================
// Get a random index ranging from 0 (inclusive) to max (exclusive).
var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

//===========================================
// Shuffle the elements in the cardDeck array
var shuffleCards = function (cardDeck) {
  // Loop over the card deck array once
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    // Select a random index in the deck
    var randomIndex = getRandomIndex(cardDeck.length);
    // Select the card that corresponds to randomIndex
    var randomCard = cardDeck[randomIndex];
    // Select the card that corresponds to currentIndex
    var currentCard = cardDeck[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    // Increment currentIndex
    currentIndex = currentIndex + 1;
  }
  // Return the shuffled deck
  return cardDeck;
};

//=============================================
//deal starting hand func
var dealStartingHand = function () {
  //loop to deal two cards per person, starting with player
  var counter = 0;
  while (counter < 2) {
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    counter += 1;
  }
  console.log("player hand:");
  console.log(playerHand);
  console.log("dealer hand:");
  console.log(dealerHand);
};

//=============================================
//total value of hand func
var checkValueOfHand = function (hand) {
  var valueOfHand = 0;
  var cardIndex = 0;
  while (cardIndex < hand.length) {
    valueOfHand += hand[cardIndex].rank;
    cardIndex += 1;
  }
  return valueOfHand;
};

//=============================================
//=============================================
//MAIN
//=============================================
//=============================================

//first, make a deck
deck = shuffleCards(makeDeck());

//main
var main = function (input) {
  var myOutputValue = "";
  //deal starting hand
  if (mode == "dealStartingHand") {
    dealStartingHand();
    myOutputValue = "Hand dealt. Click 'Submit' again to see results.";
    mode = "finalResults";
    console.log(mode);
  } else if (mode == "finalResults") {
    console.log("final results running");
    //tally score of each player
    playerRank = checkValueOfHand(playerHand);
    dealerRank = checkValueOfHand(dealerHand);
    myOutputValue = `You drew ${playerHand[0].name} of ${playerHand[0].suit} and ${playerHand[1].name} of ${playerHand[1].suit}.<br>Dealer drew ${dealerHand[0].name} of ${dealerHand[0].suit} and ${dealerHand[0].name} of ${dealerHand[0].suit}.`;

    //different output depending on who wins
    if (playerRank > dealerRank) {
      myOutputValue += "<br>You win!";
    } else {
      myOutputValue += "<br>Dealer wins.";
    }
  }
  return myOutputValue;
};
