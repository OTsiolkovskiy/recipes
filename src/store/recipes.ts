import create from 'zustand';
import { Meal } from '../types/mealTypes';

interface RecipeState {
  recipes: Meal[];
  favorites: Meal[];
  addRecipe: (recipe: Meal) => void;
  addFavorite: (recipeId: string) => void;
  removeFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  setRecipes: (recipes: Meal[]) => void;
  getRecipes: () => Meal[];
  getFavoriteRecipes: () => Meal[];
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  favorites: [],
  getRecipes: () => get().recipes,
  getFavoriteRecipes: () => get().favorites,
  addRecipe: (recipe) =>
    set((state) => ({
      recipes: [...state.recipes, recipe],
    })),
  addFavorite: (recipeId) =>
    set((state) => {
      const recipe = state.recipes.find((meal) => meal.idMeal === recipeId);
      if (recipe) {
        return {
          favorites: [...state.favorites, recipe],
        };
      }
      return state;
    }),
  removeFavorite: (recipeId) =>
    set((state) => ({
      favorites: state.favorites.filter((meal) => meal.idMeal !== recipeId),
    })),
  isFavorite: (recipeId) => {
    return get().favorites.find((meal) => meal.idMeal === recipeId) !== undefined;
  },
  setRecipes: (recipes) => set({ recipes }),
}));
