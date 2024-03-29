import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { ICategoryData } from "../../types/types";

const CategoryMenuCard = ({
  category,
  handleCategoryClick,
  isActive,
}: {
  category: ICategoryData;
  handleCategoryClick: (id: number) => void;
  isActive: boolean;
}) => {
  const textColor = isActive ? "orange" : "black";
  const borderColor = isActive ? "orange" : "gray.200";
  const bgColor = isActive ? "orange.100" : "white";

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"space-between"}
    >
      <Box
        key={category.id}
        maxW={"140px"}
        maxH={"40px"}
        minW={"140px"}
        minH={"40px"}
        color={textColor}
        bgColor={bgColor}
        borderColor={borderColor}
        borderRadius="full"
        borderWidth={2}
        display={"flex"}
        mr="4"
        mb="2"
        justifyContent={"center"}
        alignItems={"center"}
        _hover={{ boxShadow: "md", cursor: "pointer" }}
        onClick={() => handleCategoryClick(category.id)}
      >
        <VStack spacing={1}>
          <Text fontSize="small" fontWeight="bold">
            {category.category_name}
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default CategoryMenuCard;
