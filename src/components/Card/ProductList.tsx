import { Box, Flex, HStack, Image, Text, VStack, Wrap } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchFoodDetails } from '../../api/api'
import { IProductData } from '../../types/types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setProducts } from '../../store/productsSlice'
import EditProductDrawer from '../UI/EditProductDrawer'
import ProductCard from './ProductCard'

const ProductList = ({
  filteredProduct,
}: {
  filteredProduct: IProductData[]
}) => {
  const products = useAppSelector((state) => state.products.products)
  const dispatch = useAppDispatch()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<IProductData | null>(
    null,
  )

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
        {filteredProduct.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            handleProductClick={handleProductClick}
          />
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

export default ProductList
