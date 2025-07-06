const mysql = require("mysql2/promise");

const client = mysql.createPool(process.env.CONNECTION_STRING);



async function insertPlayer(player) {
    const values =  [player.nick, player.password]
    await client.query("INSERT INTO PLAYER (nick, password) values (?,?);", values);
}

async function loginPlayer(player){
    const values = [player.nick, player.password]
    const result =  await client.query("SELECT * FROM PLAYER WHERE NICK = ? AND PASSWORD = ?;", values); 
    if (result[0].length > 0) {
        return result[0][0];
    } else {
        return "Usuário ou senha incorretos"
    }
}

async function selectCards() {
     const result = await client.query("SELECT idCard, nameCard, hpCard, manaCost, rarity, damage, ST_x(spaceWaste) AS spaceWasteX, ST_y(spaceWaste) AS spaceWasteY FROM card;");
     return result[0];
}

async function updateUserCard(player_has_card) {
    const values = [player_has_card.idUser, player_has_card.idCard]
    const q1R = await client.query("select * FROM player_has_card WHERE Player_idUser = ? AND Card_idCard = ?;", values);
    if (q1R[0].length > 0 ) {
        values.unshift(player_has_card.cardCount)
        const q2R = await client.query("UPDATE player_has_card SET cardCount = cardCount + ? WHERE Player_idUser = ? AND Card_idCard = ?;", values)
        return 200;
    } else {
        values.push(player_has_card.cardCount);
        const q3R = await client.query("INSERT INTO player_has_card "
                                       +"(Player_idUser, Card_idCard, cardCount)" 
                                       +"values(?,?,?);", values);
    
        return 201                                
    }
}

async function levelUp(player_has_card) {
    const values = [player_has_card.idUser, player_has_card.idCard]
    await client.query("UPDATE player_has_card SET levelCard = levelCard+1 WHERE Player_idUser = ? AND Card_idCard = ?;", values);
}

async function selectPlayer(player) {
    const result = await client.query("SELECT * FROM player WHERE idUser = ?", [player.idUser]);

    if (result[0].length > 0 ) {
        return result[0][0];
    }
}

async function selectPlayerCards(deck) {
    const query = `
        SELECT 
    card.idCard,
    card.nameCard, 
    card.hpCard, 
    card.manaCost, 
    ST_x(card.spaceWaste) AS spaceWasteX, 
    ST_y(card.spaceWaste) AS spaceWasteY, 
    card.rarity, 
    card.damage,
    player_has_card.levelCard, 
    player_has_card.cardCount
FROM 
    player_has_card 
INNER JOIN 
    card ON player_has_card.Card_idCard = card.idCard
WHERE 
    player_has_card.Player_idUser = 2        
    AND player_has_card.Card_idCard NOT IN (
        SELECT 
            card.idCard
        FROM 
            card 
        INNER JOIN 
            deck_card ON card.idCard = deck_card.Player_has_Card_Card_idCard 
        INNER JOIN 
            deck ON deck.idDeck = deck_card.deck_idDeck
        WHERE 
            deck.playerId = ? 
            AND deck.idDeck = ?
    );
    `;
    
    const result = await client.query(query, [deck.playerId, deck.idDeck, deck.idDeck]);

    if (result[0].length > 0) {
        return result[0];
    }
}


async function selectPlayerCardsNoAvalible(player) {

    

    const query = "select card.idCard, card.nameCard, card.hpCard, card.manaCost, "+
                  "ST_x(card.spaceWaste) AS spaceWasteX, ST_y(card.spaceWaste) AS spaceWasteY,card.rarity, "+
                  "card.damage from card where card.idCard not in "+
                  "(select player_has_card.Card_idCard from player_has_card where player_has_card.Player_idUser = ?);";

    const result = await client.query(query, [player.idUser]);

    if (result[0].length > 0) {
        return result[0]
    }    
}

async function insertDeck(deck) {
    const query0 = "select * from deck where idDeck = ? and playerId = ?;";

    const result =  await client.query(query0, [deck.idDeck, deck.playerId]);

    if (result[0].length > 0) {
        return result[0][0];
    } 
    
    
    const query2 = "insert into deck (idDeck, mediumCost, playerId) values (?,?,?)";

    const values = [deck.idDeck, deck.mediumCost, deck.playerId];

    await client.query(query2, values);

    return await selectDeck(deck);

}

async function selectDeck(deck) {
    const query = "select * from deck where playerId = ?;";

    const result =  await client.query(query, [deck.playerId]);

    if (result[0].length > 0) {
        return result[0];
    } 
}

async function insertCardToDeck(deckCard) {
    

    const query = "insert into deck_card (deck_idDeck,Player_has_Card_Player_idUser,"+
                   "Player_has_Card_Card_idCard, position) "+
                   "values (?, ?, ?, ?);";
    
    const values = [deckCard.deck_idDeck, 
                    deckCard.Player_has_Card_Player_idUser, 
                    deckCard.Player_has_Card_Card_idCard, 
                    deckCard.position] 
    
    await client.query(query, values);
}


async function loadDeckCards(deck) {
    const query = "select card.idCard, card.nameCard, card.hpCard, card.manaCost, "+
    "ST_x(card.spaceWaste) AS spaceWasteX, ST_y(card.spaceWaste) AS spaceWasteY, "+
    "card.rarity, card.damage, deck_card.position "+
    "from card inner join deck_card on card.idCard = deck_card.Player_has_Card_Card_idCard "+
    "inner join deck on deck.idDeck = deck_card.deck_idDeck where deck.playerId = ? and deck.idDeck = ?;";

    const result = await client.query(query, [deck.playerId, deck.idDeck]);

    if (result[0].length > 0) {
        return result[0];
    }
}

async function alterCardPosition(deckCard) {
    const query =  "update deck_card set position = ? where deck_idDeck = ?;";

    const result = await client.query(query, [deckCard.position, deckCard.deck_idDeck]);

    if (result[0].length > 0) {
        return result[0]
    }
}

async function deleteCardFromDeck(deckCard) {
    const query = "DELETE FROM deck_card WHERE deck_card.deck_idDeck = ? and deck_card.Player_has_Card_Card_idCard = ? "
                   +"and deck_card.Player_has_Card_Player_idUser = ?;";

    const result = await client.query(query, [deckCard.deck_idDeck, deckCard.Player_has_Card_Card_idCard, deckCard.deck_card.Player_has_Card_Player_idUser]);
    
    if (result[0].length > 0) {
        return result[0]
    }
}

module.exports = {
    insertPlayer,
    loginPlayer,
    selectCards,
    updateUserCard,
    levelUp, 
    selectPlayer,
    selectPlayerCards,
    selectPlayerCardsNoAvalible,
    insertDeck,
    insertCardToDeck,
    selectDeck, 
    loadDeckCards,
    alterCardPosition,
    deleteCardFromDeck
}