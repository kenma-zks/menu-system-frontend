import { AddIcon, ArrowBackIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { fetchFoodDetails } from "../../api/api";
import { useAppDispatch } from "../../store/hooks";
import { setProducts } from "../../store/productsSlice";
import { IProductData } from "../../types/types";

interface FoodDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodItem: IProductData | null;
}

const FoodDetailsModal: React.FC<FoodDetailsModalProps> = ({
  isOpen,
  onClose,
  foodItem,
}) => {
  const dispatch = useAppDispatch();
  const toast = useToast();

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
        };
      });
      dispatch(setProducts(transformedData));
    });
  }, []);

  useEffect(() => {
    fetchFoodDetailsCallback();
  }, [fetchFoodDetailsCallback]);

  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    setQuantity(quantity - 1);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent borderRadius="3xl">
          <ModalHeader>
            <ArrowBackIcon onClick={onClose} cursor="pointer" />
          </ModalHeader>

          <ModalBody>
            <VStack spacing={4} alignItems="flex-start">
              <Box
                w="100%"
                h="300px"
                bgImage={`url(${foodItem?.food_image})`}
                bgSize="cover"
                borderRadius={10}
                bgPosition="center"
                bgRepeat="no-repeat"
              />

              <Box>
                <Text fontSize="2xl" pb={"4"}>
                  {foodItem?.food_name}
                </Text>

                <Text fontSize="l" pb={"3"}>
                  Description
                </Text>
                <Text fontSize="sm" color="gray" pb="2">
                  {foodItem?.food_description}
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter w="100%" bgColor={"#EBEEF2"} borderBottomRadius="3xl">
            <VStack width="100%" alignItems="stretch">
              <HStack justifyContent="space-between" alignItems="center" pb="4">
                <Text fontSize="2xl">Rs. {foodItem?.food_price}</Text>
                <HStack spacing={4}>
                  <IconButton
                    aria-label="Add to cart"
                    icon={<AddIcon />}
                    onClick={handleIncrement}
                    borderRadius="full"
                    bg="gray.300"
                    _hover={{ bg: "gray.400" }}
                  />
                  <Text fontSize={"2xl"}>{quantity}</Text>
                  <IconButton
                    aria-label="Remove from cart"
                    icon={<MinusIcon />}
                    onClick={handleDecrement}
                    isDisabled={quantity <= 1}
                    borderRadius="full"
                    bg="gray.300"
                    _hover={{ bg: "gray.400" }}
                  />
                </HStack>
              </HStack>
              <Button
                bgColor={"#D67229"}
                size="lg"
                color="white"
                borderRadius="full"
                mt={4}
                _hover={{ bgColor: "#D67229" }}
                //   onClick={handleOrderNow}
              >
                Order Now
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FoodDetailsModal;