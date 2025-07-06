require("dotenv").config();

const express = require("express");
const db = require("./db");

const app = express();

app.use(express.json())


app.listen(process.env.PORT, () => {
    console.log("App is running now!");
});

app.post("/player", async(request, response) => {
    const player = request.body;
    await db.insertPlayer(player);
    response.sendStatus(200);
});

app.get("/player", async(request, response) => {
    const player = request.body
    const result =  await db.loginPlayer(player);
    response.json(result);
})

app.get("/card", async(request, response) => {
    const result =  await db.selectCards();
    const result2 = {
        "result": result,
    }
    response.json(result2);
});

app.patch("/card", async(request, response) => {
    const playerCard = request.body;
    const result = await db.updateUserCard(playerCard);

    response.sendStatus(result);
})

app.patch("/cardlevel", async(request, response) => {
    const playerCard = request.body;
    const result = await db.levelUp(playerCard);

    response.sendStatus(200);
})

app.get("/selectplayer", async(request, response) => {
    const player = request.body;
    const result =  await db.selectPlayer(player);

    response.json(result);
})

app.get("/selectplayercard", async(request, response) => {
    const player = request.body;
    const result = await db.selectPlayerCards(player);
    const result2 = {
        "result": result, 
    }
    response.json(result2);
}) 

app.get("/noAvalibleCards", async(request, response) => {
    const player =  request.body;
    const result = await db.selectPlayerCardsNoAvalible(player);
    response.json(result);
}) 

app.post("/deck", async (request, response) => {
    const deck = request.body;
    const result =  await db.insertDeck(deck);
    response.json(result);
});

app.post("/deckCard", async(request, response) => {
    const deckCard = request.body;
    await db.insertCardToDeck(deckCard);
    response.sendStatus(201);
});

app.get("/deck", async (request,  response) => {
    const deck = request.body;
    var result = {}
    result.decks =  await db.selectDeck(deck);
    
    for(let i = 0; i < result.decks.length; i++) {
        const result2 = await db.loadDeckCards(result.decks[i]);
        
        result.decks[i].cardList  = result2;
    }
    //const result2 = await db.loadDeckCards(deck);
    //result.cardList  = result2;
    response.json(result);
});

app.patch("/deck", async (request, response) => {
    const deckCard =  request.body;
    await db.insertCardToDeck(deckCard)
    response.sendStatus(200);
})

  

app.get("/", (request, response, next) => {
    response.json({
        message: "It's alive!"  
    })
});