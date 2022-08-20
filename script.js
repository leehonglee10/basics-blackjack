//global vars
var noOfPlayers = 0;
var currentPlayer = 1;
var playerHands = [];
var dealerHand = [];
var deck = [];
var playerChips = [];
var playerBets = [];
var minimumBet = 10;
//please change the minimum bet in the initial output in index.html
var playerBlackjacks = [];
var playerBusts = [];
var mode = "inputPlayerNumber";

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
    handToStringOutput += `    ${hand[cardIndex].name} of ${hand[cardIndex].suit}    `;
    //punctuation
    if (cardIndex < hand.length - 1) {
      handToStringOutput += ", ";
    }
    cardIndex += 1;
  }
  return handToStringOutput;
};

//=============================================
//function to output cards in hand as string HIDING DEALER'S FIRST CARD
var handToStringDealerCardHidden = function (hand) {
  //initialise empty output
  var handToStringOutput = "";

  //set first card as unknown
  handToStringOutput += `    ⬛ of ⬛    ,`;
  //loop to output each card in player's hand. cardIndex starts from 1 because first card hidden.
  var cardIndex = 1;
  while (cardIndex < hand.length) {
    handToStringOutput += `    ${hand[cardIndex].name} of ${hand[cardIndex].suit}    `;
    //punctuation
    if (cardIndex < hand.length - 1) {
      handToStringOutput += ", ";
    }
    cardIndex += 1;
  }
  return handToStringOutput;
};

//=============================================
//func to list out hands and point values
var listAllHands = function () {
  //initialise empty output
  var listHandsOutput = "";
  //loop to output players' hands
  for (let playerIndex = 0; playerIndex < noOfPlayers; playerIndex++) {
    listHandsOutput += `<br>Player ${playerIndex + 1}'s hand: ${handToString(
      playerHands[playerIndex]
    )} (${checkValueOfHand(playerHands[playerIndex])} points)`;
    if (playerBlackjacks[playerIndex]) {
      listHandsOutput += `(BLACKJACK)`;
    } else if (playerBusts[playerIndex]) {
      listHandsOutput += `(BUST)`;
    }
  }
  listHandsOutput += `<br><br>Dealer hand: ${handToString(
    dealerHand
  )} (${checkValueOfHand(dealerHand)} points)<br><br>`;
  return listHandsOutput;
};

//=============================================
//func to list out hands and point values HIDING DEALER FIRST CARD
var listAllHandsDealerCardHidden = function () {
  //initialise empty output
  var listHandsOutput = "";
  //loop to output players' hands
  for (let playerIndex = 0; playerIndex < noOfPlayers; playerIndex++) {
    listHandsOutput += `Player ${playerIndex + 1}'s hand: ${handToString(
      playerHands[playerIndex]
    )} (${checkValueOfHand(playerHands[playerIndex])} points)<br>`;
  }
  listHandsOutput += `<br>Dealer hand: ${handToStringDealerCardHidden(
    dealerHand
  )} (??? points)<br><br>`;
  return listHandsOutput;
};

//=============================================
//func to list out current player and dealer hands and point values HIDING DEALER FIRST CARD
var listCurrentTurnHands = function () {
  //initialise empty output
  var listHandsOutput = "";
  //current player's hand
  listHandsOutput += `Your hand: ${handToString(
    playerHands[currentPlayer - 1]
  )} (${checkValueOfHand(playerHands[currentPlayer - 1])} points)<br>`;
  listHandsOutput += `Dealer hand: ${handToStringDealerCardHidden(
    dealerHand
  )} (??? points)<br><br>`;
  return listHandsOutput;
};

