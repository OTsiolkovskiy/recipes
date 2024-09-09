import { Route, Routes } from "react-router-dom"
import { AllRecipes } from "./components/AllRecipes"
import { RecipeDetail } from "./components/RecipeDetail"
import { useQuery } from "@tanstack/react-query";
import { getAllMeals } from "./services/mealService";
import { useRecipeStore } from "./store/recipes";
import { Meal } from "./types/mealTypes";
import { useEffect } from "react";
import { IngredientList } from "./components/IngredientsList";

export const queryKeys = {
  meals: ['meals'] as const,
  categories: ['categories'] as const
};

export const App = () => {
  const setRecipes = useRecipeStore((state) => state.setRecipes);
  const { data, isLoading, error } = useQuery<Meal[], Error>({
    queryKey: queryKeys.meals,
    queryFn: getAllMeals,
  });

  useEffect(() => {
    if (data) {
      setRecipes(data);
    }
  }, [data]);

  return (
    <Routes>
      <Route path="/" element={<AllRecipes data={data} isLoading={isLoading} error={error} />} />
      <Route path="/recipe/:id" element={<RecipeDetail />} />
      <Route path="/ingredients-list" element={<IngredientList />} />
    </Routes>
  )
}