import { Box, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { IProductData } from "../../types/types";
import FoodDetailsModal from "../UI/FoodDetailsModal";

const MenuItemCard = ({ product }: { product: IProductData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFoodItems, setSelectedFoodItem] =
    useState<IProductData | null>(null);

  const openFoodDetailsModal = () => {
    setIsModalOpen(true);
    setSelectedFoodItem(product);
  };

  return (
    <Box
      borderRadius="4"
      borderWidth={1}
      maxW={{ base: "calc(50% - 2rem)", md: "180px" }}
      minW={{ base: "calc(50% - 2rem)", md: "180px" }}
      maxH={{ base: "220px", md: "200px" }}
      minH={{ base: "220px", md: "200px" }}
      mr={{ base: "8", md: "4" }}
      mb={{ base: "8", md: "4" }}
      key={product.food_id}
      _hover={{ boxShadow: "md", cursor: "pointer" }}
      onClick={openFoodDetailsModal}
      pointerEvents={product.food_available ? "auto" : "none"}
      opacity={product.food_available ? 1 : 0.5}
    >
      <VStack alignItems={"flex-start"} textAlign="left">
        <Box pl="2" pr="2" pt="2" w="100%" onClick={openFoodDetailsModal}>
          <Image
            src={
              product.food_image instanceof File
                ? URL.createObjectURL(product.food_image)
                : product.food_image ?? undefined
            }
            alt="item"
            maxW={{ base: "100%", md: "160px" }}
            minW={{ base: "100%", md: "160px" }}
            maxH={{ base: "120px", md: "90px" }}
            minH={{ base: "120px", md: "90px" }}
            borderRadius="4"
            objectFit={"cover"}
          />
        </Box>
        <VStack alignItems={"flex-start"} pl="3" spacing={1} w="100%">
          <Box>
            <Box
              fontWeight="bold"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              maxW={{ base: "100px", md: "150px" }}
            >
              {product.food_name}
            </Box>
          </Box>

          <Box>
            <Box color={"gray"} fontWeight="semibold" fontSize="sm">
              Rs {product.food_price}
            </Box>
          </Box>
          <Box>
            <Box>
              {product.food_available ? (
                <Box color="green.500" fontSize="sm" fontWeight={"medium"}>
                  <Text>Available</Text>
                </Box>
              ) : (
                <Box color="red.500" fontSize="sm" fontWeight={"medium"}>
                  <Text>Not Available</Text>
                </Box>
              )}
            </Box>
          </Box>
        </VStack>
      </VStack>
      {selectedFoodItems && (
        <FoodDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          foodItem={selectedFoodItems}
        />
      )}
    </Box>
  );
};

export default MenuItemCard;
