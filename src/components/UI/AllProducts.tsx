import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from "@chakra-ui/react";
import ProductList from "../Card/ProductList";
import { useAppSelector } from "../../store/hooks";
import SearchBar from "./Searchbar";

const AllProducts = () => {
  const categories = useAppSelector((state) => state.categories.categories);

  const products = useAppSelector((state) => state.products.products);

  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleCategorySelect = (id: number) => {
    if (id === 0) {
      setFilteredProducts(products);
      return;
    } else {
      const filteredProducts = products.filter(
        (product) => product.category_id === id
      );
      setFilteredProducts(filteredProducts);
    }
  };

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  return (
    <VStack alignItems={"flex-start"}>
      <HStack pb="6" spacing={0} width={["80%", "60%", "60%", "40%"]}>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            width={["50%", "50%", "50%", "40%"]}
            backgroundColor="white"
            border="1px"
            borderColor="gray.400"
            borderRadius="md"
            _hover={{ bg: "white" }}
            _expanded={{ bg: "white" }}
            _focus={{ bg: "white" }}
            borderRightRadius="0"
            iconSpacing={["1", "1", "2", "2"]}
            fontSize={"sm"}
            color="gray.600"
            paddingLeft={["2", "2", "4", "4"]}
            paddingRight={["4", "4", "4", "4"]}
          >
            Filter
          </MenuButton>

          <MenuList>
            <MenuItem
              key={0}
              onClick={() => {
                handleCategorySelect(0);
              }}
            >
              All
            </MenuItem>
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                onClick={() => {
                  handleCategorySelect(category.id);
                }}
              >
                {category.category_name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <SearchBar onSearch={setFilteredProducts} products={products} />
      </HStack>
      <ProductList filteredProduct={filteredProducts} />
    </VStack>
  );
};

export default AllProducts;
