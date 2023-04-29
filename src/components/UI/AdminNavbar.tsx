import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  Center,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { FiBell, FiSearch } from "react-icons/fi";
import profile from "../../assets/profile.webp";

const AdminNavbar = () => {
  return (
    <>
      <Box px={4}>
        <Flex h={16} alignItems="center" justifyContent={"space-between"}>
          <Box>
            <InputGroup backgroundColor={"white"} borderRadius="6px">
              <InputLeftElement pointerEvents="none" children={<FiSearch />} />
              <Input
                type="text"
                placeholder="Search"
                _placeholder={{ color: "black" }}
              />
            </InputGroup>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default AdminNavbar;
