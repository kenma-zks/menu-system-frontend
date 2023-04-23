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
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchCategories } from "../../api/api";
import useInputProduct from "../../hooks/use-input";
import { setCategories } from "../../store/categoriesSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deleteProduct, updateProduct } from "../../store/productsSlice";
import { ICategoryData, IProductData } from "../../types/types";
import UploadImage from "./UploadImage";
import useDefaultInput from "../../hooks/use-defaultinput";

interface EditProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: IProductData | null;
}

const EditProductDrawer: React.FC<EditProductDrawerProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const categories = useAppSelector((state) => state.categories.categories);
  const dispatch = useAppDispatch();
  const [imagePreview, setImagePreview] = useState<File | null>(null);
  const toast = useToast();

  const fetchCategoriesCallback = useCallback(() => {
    fetchCategories<ICategoryData[]>().then((data) => {
      const transformedData = data.map((item) => {
        return {
          id: item.id,
          category_name: item.category_name,
        };
      });
      dispatch(setCategories(transformedData));
    });
  }, []);

  useEffect(() => {
    fetchCategoriesCallback();
  }, [fetchCategoriesCallback]);

  const nameInput = useDefaultInput(
    (value) => (value as string).trim() !== "",
    product?.food_name ?? ""
  );
  const priceInput = useDefaultInput(
    (value) => (value as number) > 0,
    product?.food_price ?? ""
  );
  const availableInput = useDefaultInput(
    (value) => (value as string).trim() !== "",
    product?.food_available ?? ""
  );
  const categoryInput = useDefaultInput(
    (value) => (value as string).trim() !== "",
    product?.category_id ?? ""
  );
  const descriptionInput = useDefaultInput(
    (value) => (value as string).trim() !== "",
    product?.food_description ?? ""
  );

  const formIsValid =
    nameInput.isValid &&
    priceInput.isValid &&
    availableInput.isValid &&
    categoryInput.isValid &&
    descriptionInput.isValid;

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (formIsValid) {
      const productData = new FormData();
      productData.append("food_id", String(product?.food_id));
      productData.append("food_name", nameInput.value.toString());
      productData.append("food_price", priceInput.value.toString());
      productData.append("category_id", categoryInput.value.toString());
      productData.append("food_available", availableInput.value.toString());
      productData.append("food_description", descriptionInput.value.toString());
      if (imagePreview) {
        productData.append("food_image", imagePreview);
      }
      fetch(`http://127.0.0.1:8000/api/menu/fooddetails/${product?.food_id}/`, {
        method: "PUT",
        body: productData,
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(updateProduct(data));
          toast({
            title: "Product Updated",
            description: "Product has been updated successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        });
      console.log(productData);
    } else {
      toast({
        title: "Invalid Input",
        description: "Please check your input",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setImagePreview(null);
    nameInput.reset();
    priceInput.reset();
    availableInput.reset();
    categoryInput.reset();
    descriptionInput.reset();
  }, [product]);

  const leastDestructiveRef = useRef<HTMLButtonElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [alertIsOpen, setAlertIsOpen] = useState(false);

  const onDeleteClick = () => {
    setAlertIsOpen(true);
  };

  const alertOnClose = () => {
    setAlertIsOpen(false);
  };

  const onDeleteConfirm = async () => {
    fetch(`http://127.0.0.1:8000/api/menu/fooddetails/${product?.food_id}/`, {
      method: "DELETE",
    }).then(() => {
      dispatch(deleteProduct(product?.food_id));
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      alertOnClose();
    });
  };

  return (
    <form encType="multipart/form-data">
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent key={product?.food_id}>
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
                  onChange={nameInput.valueChangeHandler}
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
                      onChange={priceInput.valueChangeHandler}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl w="40%">
                  <Text pb="2">Available</Text>
                  <Select
                    placeholder="Available"
                    defaultValue={
                      product ? String(product.food_available) : undefined
                    }
                    onChange={availableInput.valueChangeHandler}
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
                    onChange={categoryInput.valueChangeHandler}
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
                  onChange={descriptionInput.valueChangeHandler}
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
                    <Button
                      ref={cancelRef}
                      onClick={() => setAlertIsOpen(false)}
                    >
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
  );
};

export default EditProductDrawer;
