import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CategoryItemList from "../components/Card/CategoryItemList";
import MenuItemList from "../components/Card/MenuItemList";
import { ICategoryData } from "../types/types";

const Home = () => {
  const [selectedCategoryItem, setSelectedCategoryItem] =
    useState<ICategoryData | null>(null);

  useEffect(() => {
    setSelectedCategoryItem({ id: 0, category_name: "All" });
  }, []);

  return (
    <Box minH="100vh" w="100%" backgroundColor={"#fcfbfb"}>
      <Box p="4" w="100%" bgColor={"white"}>
        <InputGroup backgroundColor={"white"} borderRadius="6px" w="40%">
          <Input
            type="text"
            placeholder="Search menu"
            _placeholder={{ color: "black" }}
          />
          <InputRightElement pointerEvents="none" children={<Search2Icon />} />
        </InputGroup>
      </Box>
      <Divider borderBottom="1px" />
      <Box p="4">
        <VStack alignItems={"flex-start"}>
          <Text fontSize="lg" fontWeight="semibold" pb="2">
            Categories
          </Text>

          <CategoryItemList setSelectedCategoryItem={setSelectedCategoryItem} />

          {selectedCategoryItem === null && (
            <MenuItemList selectedCategoryId={0} />
          )}
          {selectedCategoryItem && (
            <>
              <Text fontSize="lg" fontWeight="semibold" pt="2" pb={"2"}>
                Select Menu
              </Text>
              <MenuItemList selectedCategoryId={selectedCategoryItem.id} />
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Home;
