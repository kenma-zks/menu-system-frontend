import { Box, Flex, HStack, Image, Text, VStack, Wrap } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchFoodDetails } from '../../api/api'
import { IProductData } from '../../types/types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setProducts } from '../../store/productsSlice'
import EditProductDrawer from '../UI/EditProductDrawer'

const ProductCard = () => {
  const products = useAppSelector((state) => state.products.products)
  const dispatch = useAppDispatch()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<IProductData | null>(
    null,
  )
  console.log(selectedProduct)

  const fetchFoodDetailsCallback = useCallback(() => {
    fetchFoodDetails<IProductData[]>().then((data) => {
      const transformedData = data.map((item) => {
        return {
          id: item.id,
          food_name: item.food_name,
          food_price: item.food_price,
          category_id: item.category_id,
          food_image: item.food_image,
          food_available: item.food_available,
          food_description: item.food_description,
        }
      })
      dispatch(setProducts(transformedData))
      console.log(transformedData)
    })
  }, [])

  useEffect(() => {
    fetchFoodDetailsCallback()
  }, [fetchFoodDetailsCallback])

  useEffect(() => {
    const urls = products.map((product) => {
      if (product.food_image instanceof File) {
        return URL.createObjectURL(product.food_image)
      }
      return ''
    })
    return () => {
      urls.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [products])

  const handleProductClick = (product: IProductData) => {
    setSelectedProduct(product)
    setIsDrawerOpen(true)
  }

  return (
    <>
      <Flex flexWrap={'wrap'}>
        {products.map((product) => (
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
            onClick={() => handleProductClick(product)}
          >
            <HStack alignItems={'center'} spacing="2">
              <Box p="2">
                <Image
                  src={
                    product.food_image instanceof File
                      ? URL.createObjectURL(product.food_image)
                      : product.food_image ?? undefined
                  }
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
                    {product.food_name}
                  </Box>
                </Box>
                <Box>
                  <Box color="gray" fontSize="sm" fontWeight={'medium'}>
                    $ {product.food_price}
                  </Box>
                </Box>
                <Box>
                  <Box>
                    {product.food_available ? (
                      <Box
                        color="green.500"
                        fontSize="sm"
                        fontWeight={'medium'}
                      >
                        <Text>Available</Text>
                      </Box>
                    ) : (
                      <Box color="red.500" fontSize="sm" fontWeight={'medium'}>
                        <Text>Not Available</Text>
                      </Box>
                    )}
                  </Box>
                </Box>
              </VStack>
            </HStack>
          </Box>
        ))}
      </Flex>
      {selectedProduct && (
        <EditProductDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          product={selectedProduct}
        />
      )}
    </>
  )
}

export default ProductCard
