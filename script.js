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
    var maxRank = 13;
    while (rankCounter <= maxRank) {
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

  // Loop through deck and set rank of J, Q or K to 10, and ace to 11
  var cardIndex = 0;
  while (cardIndex < cardDeck.length) {
    if (
      cardDeck[cardIndex].name == "jack" ||
      cardDeck[cardIndex].name == "queen" ||
      cardDeck[cardIndex].name == "king"
    ) {
      cardDeck[cardIndex].rank = 10;
    } else if (cardDeck[cardIndex].name == "ace") {
      cardDeck[cardIndex].rank = 11;
    }
    cardIndex += 1;
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
//function to output cards in hand as string
var handToString = function (hand) {
  //initialise empty output
  var handToStringOutput = "";

  //loop to output each card in player's hand
  var cardIndex = 0;
  while (cardIndex < hand.length) {
    handToStringOutput += `${hand[cardIndex].name} of ${hand[cardIndex].suit}`;
    //punctuation
    if (cardIndex < hand.length - 2) {
      handToStringOutput += ", ";
    } else if (cardIndex == hand.length - 2) {
      handToStringOutput += " and ";
    }
    cardIndex += 1;
  }
  return handToStringOutput;
};

//=============================================
//func to list out point values
var listPoints = function () {
  var listPointsOutput = `You have ${checkValueOfHand(
    playerHand
  )} points and dealer has ${checkValueOfHand(dealerHand)} points.<br>`;
  return listPointsOutput;
};

//=============================================
//check for blackjack func
var checkForBlackjack = function (hand) {
  var blackjack = false;
  if (hand[0].rank + hand[1].rank == 21) {
    blackjack = true;
  }
  return blackjack;
};

//============================================
//function for dealer to autohit if below 17
var autoHitIfBelow17 = function (hand) {
  valueOfHand = checkValueOfHand(hand);
  //loop to keep drawing until value of hand >= 17
  while (valueOfHand < 17) {
    //==============================================
    //TEMPORARY MEASURE: break loop if deck is empty to avoid infinite loop
    //==============================================
    if (deck == []) {
      break;
    }
    hand.push(deck.pop());
    valueOfHand = checkValueOfHand(hand);
  }
};

//=============================================
//=============================================
//GAME MODE FUNCS
//=============================================
//=============================================

//=============================================
//deal starting hand func
var dealStartingHand = function () {
  //initialise empty output
  var dealStartingHandOutput = "";
  //reset hands
  playerHand = [];
  dealerHand = [];

  //if deck has less cards than needed to deal, generate a new deck
  var cardsNeeded = 4;
  if (deck.length < cardsNeeded) {
    deck = shuffleCards(makeDeck());
    dealStartingHandOutput = "Deck reshuffled.<br>";
  }

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

  //output both players' hands
  dealStartingHandOutput = `You drew ${handToString(
    playerHand
  )}.<br>Dealer drew ${handToString(dealerHand)}.<br>`;

  //check for blackjack
  var playerBlackjack = checkForBlackjack(playerHand);
  var dealerBlackjack = checkForBlackjack(dealerHand);

  //split by cases of who has blackjack
  if (playerBlackjack == true && dealerBlackjack == true) {
    dealStartingHandOutput +=
      "Both you and the dealer have blackjack!<br>It's a draw!<br>Click 'Submit' to play again!";
  } else if (playerBlackjack == true && dealerBlackjack == false) {
    dealStartingHandOutput += "You have blackjack! You win!";
  } else if (playerBlackjack == false && dealerBlackjack == true) {
    dealStartingHandOutput += "Dealer has blackjack! Dealer wins.";
  }
  //mode remains dealStartingHand

  //if no one has blackjack, output values of hands and ask player for hit or stand
  else {
    dealStartingHandOutput += `${listPoints()}<br>Would you like to hit or stand?<br>Input 'hit' to hit and 'stand' to stand.`;

    //change mode
    mode = "playerTurn";
  }

  return dealStartingHandOutput;
};

//=============================================
//function for player's turn
var playerTurn = function (input) {
  //initialise empty output
  var playerTurnOutput = "";

  //split cases if input is hit or stand
  if (input == "hit") {
    //draw a card
    playerHand.push(deck.pop());

    //output
    playerTurnOutput =
      `You drew ${playerHand[playerHand.length - 1].name} of ${
        playerHand[playerHand.length - 1].suit
      }.<br>` +
      `You have ${handToString(playerHand)}.<br>` +
      `${listPoints()}<br>`;

    //if busted, let player know and change mode
    if (checkValueOfHand(playerHand) > 21) {
      playerTurnOutput += `You've busted! Click 'Submit' to move on to dealer's turn.`;
      mode = "dealerTurn";
    }
    //else ask player for hit or stand, and leave mode unchanged
    else {
      playerTurnOutput += `Would you like to hit or stand?<br>Input 'hit' to hit and 'stand' to stand.`;
    }
  }
  //if stand, output final value of hand and change mode
  else if (input == "stand") {
    playerTurnOutput = `You stood. You have ${handToString(
      playerHand
    )} and dealer has ${handToString(
      dealerHand
    )}.<br>${listPoints()}<br>Click 'Submit' to move on to dealer's turn.`;
    mode = "dealerTurn";
  }
  return playerTurnOutput;
};

//=============================================
//final results func
var finalResults = function () {
  //initialise empty output value
  var finalResultsOutput = "";

  //tally score of each player
  var playerRank = checkValueOfHand(playerHand);
  var dealerRank = checkValueOfHand(dealerHand);

  //check for blackjack
  var playerBlackjack = checkForBlackjack(playerHand);
  var dealerBlackjack = checkForBlackjack(dealerHand);

  //output both players' hands
  finalResultsOutput = `You have ${handToString(
    playerHand
  )}.<br>Dealer has ${handToString(dealerHand)}.<br>`;

  //output both players' hand values
  finalResultsOutput += `You have ${playerRank} points and dealer has ${dealerRank} points.<br>`;
  if (playerRank > dealerRank) {
    //different output depending on who wins
    finalResultsOutput += "You win!";
  } else if (playerRank < dealerRank) {
    finalResultsOutput += "Dealer wins.";
  } else {
    finalResultsOutput += "It's a draw.";
  }

  finalResultsOutput += "<br> Click 'Submit' to play again!";
  return finalResultsOutput;
};

//=============================================
//=============================================
//MAIN
//=============================================
//=============================================

//first, make a deck
deck = shuffleCards(makeDeck());
console.log("deck generated");

//main
var main = function (input) {
  //initialise empty output
  var myOutputValue = "";
  //console log mode
  console.log("========================");
  console.log("mode:" + mode);

  //deal starting hand
  if (mode == "dealStartingHand") {
    //output
    myOutputValue = dealStartingHand();
  } else if ((mode = "playerTurn")) {
    myOutputValue = playerTurn(input);
  } else if ((mode = "dealerTurn")) {
    myOutputValue = dealerTurn();
  } else if (mode == "finalResults") {
    //output
    myOutputValue = finalResults();

    //change mode
    mode = "dealStartingHand";
  }
  return myOutputValue;
};