//=============================================
//func to list out players' remaining chips
var listChips = function () {
  //initialise empty output
  var listChipsOutput = "";
  for (let playerIndex = 0; playerIndex < noOfPlayers; playerIndex++) {
    listChipsOutput += `Player ${playerIndex + 1} has ${
      playerChips[playerIndex]
    } chips remaining.<br>`;
  }
  return listChipsOutput;
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
//Input player number func
var inputPlayerNumber = function (playerNumber) {
  //set global var
  noOfPlayers = playerNumber;

  //initialise playerHands, playerChips, playerBets, playerBlackjacks and playerBusts arrays
  for (let playerIndex = 0; playerIndex < noOfPlayers; playerIndex++) {
    playerHands.push([]);
    playerChips.push(100);
    playerBets.push(0);
    playerBlackjacks.push(false);
    playerBusts.push(false);
  }

  //change mode
  mode = "inputBets";

  //output to ask player1 for bet
  var inputPlayerNumberOutput = `Number of players set to ${noOfPlayers}. Player 1, please input your bet (between ${minimumBet} and ${Math.floor(
    0.5 * playerChips[currentPlayer - 1]
  )}).`;
  return inputPlayerNumberOutput;
};

//=============================================
//Input bets func
var inputBets = function (bet) {
  //initilaise empty output
  var inputBetsOutput = "";

  //change appropriate element in playerBets
  playerBets[currentPlayer - 1] = Number(bet);

  //input validation for bet, cannot be non-integer, less than minimum bet, more than current chips, or NaN
  if (
    playerBets[currentPlayer - 1] % 1 !== 0 ||
    playerBets[currentPlayer - 1] < minimumBet ||
    playerBets[currentPlayer - 1] > 0.5 * playerChips[currentPlayer - 1] ||
    isNaN(playerBets[currentPlayer - 1])
  ) {
    inputBetsOutput += `Sorry, please input an integer greater than ${minimumBet} and less than half your remaining chips.<br><br>You have ${
      playerChips[currentPlayer - 1]
    } chips remaining.`;
  } else {
    //minus playerBet away from playerChips
    playerChips[currentPlayer - 1] -= playerBets[currentPlayer - 1];

    //output bet
    inputBetsOutput += `Player ${currentPlayer}, you've bet ${
      playerBets[currentPlayer - 1]
    } chips.<br>You have ${
      playerChips[currentPlayer - 1]
    } chips remaining.<br><br>`;

    //change player
    currentPlayer += 1;

    //ask next player for bet, unless currentPlayer > noOfPlayers, in which case change mode and deal starting hand
    if (currentPlayer <= noOfPlayers) {
      inputBetsOutput += `Player ${currentPlayer}, please input your bet (between ${minimumBet} and ${Math.floor(
        0.5 * playerChips[currentPlayer - 1]
      )}).`;
    } else {
      //reset current player to 1
      currentPlayer = 1;
      //change mode
      mode = "dealStartingHand";
      inputBetsOutput += `Please click 'Submit' to deal your starting hands.`;
    }
  }
  return inputBetsOutput;
};

//=============================================
//deal starting hand func
var dealStartingHand = function () {
  //initialise empty output
  var dealStartingHandOutput = "";

  //reset hands
  playerHands = [];
  for (let playerIndex = 0; playerIndex < noOfPlayers; playerIndex++) {
    playerHands.push([]);
  }
  dealerHand = [];

  //reset deck
  deck = shuffleCards(makeDeck());
  console.log("deck generated");

  //loop to deal two cards per person, starting with players
  for (let cardIndex = 0; cardIndex < 2; cardIndex++) {
    //loop to give one card to each player
    for (let playerIndex = 0; playerIndex < noOfPlayers; playerIndex++) {
      playerHands[playerIndex].push(deck.pop());
    }
    //deal one card to dealer
    dealerHand.push(deck.pop());
  }
  console.log("player hands:");
  console.log(playerHands);
  console.log("dealer hand:");
  console.log(dealerHand);

  dealStartingHandOutput += `Starting hand dealt.<br><br>`;

  //check for blackjack
  for (let playerIndex = 0; playerIndex < noOfPlayers; playerIndex++) {
    playerBlackjacks[playerIndex] = checkForBlackjack(playerHands[playerIndex]);
  }
  var dealerBlackjack = checkForBlackjack(dealerHand);

  //output players' hands, hiding dealer card if no blackjack
  if (dealerBlackjack) {
    dealStartingHandOutput += listAllHands();

    dealStartingHandOutput += `Dealer has blackjack! All players who do not also have blackjack lose double their bet! Players who also have blackjack draw and are returned their bets.<br><br>`;

    //calculate bets
    //loop through each player to check if they have blackjack
    for (let playerIndex = 0; playerIndex < noOfPlayers; playerIndex++) {
      //if they have blackjack, return their bet
      if (playerBlackjacks[playerIndex]) {
        playerChips[playerIndex] += playerBets[playerIndex];
      }
      //otherwise, subtract their bet's worth of chips
      else {
        playerChips[playerIndex] -= playerBets[playerIndex];
      }
    }

    //list chips
    dealStartingHandOutput += listChips();

    //change mode to input bets and ask player 1 for bet
    mode = "inputBets";
    dealStartingHandOutput += `<br>Player 1, please input your bet for the next round (between ${minimumBet} and ${Math.floor(
      0.5 * playerChips[currentPlayer - 1]
    )}).`;
  } else {
    dealStartingHandOutput += listAllHandsDealerCardHidden();

    //list players with blackjack and say bets will be settled on their turn
    //loop through blackjacks array and append output if true
    for (let playerIndex = 0; playerIndex < noOfPlayers; playerIndex++) {
      if (playerBlackjacks[playerIndex]) {
        dealStartingHandOutput += `Player ${
          playerIndex + 1
        }, you've got blackjack! Your winnings will be calculated on your turn.<br><br>`;
      }
    }

    //change mode
    mode = "playerInitialTurn";
    //ask to move to player 1's inital turn
    dealStartingHandOutput += `Please click 'Submit' to proceed to Player ${currentPlayer}'s turn.`;
  }

  return dealStartingHandOutput;
};

//=============================================
//function for player's inital turn
var playerInitialTurn = function () {
  //initialise empty output
  var playerInitialTurnOutput = "";
  playerInitialTurnOutput += `Player ${currentPlayer}'s turn.<br><br>${listCurrentTurnHands()}`;
  playerInitialTurnOutput += `Would you like to hit or stand?<br>Input 'hit' to hit and 'stand' to stand.`;
  //change mode
  mode = "playerTurn";
  return playerInitialTurnOutput;
};

//=============================================
//function for player's turn
var playerTurn = function (input) {
  //initialise empty output
  var playerTurnOutput = "";

  //input validation
  if (input !== "hit" && input !== "stand") {
    playerTurnOutput += `Sorry, please input either 'hit' or 'stand'.<br><br>${listHandsDealerCardHidden()}`;
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

    playerTurnOutput += listHandsDealerCardHidden();

    //if busted, lose
    if (checkValueOfHand(playerHand) > 21) {
      playerTurnOutput += `You busted! Dealer wins.`;
      //check if player ran out of chips
      if (playerChips <= minimumBet) {
        //change mode
        mode = "gameOver";
        playerTurnOutput += `<br><br>You have ${playerChips} chips remaining.<br>You don't have enough chips to place another bet!<br><br>GAME OVER<br><br>Please refresh the page to restart!`;
      } else {
        //change mode
        mode = "dealStartingHand";
        playerTurnOutput += `<br><br>You have ${playerChips} chips remaining.<br>Please place your bet for the next round! (between ${minimumBet} and ${Math.floor(
          0.5 * playerChips
        )})`;
      }
    }
    //else ask player for hit or stand, and leave mode unchanged
    else {
      playerTurnOutput += `Would you like to hit or stand?<br>Input 'hit' to hit and 'stand' to stand.`;
    }
  }
  //if stand, output final value of hand and change mode
  else if (input == "stand") {
    playerTurnOutput = `You stood.<br><br>${listHandsDealerCardHidden()}Click 'Submit' to move on to dealer's turn.`;
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
    //if bust, try changing ace to 1
    if (checkValueOfHand(dealerHand) > 21) {
      changeFirstAceTo1(dealerHand);
    }
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

  //list hands
  dealerTurnOutput += listHandsDealerCardHidden();

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

  //if dealer bust
  if (dealerRank > 21) {
    playerChips += 2 * playerBet;
    finalResultsOutput += "Dealer has busted! You win!";
  } else {
    if (playerRank > dealerRank) {
      playerChips += 2 * playerBet;
      //different output depending on who wins
      finalResultsOutput += "You win!";
    } else if (playerRank < dealerRank) {
      finalResultsOutput += "Dealer wins.";
    } else {
      playerChips += playerBet;
      finalResultsOutput += "It's a draw.";
    }
  }
  //check if player ran out of chips
  if (playerChips <= 0) {
    //change mode
    mode = "gameOver";
    finalResultsOutput += `<br><br>You have ${playerChips} chips remaining.<br>You don't have enough chips to place another bet!<br><br>GAME OVER<br><br>Please refresh the page to restart!`;
  } else {
    //change mode
    mode = "dealStartingHand";
    finalResultsOutput += `<br>You have ${playerChips} chips remaining.<br>Input your bet (between ${minimumBet} and ${Math.floor(
      0.5 * playerChips
    )}) and click 'Submit' to play again!`;
  }
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
  if (mode == "inputPlayerNumber") {
    myOutputValue = inputPlayerNumber(input);
  } else if (mode == "inputBets") {
    myOutputValue = inputBets(input);
  } else if (mode == "dealStartingHand") {
    myOutputValue = dealStartingHand();
  } else if (mode == "playerInitialTurn") {
    myOutputValue = playerInitialTurn();
  } else if (mode == "playerTurn") {
    myOutputValue = playerTurn(input);
  } else if (mode == "dealerTurn") {
    myOutputValue = dealerTurn();
  } else if (mode == "finalResults") {
    myOutputValue = finalResults();
  } else if (mode == "gameOver") {
    myOutputValue =
      "You have insufficient chips. Please refresh the page to start again.";
  }
  return myOutputValue;
};
