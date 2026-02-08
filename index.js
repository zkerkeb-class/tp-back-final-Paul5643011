import express from 'express';
import pokemon from './schema/pokemon.js';

import './connect.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/pokemons', async (req, res) => {
  try {
    const pokemons = await pokemon.find({});
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post('/pokemons', async (req, res) => {
  try {
    const newPokemon = new pokemon(req.body);
    const savedPokemon = await newPokemon.save();
    res.status(201).json({ message: 'Pokemon created successfully', pokemon: savedPokemon });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to create Pokemon' });
  }
});

app.get('/pokemons/search', async (req, res) => {
  try {
    const nameQuery = req.query.name;
    if (!nameQuery) {
      return res.status(400).json({ error: 'Name parameter is required' });
    }
    
    const poke = await pokemon.findOne({
      $or: [
        { 'name.english': { $regex: nameQuery, $options: 'i' } },
        { 'name.french': { $regex: nameQuery, $options: 'i' } },
        { 'name.japanese': { $regex: nameQuery, $options: 'i' } },
        { 'name.chinese': { $regex: nameQuery, $options: 'i' } }
      ]
    });
    
    if (poke) {
      res.json(poke);
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/pokemons/:id', async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const poke = await pokemon.findOne({ id: pokeId });
    if (poke) {
      res.json(poke);
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/pokemons/:id', async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const deletedPoke = await pokemon.findOneAndDelete({ id: pokeId });
    if (deletedPoke) {
      res.json({ message: 'Pokemon deleted successfully', pokemon: deletedPoke });
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/pokemons/search', async (req, res) => {
  try {
    const nameQuery = req.query.name;
    if (!nameQuery) {
      return res.status(400).json({ error: 'Name parameter is required' });
    }
    
    const deletedPoke = await pokemon.findOneAndDelete({
      $or: [
        { 'name.english': { $regex: nameQuery, $options: 'i' } },
        { 'name.french': { $regex: nameQuery, $options: 'i' } },
        { 'name.japanese': { $regex: nameQuery, $options: 'i' } },
        { 'name.chinese': { $regex: nameQuery, $options: 'i' } }
      ]
    });
    
    if (deletedPoke) {
      res.json({ message: 'Pokemon deleted successfully', pokemon: deletedPoke });
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/pokemons/:id', async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const updates = req.body;
    
    const updatedPoke = await pokemon.findOneAndUpdate(
      { id: pokeId },
      updates,
      { new: true, runValidators: true }
    );
    
    if (updatedPoke) {
      res.json({ message: 'Pokemon updated successfully', pokemon: updatedPoke });
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/pokemons/search', async (req, res) => {
  try {
    const nameQuery = req.query.name;
    if (!nameQuery) {
      return res.status(400).json({ error: 'Name parameter is required' });
    }
    
    const updates = req.body;
    
    const updatedPoke = await pokemon.findOneAndUpdate(
      {
        $or: [
          { 'name.english': { $regex: nameQuery, $options: 'i' } },
          { 'name.french': { $regex: nameQuery, $options: 'i' } },
          { 'name.japanese': { $regex: nameQuery, $options: 'i' } },
          { 'name.chinese': { $regex: nameQuery, $options: 'i' } }
        ]
      },
      updates,
      { new: true, runValidators: true }
    );
    
    if (updatedPoke) {
      res.json({ message: 'Pokemon updated successfully', pokemon: updatedPoke });
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


console.log('Server is set up. Ready to start listening on a port.');

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});