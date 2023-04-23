import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { IProductData } from "../../types/types";

const ProductCard = ({
  product,
  handleProductClick,
}: {
  product: IProductData;
  handleProductClick: (product: IProductData) => void;
}) => {
  return (
    <Box
      maxW={"270px"}
      maxH={"110px"}
      minW={"270px"}
      minH={"110px"}
      borderRadius="4"
      borderWidth={1}
      width="25%"
      flexShrink={0}
      mr="4"
      mb="4"
      key={product.food_id}
      _hover={{ boxShadow: "md", cursor: "pointer" }}
      onClick={() => handleProductClick(product)}
    >
      <HStack alignItems={"center"} spacing="2">
        <Box p="2">
          <Image
            src={
              product.food_image instanceof File
                ? URL.createObjectURL(product.food_image)
                : product.food_image ?? undefined
            }
            alt="item"
            minW={"100px"}
            minH={"90px"}
            maxW={"100px"}
            maxH={"90px"}
            borderRadius="4"
            objectFit={"cover"}
          />
        </Box>
        <VStack alignItems={"flex-start"} pl="1">
          <Box>
            <Box
              fontWeight="bold"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              maxW={"120px"}
            >
              {product.food_name}
            </Box>
          </Box>
          <Box>
            <Box color="gray" fontSize="sm" fontWeight={"medium"}>
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
      </HStack>
    </Box>
  );
};

export default ProductCard;
