import { Meal } from "../types/mealTypes";
import { FC, useEffect } from "react";
import Pagination from '@mui/material/Pagination';
import { useState } from 'react';
import { Box, Button, styled, TextField, Typography } from "@mui/material";
import debounce from 'lodash/debounce';
import { useRecipeStore } from "../store/recipes";
import { RecipeCard } from "./RecipeCard";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Category } from "../types/categoriesTypes";
import { queryKeys } from "../App";
import { getCategories } from "../services/mealService";
import { MultipleSelect } from "./MultipleSelector";

const RecipeGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-content: center;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr); 
  }
`;

const FiltersGrid = styled(Box)`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

type Props = {
  data: Meal[] | undefined,
  isLoading: boolean,
  error: Error | null
}

export const AllRecipes: FC<Props> = ({ data, isLoading, error}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Meal[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
  });
  
  const favorites = useRecipeStore(state => state.favorites);

  const recipesPerPage = 10;
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;

  const filterRecipes = (query: string) => {
    if (!data) return [];
    return data.filter((meal) =>
      meal.strMeal.toLowerCase().includes(query.toLowerCase())
    );
  };

  const debouncedFilterRecipes = debounce((query: string) => {
    setFilteredRecipes(filterRecipes(query));
  }, 300);

  useEffect(() => {
    debouncedFilterRecipes(searchQuery);
  }, [searchQuery, data]);

  let currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  currentRecipes = selectedCategories.length > 0 
    ? currentRecipes.filter(recipe => selectedCategories.includes(recipe.strCategory)) 
    : currentRecipes;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading recipes</div>;

  const favoritesIds = favorites.map(el => el.idMeal)

  return (
    <div style={{ padding: "10px"}}>
      <Link to="/ingredients-list" state={{ favorites }}>
        <Button variant="contained" color="primary" style={{ margin: '20px 0' }}>
          <Typography variant="button" component="span">
            Favorites: {favorites.length}
          </Typography>
        </Button>
      </Link>
      <FiltersGrid>
        <div style={{ flex: "1" }}>
          {categories && (
            <MultipleSelect
              categories={categories}
              selectedCategories={selectedCategories}
             onChange={setSelectedCategories}
            />
          )}
        </div>

        <div style={{ flex: "1" }}>
        <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
     </FiltersGrid>

      <RecipeGrid>
        {currentRecipes && currentRecipes.length === 0 && <h2>No results found. Please try adjusting your search criteria.</h2>}
        {currentRecipes && currentRecipes.map((meal: Meal) => (
          <RecipeCard meal={meal} mealFavoriteIds={favoritesIds} key={meal.idMeal} />
        ))}
      </RecipeGrid>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          count={currentRecipes ? Math.ceil(currentRecipes.length / recipesPerPage) : 0}
          page={currentPage}
          onChange={(_, value) => setCurrentPage(value)}
          color="primary"
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
        />
      </div>
    </div>
  );
}