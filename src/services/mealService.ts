import axios from 'axios';
import { Meal } from '../types/mealTypes';

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

export const getAllMeals = async () => {
  const { data } = await axios.get<{ meals: Meal[]}>(`${API_URL}/search.php?s=`);
  return data.meals;
};

export const getMealById = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/lookup.php?i=${id}`);
  return data.meals[0];
};

export const getCategories = async () => {
  const { data } = await axios.get(`${API_URL}/categories.php`);
  return data.categories;
}
