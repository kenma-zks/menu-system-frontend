import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import CreateProductForm from '../../components/Form/CreateProductForm'
import AdminNavBar from '../../components/UI/AdminNavbar'
import AllCategories from '../../components/UI/AllCategories'
import AllProducts from '../../components/UI/AllProducts'
import { useAppDispatch } from '../../store/hooks'
import { addProduct } from '../../store/productsSlice'
import { ICategoryData, IProductData } from '../../types/types'

const Products = () => {
  const [isProductError, setIsProductError] = useState<boolean | null>(null)
  const [isCategoryError, setIsCategoryError] = useState<boolean | null>(null)

  const dispatch = useAppDispatch()
  const toast = useToast()

  async function createProductHandler(productData: IProductData) {
    try {
      const formData = new FormData()
      formData.append('food_name', productData.food_name)
      formData.append('food_price', productData.food_price.toString())
      formData.append('food_description', productData.food_description)
      formData.append('category_id', productData.category_id.toString())
      if (productData.food_image) {
        formData.append('food_image', productData.food_image)
      }
      const response = await fetch(
        'http://127.0.0.1:8000/api/menu/fooddetails/',
        {
          method: 'POST',
          body: formData,
        },
      )
      if (response.status === 400) {
        setIsProductError(true)
      }
      setIsProductError(!response.ok)
      dispatch(addProduct(productData))
    } catch (error) {
      setIsProductError(true)
    }
  }

  async function createCategoryHandler(categoryData: ICategoryData) {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/menu/foodcategory/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData),
        },
      )
      if (response.status === 400) {
        setIsCategoryError(true)
      }
      setIsCategoryError(!response.ok)
    } catch (error) {
      setIsCategoryError(true)
    }
  }

  useEffect(() => {
    if (isProductError !== null) {
      if (isProductError) {
        toast({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          variant: 'left-accent',
          duration: 3000,
        })
      } else {
        toast({
          title: `Product created successfully`,
          status: 'success',
          isClosable: true,
          variant: 'left-accent',
          duration: 3000,
        })
      }
    }
    setTimeout(() => {
      setIsProductError(null)
    }, 3000)
  }, [isProductError, toast])

  useEffect(() => {
    setTimeout(() => {
      setIsCategoryError(null)
    }, 3000)
  }, [isCategoryError])

  return (
    <>
      <Box minH="100vh">
        <Box backgroundColor="#F0F2F4">
          <Box p="4">
            <AdminNavBar />
          </Box>
          <VStack alignItems={'flex-start'}>
            <Box w={'full'}>
              <Tabs colorScheme="orange" align="start">
                <TabList px="8">
                  <Tab>All products</Tab>
                  <Tab>Create products</Tab>
                  <Tab>All categories</Tab>
                </TabList>
                <Box>
                  <TabPanels>
                    <TabPanel bgColor={'white'} p="8">
                      <AllProducts />
                    </TabPanel>
                    <TabPanel bgColor="white">
                      <CreateProductForm
                        onReceiveFormData={createProductHandler}
                      />
                    </TabPanel>
                    <TabPanel bgColor={'white'}>
                      <AllCategories
                        onReceiveCategoryData={createCategoryHandler}
                      />
                    </TabPanel>
                  </TabPanels>
                </Box>
              </Tabs>
            </Box>
          </VStack>
        </Box>
      </Box>
    </>
  )
}

export default Products
