import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Meal } from '../types/mealTypes';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

export const RecipeDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const cachedMeals: Meal[] = queryClient.getQueryData(['meals']) || [];

  const meal = cachedMeals.find((meal) => meal.idMeal === id);
  console.log(id);
  if (!meal) return <div>Recipe not found</div>;

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 2 }}>
      <Button
            variant="contained" color="primary" style={{ margin: '20px 0' }}
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
      <CardMedia
        component="img"
        height="300"
        image={meal.strMealThumb}
        alt={meal.strMeal}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h4" component="div" gutterBottom>
          {meal.strMeal}
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {meal.strCategory} - {meal.strArea}
        </Typography>
        <Typography variant="body1" paragraph>
          {meal.strInstructions}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href={meal.strSource}
          target="_blank"
          rel="noopener noreferrer"
        >
          Recipe Source
        </Button>
      </CardContent>
    </Card>
  );
};
