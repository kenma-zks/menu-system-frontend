import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fetchCategories } from '../../api/api'
import useInput from '../../hooks/use-input'
import { setCategories } from '../../store/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { deleteProduct, updateProduct } from '../../store/productsSlice'
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

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: enteredNameHasError,
    valueChangeHandler: nameChangeHandler,
  } = useInput((value) => (value as string).trim() !== '')

  const {
    value: enteredPrice,
    isValid: enteredPriceIsValid,
    hasError: enteredPriceHasError,
    valueChangeHandler: priceChangeHandler,
  } = useInput((value) => (value as number) > 0)

  const {
    value: enteredAvailable,
    isValid: enteredAvailableIsValid,
    hasError: enteredAvailableHasError,
    valueChangeHandler: availableChangeHandler,
  } = useInput((value) => (value as string).trim() !== '')

  const {
    value: enteredCategory,
    isValid: enteredCategoryIsValid,
    hasError: enteredCategoryHasError,
    valueChangeHandler: categoryChangeHandler,
  } = useInput((value) => (value as string).trim() !== '')

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: enteredDescriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
  } = useInput((value) => (value as string).trim() !== '')

  const formIsValid =
    enteredNameIsValid &&
    enteredPriceIsValid &&
    enteredAvailableIsValid &&
    enteredCategoryIsValid &&
    enteredDescriptionIsValid

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault()
    console.log('submit')
    if (formIsValid) {
      const productData = {
        id: product?.id,
        food_name: enteredName,
        food_price: enteredPrice,
        category_id: enteredCategory,
        food_description: enteredDescription,
        food_image: imagePreview || product?.food_image,
        food_available: true,
      }
      fetch('http://127.0.0.1:8000/api/menu/fooddetails/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(updateProduct(data))
          toast({
            title: 'Product Updated',
            description: 'Product has been updated successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        })
    } else {
      toast({
        title: 'Invalid Input',
        description: 'Please check your input',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const leastDestructiveRef = useRef<HTMLButtonElement | null>(null)
  const cancelRef = useRef<HTMLButtonElement | null>(null)
  const [alertIsOpen, setAlertIsOpen] = useState(false)

  const onDeleteClick = () => {
    setAlertIsOpen(true)
  }

  const alertOnClose = () => {
    setAlertIsOpen(false)
  }

  const onDeleteConfirm = async () => {
    fetch(`http://127.0.0.1:8000/api/menu/fooddetails/${product?.id}/`, {
      method: 'DELETE',
    }).then(() => {
      dispatch(deleteProduct(product?.id))
      toast({
        title: 'Product Deleted',
        description: 'Product has been deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onClose()
    })
  }

  return (
    <form>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
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
                  onChange={nameChangeHandler}
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
                      onChange={priceChangeHandler}
                      defaultValue={product?.food_price}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl w="40%">
                  <Text pb="2">Available</Text>
                  <Select
                    placeholder="Available"
                    onChange={availableChangeHandler}
                    defaultValue={
                      product ? String(product.food_available) : undefined
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <Text pb="2">Category</Text>
                  <Select
                    placeholder="Select Category"
                    onChange={categoryChangeHandler}
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
                  onChange={descriptionChangeHandler}
                  defaultValue={product?.food_description}
                />
              </FormControl>

              <FormControl>
                <Text pb="2">Image</Text>
                <UploadImage
                  onImageUpload={(file) => setImagePreview(file)}
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
            <Button
              variant="outline"
              mr={3}
              onClick={onDeleteClick}
              ref={leastDestructiveRef}
              colorScheme="red"
              size="md"
              w="20%"
            >
              Delete
            </Button>
            <AlertDialog
              isOpen={alertIsOpen}
              leastDestructiveRef={leastDestructiveRef}
              onClose={alertOnClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Product
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme="red" onClick={onDeleteConfirm} ml={3}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>

            <Button
              type="submit"
              onClick={submitHandler}
              colorScheme="orange"
              size="md"
              w="20%"
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </form>
  )
}

export default EditProductDrawer
