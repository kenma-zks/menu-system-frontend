import { ReactNode } from 'react'
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { FiBell, FiSearch } from 'react-icons/fi'
import profile from '../../assets/profile.webp'

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}
  >
    {children}
  </Link>
)

export default function AdminNavbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Box px={4}>
        <Flex h={16} alignItems="center" justifyContent={'space-between'}>
          <Box>
            <InputGroup backgroundColor={'white'} borderRadius="6px">
              <InputLeftElement pointerEvents="none" children={<FiSearch />} />
              <Input
                type="text"
                placeholder="Search"
                _placeholder={{ color: 'black' }}
              />
            </InputGroup>
          </Box>

          <Flex alignItems={'center'} pr="8">
            <Stack direction={'row'} spacing={5}>
              <Button backgroundColor="inherit" size={'lg'}>
                <FiBell />
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar size={'md'} src={profile} />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar size={'2xl'} src={profile} />
                  </Center>
                  <br />
                  <Center>
                    <p>Username</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
