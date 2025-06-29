import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ListRecipes from '../components/ListRecipes';
import { fetchCategoryWiseRecipes } from '../store/slices/recipe';

export default function Category({navigation}) {
  const [page,setPage] = useState(1)
    const route = useRoute();
 
    const { category } = route.params;
    const recipes = useSelector((state) => state.recipes.recipes);
    const dispatch = useDispatch()
    
    useEffect(()=>{
        if(category){
            dispatch(fetchCategoryWiseRecipes({category,page:1}))
        }
    },[category,dispatch])

    const fetchMoreRecipes = () => {
        setPage(prevPage => prevPage + 1);
        dispatch(fetchCategoryWiseRecipes({category, page : page + 1}));
    }

  return (
    <View>
      <Text style={styles.heading}>Choose your favorite {category}</Text>
      <ListRecipes recipes={recipes} fetchMore={fetchMoreRecipes}/>
    </View>
  )
}

const styles = StyleSheet.create({
    heading:{
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    }
})