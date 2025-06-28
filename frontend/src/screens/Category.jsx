import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ListRecipes from '../components/ListRecipes';
import { fetchCategoryWiseRecipes } from '../store/slices/recipe';

export default function Category({navigation}) {
    const route = useRoute();

    const { category } = route.params;
    const recipes = useSelector((state) => state.recipes.recipes);

    const dispatch = useDispatch()
    
    useEffect(()=>{
        if(category){
            console.log('category in Category screen', category)
            dispatch(fetchCategoryWiseRecipes(category))
        }
    },[category,dispatch])

  return (
    <View>
      <Text>{category} Category page</Text>
      <ListRecipes recipes={recipes}/>
    </View>
  )
}