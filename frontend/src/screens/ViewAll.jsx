import { View } from 'react-native';
import React, { useState } from 'react';
import ListRecipes from '../components/ListRecipes';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';

export default function ViewAll() {
  const [visibleCount, setVisibleCount] = useState(8); 

  const route = useRoute();

  const { recipesIds } = route.params;
  const { recipes } = useSelector((state) => state.recipes); 

  const filteredRecipes = recipes.filter(r => recipesIds.includes(r._id));
  const visibleRecipes = filteredRecipes.slice(0, visibleCount);

  const fetchMoreRecipes = () => {
    if (visibleCount < filteredRecipes.length) {
      setVisibleCount(prevCount => prevCount + 4);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ListRecipes recipes={visibleRecipes} fetchMore={fetchMoreRecipes} />
    </View>
  );
}
