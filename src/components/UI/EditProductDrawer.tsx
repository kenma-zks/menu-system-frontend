import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FiImage, FiX } from 'react-icons/fi'
import { Form } from 'react-router-dom'
import { fetchCategories, fetchFoodDetails } from '../../api/api'
import { setCategories } from '../../store/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setProducts } from '../../store/productsSlice'
import { ICategoryData, IProductData } from '../../types/types'

interface EditProductDrawerProps {
  isOpen: boolean
  onClose: () => void
  product: IProductData | null
}

const EditProductDrawer: React.FC<EditProductDrawerProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [imagePreview, setImagePreview] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const categories = useAppSelector((state) => state.categories.categories)
  const dispatch = useAppDispatch()

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

  const fetchCategoriesCallback = useCallback(() => {
    fetchCategories<ICategoryData[]>().then((data) => {
      const transformedData = data.map((item) => {
        return {
          id: item.id,
          category_name: item.category_name,
        }
      })
      dispatch(setCategories(transformedData))
    })
  }, [])

  useEffect(() => {
    fetchCategoriesCallback()
  }, [fetchCategoriesCallback])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setImagePreview(file)
    }
  }

  const handleImageRemove = () => {
    setImagePreview(null)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(file)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerContent key={product?.id}>
          <Box borderBottomWidth="2px">
            <DrawerCloseButton />
            <DrawerHeader>Edit Product</DrawerHeader>
          </Box>

          <DrawerBody>
            <VStack spacing={4}>
              <FormControl>
                <Text pb="2">Name</Text>
                <Input
                  placeholder="Product Name"
                  defaultValue={product?.food_name}
                />
              </FormControl>
              <HStack w="100%">
                <FormControl w="60%">
                  <Text pb="2">Price</Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" children="$" />
                    <Input
                      type="number"
                      placeholder="Price"
                      defaultValue={product?.food_price}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <Text pb="2">Category</Text>
                  <Select
                    placeholder="Select Category"
                    defaultValue={product?.category_id}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.category_name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>
              <FormControl>
                <Text pb="2">Description</Text>
                <Textarea
                  placeholder="Product Description"
                  defaultValue={product?.food_description}
                />
              </FormControl>
              <FormControl>
                <Text pb="2">Image</Text>
                <Box
                  borderRadius="md"
                  width="100%"
                  border={dragActive ? '2px dashed blue' : '2px dashed #e2e8f0'}
                  height="200px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <Flex
                      position="relative"
                      alignItems="flex-start"
                      height="100%"
                      width="100%"
                    >
                      <Box
                        bgImage={URL.createObjectURL(imagePreview)}
                        bgSize="cover"
                        bgPosition="center"
                        height="100%"
                        width="100%"
                      >
                        <Button
                          position="absolute"
                          right={2}
                          top={2}
                          size="sm"
                          colorScheme="red"
                          onClick={handleImageRemove}
                        >
                          <FiX />
                        </Button>
                      </Box>
                    </Flex>
                  ) : (
                    <VStack alignItems="center" spacing="2">
                      <FiImage size="40px" />
                      <HStack>
                        <Text fontSize="sm">Drag and Drop or</Text>
                        <Text
                          fontSize="sm"
                          fontWeight={'semibold'}
                          cursor="pointer"
                          onClick={() =>
                            document.getElementById('fileInput')?.click()
                          }
                        >
                          Browse
                        </Text>
                        <input
                          type={'file'}
                          accept=".jpg, .jpeg, .png"
                          id="fileInput"
                          style={{ display: 'none' }}
                          onChange={handleImageUpload}
                        ></input>
                      </HStack>

                      <Text fontSize="xs" color="gray.500">
                        Files supported : .jpg, .jpeg, .png (Max 10MB)
                      </Text>
                    </VStack>
                  )}
                </Box>
              </FormControl>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button type="submit" colorScheme="orange" size="md" w="full">
              Create
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default EditProductDrawer
