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

interface AdminNavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const BookingAdminNavbar: React.FC<AdminNavbarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Box>

          <Flex alignItems={"center"} pr="8">
            <Stack direction={"row"} spacing={5}>
              <Button backgroundColor="inherit" size={"lg"}>
                <FiBell />
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar size={"md"} src={profile} />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar size={"2xl"} src={profile} />
                  </Center>
                  <br />
                  <Center>
                    <p>Username</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>Account Settings</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default BookingAdminNavbar;
