import React, { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import art from '../assets/drawkit.png'
import { SearchIcon } from '@chakra-ui/icons'
import ButtonComponent from '../components/FormElements/ButtonComponent'
import MenuItems from '../components/Card/MenuItems'
import { fetchCategories, fetchFoodDetails } from '../api/api'

interface ICategory {
  id: number
  category_name: string
}

interface IFoodDetails {
  id: number
  food_name: string
  food_price: number
  food_image: string
}

const Home = () => {
  const [activeTag, setActiveTag] = useState('Pizza')

  const [categories, setCategories] = useState<ICategory[]>([])

  const [foodDetails, setFoodDetails] = useState<IFoodDetails[]>([])

  const fetchCategoriesCallback = useCallback(() => {
    console.log('fetchCategoriesCallback')
    fetchCategories<ICategory[]>().then((data) => {
      const transformedData = data.map((item) => {
        return {
          id: item.id,
          category_name: item.category_name,
        }
      })
      setCategories(transformedData)
    })
  }, [])

  useEffect(() => {
    fetchCategoriesCallback()
  }, [fetchCategoriesCallback])

  const fetchFoodDetailsCallback = useCallback(() => {
    console.log('fetchFoodDetailsCallback')
    fetchFoodDetails<IFoodDetails[]>().then((data) => {
      const transformedData = data.map((item) => {
        return {
          id: item.id,
          food_name: item.food_name,
          food_price: item.food_price,
          food_image: item.food_image,
        }
      })
      setFoodDetails(transformedData)
    })
  }, [])

  useEffect(() => {
    fetchFoodDetailsCallback()
  }, [fetchFoodDetailsCallback])

  return (
    <Box h="100vh">
      <Box
        backgroundImage={`url(${art})`}
        h="40vh"
        width="100%"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
      >
        <InputGroup
          background="white"
          width="80%"
          marginLeft="10%"
          position="relative"
          top="78%"
          borderRadius="2rem"
          height="2.8rem"
        >
          <Input
            placeholder="Search for something tasty..."
            borderRadius="2rem"
            height="2.8rem"
            fontSize={{ base: '0.8rem', md: '1rem' }}
          />
          <InputRightElement pointerEvents="none" height="2.8rem">
            <Icon
              as={SearchIcon}
              color="white"
              background="#53946B"
              borderRadius="2rem"
              height="2rem"
              width="2rem"
              padding="0.5rem"
              marginRight="0.5rem"
            />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Box width="100%" background="#F2F2F2" height="60vh">
        <Box
          height="15vh"
          padding="15px"
          fontSize={{ base: '0.9rem', md: '1rem', lg: '1.2rem' }}
        >
          <Box display="flex" justifyContent="space-between">
            <Text fontWeight="semibold">Categories</Text>
            <Link fontWeight="bold" color="#854224" href="#">
              See all
            </Link>
          </Box>
          <Stack
            overflowX={{ base: 'scroll', md: 'hidden' }}
            direction="row"
            spacing={2}
            align="center"
            height="100%"
          >
            {categories.map((category) => {
              return (
                <ButtonComponent
                  key={category.id}
                  name={category.category_name}
                  setActiveTag={setActiveTag}
                  isActive={activeTag === category.category_name}
                />
              )
            })}
          </Stack>
        </Box>
        <Box
          padding="15px"
          fontSize={{ base: '0.9rem', md: '1rem', lg: '1.2rem' }}
        >
          <Box display="flex" justifyContent="space-between" pb="1rem">
            <Text fontWeight="semibold">Menu</Text>
            <Link fontWeight="bold" color="#854224" href="#">
              See all
            </Link>
          </Box>
          <Stack
            overflowX={{ base: 'scroll', md: 'hidden' }}
            direction="row"
            spacing={2}
            align="center"
            height="100%"
          >
            {foodDetails.map((food) => {
              return (
                <MenuItems
                  key={food.id}
                  name={food.food_name}
                  price={food.food_price}
                  imageURL={food.food_image}
                />
              )
            })}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default Home
