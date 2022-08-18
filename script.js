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
  var suits = ["❤️", "♦️", "♣️", "♠️"];

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
//func to list out hands and point values
var listHands = function () {
  var listHandsOutput = `Your hand: ${handToString(
    playerHand
  )} (${checkValueOfHand(playerHand)} points)<br>Dealer hand: ${handToString(
    dealerHand
  )} (${checkValueOfHand(dealerHand)} points)<br><br>`;
  return listHandsOutput;
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

//=============================================
//check for bust func
var checkForBust = function (hand) {
  var bust = false;
  if (checkValueOfHand(hand) > 21) {
    bust = true;
  }
  return bust;
};

//=============================================
//func to check hand for aces (subhelper for changeFirstAceTo1)
var handHasAceWorth11 = function (hand) {
  var ace = false;
  //loop to check through all cards in hand
  var cardIndex = 0;
  while (cardIndex < hand.length) {
    if (hand[cardIndex].name == "ace" && hand[cardIndex].rank == 11) {
      ace = true;
    }
    cardIndex += 1;
  }
  return ace;
};

//=============================================
//func to find aces worth 11 points (subhelper for changeFirstAceTo1)
var indexOfAceWorth11 = function (card) {
  if (card.rank == 11 && card.name == "ace") {
    return true;
  } else {
    return false;
  }
};

//=============================================
//func to change value of ace to 1 if hand is bust
var changeFirstAceTo1 = function (hand) {
  //break if hand has no ace worth 11 to change
  if (!handHasAceWorth11(hand)) {
    return;
  }
  //find first ace worth 11 and change to 1
  aceIndex = hand.findIndex(indexOfAceWorth11);
  hand[aceIndex].rank = 1;
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

  //reset deck
  deck = shuffleCards(makeDeck());
  console.log("deck generated");

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
  dealStartingHandOutput = listHands();

  //check for blackjack
  var playerBlackjack = checkForBlackjack(playerHand);
  var dealerBlackjack = checkForBlackjack(dealerHand);

  //split by cases of who has blackjack
  if (playerBlackjack == true && dealerBlackjack == true) {
    dealStartingHandOutput +=
      "Both you and the dealer have blackjack! It's a draw!<br>Click 'Submit' to play again!";
  } else if (playerBlackjack == true && dealerBlackjack == false) {
    dealStartingHandOutput +=
      "You have blackjack! You win!<br>Click 'Submit' to play again!";
  } else if (playerBlackjack == false && dealerBlackjack == true) {
    dealStartingHandOutput +=
      "Dealer has blackjack! Dealer wins.<br>Click 'Submit' to play again!";
  }
  //mode remains dealStartingHand

  //if no one has blackjack, output values of hands and ask player for hit or stand
  else {
    dealStartingHandOutput += `Would you like to hit or stand?<br>Input 'hit' to hit and 'stand' to stand.`;

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

  //input validation
  if (input !== "hit" && input !== "stand") {
    playerTurnOutput += `Sorry, please input either 'hit' or 'stand'.<br><br>${listHands()}`;
  }
  //split cases if input is hit or stand
  else if (input == "hit") {
    //draw a card
    playerHand.push(deck.pop());

    //output
    playerTurnOutput += `You hit and drew ${
      playerHand[playerHand.length - 1].name
    } of ${playerHand[playerHand.length - 1].suit}.<br><br>`;

    //if bust, try changing ace to 1
    if (checkValueOfHand(playerHand) > 21) {
      changeFirstAceTo1(playerHand);
    }

    playerTurnOutput += listHands();

    //if busted, let player know and change mode
    if (checkValueOfHand(playerHand) > 21) {
      playerTurnOutput += `You busted! Click 'Submit' to move on to dealer's turn.`;
      mode = "dealerTurn";
    }
    //else ask player for hit or stand, and leave mode unchanged
    else {
      playerTurnOutput += `Would you like to hit or stand?<br>Input 'hit' to hit and 'stand' to stand.`;
    }
  }
  //if stand, output final value of hand and change mode
  else if (input == "stand") {
    playerTurnOutput = `You stood.<br><br>${listHands()}Click 'Submit' to move on to dealer's turn.`;
    mode = "dealerTurn";
  }
  return playerTurnOutput;
};

//=============================================
//dealer turn func
var dealerTurn = function () {
  console.log("dealerTurn running");
  //initialise empty output
  dealerTurnOutput = "";

  //loop to keep drawing until value of hand >= 17
  while (checkValueOfHand(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }

  //add output for cards dealer drew
  if (dealerHand.length > 2) {
    var newCards = dealerHand.slice(2, dealerHand.length);
    dealerTurnOutput += `Dealer hit and drew ${handToString(
      newCards
    )}.<br><br>`;
  } else {
    dealerTurnOutput += `Dealer stood.<br><br>`;
  }

  //if bust, try changing ace to 1
  if (checkValueOfHand(dealerHand) > 21) {
    changeFirstAceTo1(dealerHand);
  }
  //list hands
  dealerTurnOutput += listHands();

  //if dealer busted
  if (checkValueOfHand(dealerHand) > 21) {
    dealerTurnOutput += "Dealer busted!<br>";
  }

  //tell player to move on to final results
  dealerTurnOutput += "Click 'Submit' to check final results.";

  //change mode
  mode = "finalResults";

  return dealerTurnOutput;
};

//=============================================
//final results func
var finalResults = function () {
  //initialise empty output value
  var finalResultsOutput = "";

  //tally score of each player
  var playerRank = checkValueOfHand(playerHand);
  var dealerRank = checkValueOfHand(dealerHand);

  //output both players' hands
  finalResultsOutput = listHands();

  //check for bust
  playerBust = checkForBust(playerHand);
  dealerBust = checkForBust(dealerHand);

  //scenarios for bust
  if (playerBust == true && dealerBust == true) {
    finalResultsOutput += "Both you and the dealer busted! It's a draw!<br>";
  } else if (playerBust == true && dealerBust == false) {
    finalResultsOutput += "You busted! Dealer wins.<br>";
  } else if (playerBust == false && dealerBust == true) {
    finalResultsOutput += "Dealer has busted! You win!<br>";
  } else {
    if (playerRank > dealerRank) {
      //different output depending on who wins
      finalResultsOutput += "You win!<br>";
    } else if (playerRank < dealerRank) {
      finalResultsOutput += "Dealer wins.<br>";
    } else {
      finalResultsOutput += "It's a draw.<br>";
    }
  }
  finalResultsOutput += "Click 'Submit' to play again!";
  return finalResultsOutput;
};

//=============================================
//=============================================
//MAIN
//=============================================
//=============================================

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
  } else if (mode == "playerTurn") {
    myOutputValue = playerTurn(input);
  } else if (mode == "dealerTurn") {
    myOutputValue = dealerTurn();
  } else if (mode == "finalResults") {
    myOutputValue = finalResults();

    //change mode
    mode = "dealStartingHand";
  }
  return myOutputValue;
};
