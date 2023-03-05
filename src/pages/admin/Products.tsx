import { ChevronDownIcon, Search2Icon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import ProductCard from '../../components/Card/ProductCard'
import CreateProductForm from '../../components/Form/CreateProductForm'
import AdminNavBar from '../../components/UI/AdminNavbar'
import { IProductData } from '../../types/types'

const Products = () => {
  const [isError, setIsError] = useState<boolean | null>(null)
  const toast = useToast()

  async function createProductHandler(productData: IProductData) {
    try {
      const formData = new FormData()
      formData.append('food_name', productData.food_name)
      formData.append('food_price', productData.food_price.toString())
      formData.append('category_id', productData.category_id.toString())
      formData.append('food_description', productData.food_description)
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
      const data = await response.json()
      console.log(data)
      if (response.status === 400) {
        setIsError(true)
      }
      setIsError(!response.ok)
    } catch (error) {
      setIsError(true)
    }
  }

  useEffect(() => {
    if (isError !== null) {
      if (isError) {
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
      setIsError(null)
    }, 3000)
  }, [isError, toast])

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
                </TabList>
                <Box>
                  <TabPanels>
                    <TabPanel bgColor={'white'} p="8">
                      <VStack alignItems={'flex-start'}>
                        <HStack pb="6" spacing={0} width={'600px'}>
                          <Menu>
                            <MenuButton
                              as={Button}
                              rightIcon={<ChevronDownIcon />}
                              width="25%"
                              backgroundColor="white"
                              border="1px"
                              borderColor="gray.400"
                              borderRadius="md"
                              _hover={{ bg: 'white' }}
                              _expanded={{ bg: 'white' }}
                              _focus={{ bg: 'white' }}
                              borderRightRadius="0"
                              iconSpacing="20"
                              fontSize={'sm'}
                              color="gray.600"
                            >
                              Filter
                            </MenuButton>
                            <MenuList>
                              <MenuItem>Category 1</MenuItem>
                              <MenuItem>Category 2</MenuItem>
                            </MenuList>
                          </Menu>
                          <InputGroup width="75%">
                            <InputLeftElement
                              pointerEvents="none"
                              children={<Search2Icon color="gray" />}
                            />
                            <Input
                              borderLeftRadius="0"
                              borderColor="gray.400"
                              placeholder="Search products ..."
                            />
                          </InputGroup>
                        </HStack>
                        <ProductCard />
                      </VStack>
                    </TabPanel>
                    <TabPanel bgColor="white">
                      <CreateProductForm
                        onReceiveFormData={createProductHandler}
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
