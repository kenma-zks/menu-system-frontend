import {
  Box,
  Button,
  Flex,
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
import React, { useCallback, useEffect, useState } from "react";
import { fetchCategories } from "../../api/api";
import useInput from "../../hooks/use-input";
import { setCategories } from "../../store/categoriesSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { ICategoryData, IProductData } from "../../types/types";
import UploadImage from "../UI/UploadImage";

interface ICreateProductFormProps {
  onReceiveFormData: (data: IProductData) => void;
}

const CreateProductForm = ({ onReceiveFormData }: ICreateProductFormProps) => {
  const [imagePreview, setImagePreview] = useState<File | null>(null);

  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);

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

  const {
    value: enteredProductName,
    isValid: enteredProductNameIsValid,
    hasError: enteredProductNameHasError,
    valueChangeHandler: productNameChangeHandler,
    inputBlurHandler: productNameBlurHandler,
    reset: resetProductNameInput,
  } = useInput((value) => (value as string).trim() !== "");

  const {
    value: enteredPrice,
    isValid: enteredPriceIsValid,
    hasError: enteredPriceHasError,
    valueChangeHandler: priceChangeHandler,
    inputBlurHandler: priceBlurHandler,
    reset: resetPriceInput,
  } = useInput((value) => (value as number) > 0);

  const {
    value: enteredCategory,
    isValid: enteredCategoryIsValid,
    hasError: enteredCategoryHasError,
    valueChangeHandler: categoryChangeHandler,
    inputBlurHandler: categoryBlurHandler,
    reset: resetCategoryInput,
  } = useInput((value) => (value as string).trim() !== "");

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: enteredDescriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetDescriptionInput,
  } = useInput((value) => (value as string).trim() !== "");

  const formIsValid =
    enteredProductNameIsValid &&
    enteredPriceIsValid &&
    enteredCategoryIsValid &&
    enteredDescriptionIsValid &&
    imagePreview !== null;

  function submitHandler(event: React.FormEvent<HTMLDivElement>) {
    event.preventDefault();

    if (formIsValid) {
      const productData = {
        food_name: enteredProductName,
        food_price: enteredPrice,
        category_id: enteredCategory,
        food_description: enteredDescription,
        food_image: imagePreview,
        food_available: true,
      };
      resetProductNameInput();
      resetPriceInput();
      resetCategoryInput();
      resetDescriptionInput();
      setImagePreview(null);
      onReceiveFormData(productData);
      console.log(productData);
    } else {
      let errorMessage = "Please enter ";
      if (!enteredProductName.trim()) {
        errorMessage += "Product name, ";
      }
      if (!enteredPrice || Number(enteredPrice) <= 0) {
        errorMessage += "Price, ";
      }
      if (!enteredCategory) {
        errorMessage += "Category, ";
      }
      if (!enteredDescription.trim()) {
        errorMessage += "Description, ";
      }
      if (!imagePreview) {
        errorMessage += "Image, ";
      }

      errorMessage = errorMessage.slice(0, -2) + ".";
      toast({
        title: "Invalid input.",
        description: errorMessage,
        status: "error",
        duration: 9000,
        isClosable: true,
        variant: "left-accent",
      });
    }
  }
  const toast = useToast();

  return (
    <VStack display={"flex"} alignItems={"start"} p="4" w="100%">
      <VStack
        as="form"
        spacing="4"
        onSubmit={submitHandler}
        encType="multipart/form-data"
      >
        <FormControl isInvalid={enteredProductNameHasError}>
          <Text pb="2">Product name</Text>
          <Input
            placeholder="Product name"
            onChange={productNameChangeHandler}
            onBlur={productNameBlurHandler}
            value={enteredProductName}
          ></Input>
        </FormControl>
        <HStack w="100%">
          <FormControl w="50%" isInvalid={enteredPriceHasError}>
            <Text pb="2">Price</Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children="Rs" />
              <Input
                type="number"
                placeholder="Price"
                onChange={priceChangeHandler}
                onBlur={priceBlurHandler}
                value={enteredPrice}
              />
            </InputGroup>
          </FormControl>
          <FormControl isInvalid={enteredCategoryHasError}>
            <Text pb="2">Category</Text>
            <Select
              placeholder="Select category"
              onChange={categoryChangeHandler}
              onBlur={categoryBlurHandler}
              value={enteredCategory}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </Select>
          </FormControl>
        </HStack>

        <FormControl isInvalid={enteredDescriptionHasError}>
          <Text pb="2">Description</Text>
          <Textarea
            placeholder="Description"
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
            value={enteredDescription}
          ></Textarea>
        </FormControl>
        <FormControl>
          <Text pb="2">Image</Text>
          <UploadImage onImageUpload={setImagePreview} />
        </FormControl>
        <FormControl>
          <Button type="submit" colorScheme="orange" size="md" w="full">
            Create
          </Button>
        </FormControl>
      </VStack>
    </VStack>
  );
};

export default CreateProductForm;
