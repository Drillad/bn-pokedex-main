const express = require('express')
const cors = require('cors')
const _ = require('lodash')
const app = express()
const { cards } = require('../../mock/cards.json')

app.use(cors())

app.get('/api/cards', (req, res) => {
  const searchTerm = _.toUpper(_.get(req, 'query.name', '')); // Frontend sends term as 'name'

  const limit = parseInt(req.query.limit) || 20;

  if (!searchTerm) {
    return res.json({ cards: cards.slice(0, limit) });
  }

  const filteredCards = _.filter(cards, card => {
    const cardName = _.toUpper(card.name || ''); // convert to upper case

    // --- CRITICAL CHANGE HERE ---
    // Accessing 'card.type' (singular string) directly from JSON
    const cardType = _.toUpper(card.type || ''); // convert to upper case

    const checkName = _.includes(cardName, searchTerm);

    // Check if the singular 'card.type' includes the search term
    const checkType = _.includes(cardType, searchTerm);

    return checkName || checkType; // Card matches if its name OR its type includes the search term
  });

  res.json({ cards: filteredCards });
});

app.listen(3030, () => console.log('app start @ port 3030'));