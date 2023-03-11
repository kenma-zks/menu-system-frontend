import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  FormControl,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchCategories } from '../../api/api'
import { setCategories } from '../../store/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { updateProduct } from '../../store/productsSlice'
import { ICategoryData, IProductData } from '../../types/types'
import UploadImage from './UploadImage'

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
  const categories = useAppSelector((state) => state.categories.categories)
  const dispatch = useAppDispatch()
  const [imagePreview, setImagePreview] = useState<File | null>(null)
  const toast = useToast()

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
                <FormControl w="40%">
                  <Text pb="2">Available</Text>
                  <Select
                    placeholder="Select Availability"
                    defaultValue={product?.food_available?.toString()}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Select>
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
                <UploadImage
                  onImageUpload={setImagePreview}
                  defaultImage={
                    product?.food_image instanceof File
                      ? URL.createObjectURL(product?.food_image)
                      : product?.food_image
                  }
                />
              </FormControl>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button type="submit" colorScheme="orange" size="md" w="full">
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default EditProductDrawer
