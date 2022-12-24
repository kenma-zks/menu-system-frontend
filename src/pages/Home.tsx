import React, { useCallback, useEffect, useState } from 'react'
import {
  background,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  chakra,
  Circle,
  Flex,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import art from '../assets/drawkit.png'
import { SearchIcon } from '@chakra-ui/icons'
import ButtonComponent from '../components/FormElements/ButtonComponent'
import art2 from '../assets/drawkit2.png'
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs'
import { FiShoppingCart } from 'react-icons/fi'
import MenuItems from '../components/Card/MenuItems'

const Home = () => {
  const [activeTag, setActiveTag] = useState('Pizza')

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  )

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/menu/foodcategory/',
      )
      if (!response.ok) {
        throw new Error('Something went wrong')
      }
      const data = await response.json()
      const transformedData = data.map((item: any) => {
        return {
          id: item.id,
          name: item.category_name,
        }
      })
      setCategories(transformedData)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return (
    <Box margin="-1rem" h="100vh">
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
                  name={category.name}
                  setActiveTag={setActiveTag}
                  isActive={activeTag === category.name}
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
          <MenuItems />
        </Box>
      </Box>
    </Box>
  )
}

export default Home
