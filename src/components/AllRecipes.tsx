import { Meal } from "../types/mealTypes";
import { FC, useEffect, useMemo, useState } from "react";
import Pagination from '@mui/material/Pagination';
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
  const recipesPerPage = 9;

  const filterRecipes = (query: string, categories: string[]) => {
    if (!data) return [];
    
    let result = data;
    
    if (query) {
      result = result.filter((meal) =>
        meal.strMeal.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (categories.length > 0) {
      result = result.filter(meal => categories.includes(meal.strCategory));
    }

    return result;
  };

  const debouncedFilterRecipes = debounce((query: string, categories: string[]) => {
    setFilteredRecipes(filterRecipes(query, categories));
    setCurrentPage(1);
  }, 300);

  useEffect(() => {
    debouncedFilterRecipes(searchQuery, selectedCategories);
  }, [searchQuery, selectedCategories, data]);

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;

  const currentRecipes = useMemo(() => 
    filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe), 
    [filteredRecipes, currentPage]
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading recipes</div>;

  const favoritesIds = favorites.map(el => el.idMeal);

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
          count={totalPages}
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
