import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiBell, FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";
import CategoryItemList from "../components/Card/CategoryItemList";
import MenuItemList from "../components/Card/MenuItemList";
import CartDrawer from "../components/UI/CartDrawer";
import { ICategoryData, IProductData } from "../types/types";
import SearchBar from "../components/UI/Searchbar";
import Cookies from "js-cookie";

interface RootState {
  cart: CartState;
}

interface CartState {
  totalQuantity: number;
}

const Home = () => {
  const [selectedCategoryItem, setSelectedCategoryItem] =
    useState<ICategoryData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );

  useEffect(() => {
    setSelectedCategoryItem({ id: 0, category_name: "All" });
  }, []);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const openCartDrawer = () => {
    setIsDrawerOpen(true);
  };

  return (
    <Box minH="100vh" w="100%" backgroundColor={"#fcfbfb"}>
      <Box p="4" w="100%" bgColor={"white"}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          pr="8"
        >
          <InputGroup
            backgroundColor={"white"}
            borderRadius="6px"
            w={{ base: "60%", md: "40%" }}
          >
            <Input
              type="text"
              placeholder="Search menu"
              _placeholder={{ color: "black" }}
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <InputRightElement
              pointerEvents="none"
              children={<Search2Icon />}
            />
          </InputGroup>
          <Flex alignItems="center" justifyContent="flex-end">
            <Box
              position="relative"
              display="inline-block"
              mr="2"
              width="40px"
              height="40px"
            >
              <IconButton
                aria-label="Cart"
                icon={<FiShoppingCart />}
                borderRadius="full"
                _hover={{ bg: "orange.400" }}
                onClick={() => {
                  openCartDrawer();
                }}
                backgroundColor={"orange.200"}
              />
              <Box
                position="absolute"
                top="-10px"
                right="-10px"
                bg="black"
                borderRadius="full"
                width="24px"
                height="24px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
                fontWeight="semibold"
                color="white"
              >
                {cartQuantity}
              </Box>
            </Box>
          </Flex>
        </HStack>
      </Box>
      <Divider borderBottom="1px" />
      <Box p="4">
        <VStack alignItems={"flex-start"}>
          <Text fontSize="lg" fontWeight="semibold" pb="2">
            Categories
          </Text>

          <CategoryItemList setSelectedCategoryItem={setSelectedCategoryItem} />

          {selectedCategoryItem === null && (
            <MenuItemList selectedCategoryId={0} searchQuery={searchQuery} />
          )}
          {selectedCategoryItem && (
            <>
              <Text fontSize="lg" fontWeight="semibold" pt="2" pb={"2"}>
                Select Menu
              </Text>
              <MenuItemList
                selectedCategoryId={selectedCategoryItem.id}
                searchQuery={searchQuery}
              />
            </>
          )}
          <CartDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default Home;
