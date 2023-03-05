import { Box, Flex, HStack, Image, VStack, Wrap } from '@chakra-ui/react'
import item from '../../assets/login3.webp'
import item2 from '../../assets/login2.webp'
import React from 'react'

const DUMMY_PRODUCT = [
  {
    id: '1',
    name: 'Fried Rice ',
    price: '10',
    available: 'Available',
    image: item,
  },
  {
    id: '2',
    name: 'Shrimp',
    price: '10',
    available: 'Available',
    image: item2,
  },
  {
    id: '3',
    name: 'Nasi Lemak',
    price: '20',
    available: 'Not available',
    image: item,
  },
  {
    id: '4',
    name: 'Nasi Goreng',
    price: '40',
    available: 'Available',
    image: item2,
  },
  {
    id: '5',
    name: 'Fried Rice',
    price: '10',
    available: 'Available',
    image: item,
  },
  {
    id: '6',
    name: 'Shrimp',
    price: '10',
    available: 'Not available',
    image: item2,
  },
  {
    id: '7',
    name: 'Nasi Lemak',
    price: '20',
    available: 'Available',
    image: item,
  },
  {
    id: '8',
    name: 'Nasi Goreng',
    price: '40',
    available: 'Not available',
    image: item2,
  },
]

const ProductCard = () => {
  return (
    <Flex flexWrap={'wrap'}>
      {DUMMY_PRODUCT.map((product) => (
        <Box
          maxW={'270px'}
          maxH={'110px'}
          minW={'270px'}
          minH={'110px'}
          borderRadius="4"
          borderWidth={1}
          width="25%"
          flexShrink={0}
          mr="4"
          mb="4"
          key={product.id}
          _hover={{ boxShadow: 'md', cursor: 'pointer' }}
        >
          <HStack alignItems={'center'} spacing="2">
            <>
              <Box p="2" key={product.id}>
                <Image
                  src={product.image}
                  alt="item"
                  minW={'100px'}
                  minH={'90px'}
                  maxW={'100px'}
                  maxH={'90px'}
                  borderRadius="4"
                  objectFit={'cover'}
                />
              </Box>
              <VStack alignItems={'flex-start'} pl="1">
                <Box>
                  <Box
                    fontWeight="bold"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    maxW={'120px'}
                  >
                    {product.name}
                  </Box>
                </Box>
                <Box>
                  <Box color="gray" fontSize="sm" fontWeight={'medium'}>
                    $ {product.price}
                  </Box>
                </Box>
                <Box>
                  <Box>
                    {product.available === 'Available' ? (
                      <Box
                        color="green.500"
                        fontSize="sm"
                        fontWeight={'medium'}
                      >
                        {product.available}
                      </Box>
                    ) : (
                      <Box color="red.500" fontSize="sm" fontWeight={'medium'}>
                        {product.available}
                      </Box>
                    )}
                  </Box>
                </Box>
              </VStack>
            </>
          </HStack>
        </Box>
      ))}
    </Flex>
  )
}

export default ProductCard
