import { useState } from "react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { IProductData } from "../../types/types";

interface SearchBarProps {
  onSearch: (filteredProducts: IProductData[]) => void;
  products: IProductData[];
}

const SearchBar = ({ onSearch, products }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchValue(event.target.value);
    const filteredProducts = products.filter((product) =>
      product.food_name
        .toLowerCase()
        .startsWith(event.target.value.toLowerCase())
    );
    onSearch(filteredProducts);
  };

  return (
    <InputGroup width="75%">
      <Input
        type="text"
        placeholder="Search by product name"
        value={searchValue}
        onChange={handleSearchInputChange}
        borderRadius="0"
        borderWidth="1px"
        borderColor="gray.400"
        _hover={{ borderColor: "gray.400" }}
        _focus={{ borderColor: "gray.400", boxShadow: "none" }}
      />
      <InputRightElement
        pointerEvents="none"
        children={<SearchIcon color="gray.500" />}
      />
    </InputGroup>
  );
};

export default SearchBar;
