import { FC } from 'react';
import { useRecipeStore } from '../store/recipes';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Meal } from '../types/mealTypes';
import { RecipeCard } from './RecipeCard';

// const StyledCard = styled(Card)({
//   backgroundColor: "#f0f8ff",
//   color: "#333",
//   margin: "10px",
//   borderRadius: "10px",
//   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//   width: "500px",
// });

// const StyledButton = styled(Button)({
//   backgroundColor: "#87CEFA",
//   color: "#fff",
//   '&:hover': {
//     backgroundColor: "#4682B4",
//   },
// });

export const IngredientList: FC = () => {
  const getFavoriteRecipes = useRecipeStore((state) => state.getFavoriteRecipes);
  const favoriteRecipes = getFavoriteRecipes();
  const navigate = useNavigate();

  const favorites = useRecipeStore(state => state.favorites);

  const getIngredients = (meal: Meal) => {
    return Array.from({ length: 20 }, (_, i) => ({
      ingredient: meal[`strIngredient${i + 1}` as `strIngredient${number}`],
      measure: meal[`strMeasure${i + 1}` as `strMeasure${number}`]
    }))
    .filter(item => item.ingredient && item.measure)
    .map(item => ({
      ingredient: item.ingredient!,
      measure: item.measure!
    }));
  };

  const aggregateIngredients = (ingredients: { ingredient: string; measure: string }[]) => {
    const ingredientMap = new Map<string, string>();

    ingredients.forEach(({ ingredient, measure }) => {
      if (ingredientMap.has(ingredient)) {
        const existingMeasure = ingredientMap.get(ingredient);
        ingredientMap.set(ingredient, `${existingMeasure}, ${measure}`);
      } else {
        ingredientMap.set(ingredient, measure);
      }
    });

    return Array.from(ingredientMap.entries()).map(([ingredient, measure]) => ({ ingredient, measure }));
  };

  const allIngredients = favoriteRecipes.flatMap(meal => getIngredients(meal));
  const aggregatedIngredients = aggregateIngredients(allIngredients);

  const favoritesIds = favorites.map(el => el.idMeal)

  return (
    <div>
      <Button
        variant="contained" color="primary" style={{ margin: '20px 0' }}
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        Favorite Recipes
      </Typography>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {favoriteRecipes.length === 0 ? (
          <Typography variant="h6" component="p">
            No favorite recipes yet.
          </Typography>
        ) : (
          favoriteRecipes.map((meal: Meal) => (
            <RecipeCard meal={meal} mealFavoriteIds={favoritesIds} />
          )))
        }
      </div>

      <Typography variant="h4" component="h2" gutterBottom>
        Aggregated Ingredients
      </Typography>

      <ul>
        {aggregatedIngredients.map((item, index) => (
          <li key={index}>
            {item.ingredient}: {item.measure}
          </li>
        ))}
      </ul>
    </div>
  );
};
