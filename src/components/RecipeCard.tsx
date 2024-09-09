import { Button, Card, CardActions, CardContent, CardMedia, styled, Typography } from "@mui/material";
import { Meal } from "../types/mealTypes";
import { Link } from "react-router-dom";
import { useRecipeStore } from "../store/recipes";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

const StyledCard = styled(Card)({
  backgroundColor: "#f0f8ff",
  color: "#333",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  width: "300px",
  margin: "0 auto",
});

const StyledButton = styled(Button)({
  backgroundColor: "#87CEFA",
  color: "#fff",
});

type Props = {
  meal: Meal;
  mealFavoriteIds: string[];
}

export const RecipeCard: React.FC<Props> = ({ meal, mealFavoriteIds }) => {
  const addFavorite = useRecipeStore((state) => state.addFavorite);
  const removeFavorite = useRecipeStore((state) => state.removeFavorite);

  const isFavorite = mealFavoriteIds.includes(meal.idMeal);

  console.log(isFavorite);

  const handleFavorite = (mealId: string) => {
    if (isFavorite) {
      removeFavorite(mealId);
    } else {
      addFavorite(mealId);
    }
  };

  return (
    <StyledCard key={meal.idMeal}>
      <CardMedia
        component="img"
        height="200"
        image={meal.strMealThumb}
        alt={meal.strMeal}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {meal.strMeal}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {meal.strCategory} - {meal.strArea}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={`/recipe/${meal.idMeal}`}>
          <StyledButton size="small">View Recipe</StyledButton>
        </Link>
        <StyledButton
          size="small"
          onClick={() => handleFavorite(meal.idMeal)}
          sx={{
            backgroundColor: isFavorite ? "#4682B4" : "#87CEFA",
          }}
        >
          {isFavorite ? <IoHeartSharp size={22} /> : <IoHeartOutline size={22} />}
        </StyledButton>
      </CardActions>
    </StyledCard>
  );
}
