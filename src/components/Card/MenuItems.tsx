import React from 'react'
import {
  Flex,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
} from '@chakra-ui/react'
import { FiShoppingCart } from 'react-icons/fi'

interface MenuItemsProps {
  name: string
  price: number
  imageURL: any
}

const MenuItems: React.FC<MenuItemsProps> = ({ name, price, imageURL }) => {
  return (
    <Flex w="full" alignItems="center" justifyContent="flex-start">
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        maxW="sm"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
      >
        <Image src={imageURL} alt={`Picture of ${name}`} roundedTop="lg" />

        <Box p="6">
          <Flex justifyContent="space-between" alignContent="center">
            <Box fontSize="xl" fontWeight="semibold" as="h4" lineHeight="tight">
              {name}
            </Box>
          </Flex>

          <Flex justifyContent="space-between" alignContent="center">
            <Box fontSize="xl" color={useColorModeValue('gray.800', 'white')}>
              Rs {price}
            </Box>
            <Tooltip
              label="Add to cart"
              bg="white"
              placement={'top'}
              color={'gray.800'}
              fontSize={'1.2em'}
            >
              <chakra.a href={'#'} display={'flex'}>
                <Icon as={FiShoppingCart} h={6} w={6} alignSelf={'center'} />
              </chakra.a>
            </Tooltip>
          </Flex>
        </Box>
      </Box>
    </Flex>
  )
}

export default MenuItems
