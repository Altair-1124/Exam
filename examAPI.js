const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// インメモリデータベースの代わりに使用する配列
let recipes = [];
let nextId = 1;

// POST /recipes
app.post('/recipes', (req, res) => {
  const { title, making_time, serves, ingredients, cost } = req.body;
  
  if (!title || !making_time || !serves || !ingredients || !cost) {
    return res.status(200).json({
      message: "Recipe creation failed!",
      required: "title, making_time, serves, ingredients, cost"
    });
  }
  
  const newRecipe = {
    id: nextId++,
    title,
    making_time,
    serves,
    ingredients,
    cost,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  recipes.push(newRecipe);
  
  res.status(200).json({
    message: "Recipe successfully created!",
    recipe: [newRecipe]
  });
});

// GET /recipes
app.get('/recipes', (req, res) => {
  res.status(200).json({
    recipes: recipes.map(({ id, title, making_time, serves, ingredients, cost }) => 
      ({ id, title, making_time, serves, ingredients, cost }))
  });
});

// GET /recipes/{id}
app.get('/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  
  if (!recipe) {
    return res.status(200).json({ message: "No Recipe found" });
  }
  
  res.status(200).json({
    message: "Recipe details by id",
    recipe: [recipe]
  });
});

// PATCH /recipes/{id}
app.patch('/recipes/:id', (req, res) => {
  const index = recipes.findIndex(r => r.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(200).json({ message: "No Recipe found" });
  }
  
  const { title, making_time, serves, ingredients, cost } = req.body;
  
  recipes[index] = {
    ...recipes[index],
    title: title || recipes[index].title,
    making_time: making_time || recipes[index].making_time,
    serves: serves || recipes[index].serves,
    ingredients: ingredients || recipes[index].ingredients,
    cost: cost || recipes[index].cost,
    updated_at: new Date().toISOString()
  };
  
  res.status(200).json({
    message: "Recipe successfully updated!",
    recipe: [recipes[index]]
  });
});

// DELETE /recipes/{id}
app.delete('/recipes/:id', (req, res) => {
  const index = recipes.findIndex(r => r.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(200).json({ message: "No Recipe found" });
  }
  
  recipes.splice(index, 1);
  
  res.status(200).json({ message: "Recipe successfully removed!" });
});

// 404エラーハンドリング
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(port, () => {
  console.log(`Recipe API server running on port ${port}`);
});