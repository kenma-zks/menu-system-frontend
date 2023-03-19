import React, { ReactNode } from 'react'
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link as ChakraLink,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Button,
  Menu,
  MenuButton,
  VStack,
  Image,
  Center,
} from '@chakra-ui/react'
import {
  FiBell,
  FiCalendar,
  FiBookOpen,
  FiInfo,
  FiMenu,
  FiShoppingCart,
  FiHome,
  FiLogOut,
  FiArchive,
  FiFileText,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { ReactText } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useAppDispatch } from '../../store/hooks'
import { authActions } from '../../store/authSlice'

interface LinkItemProps {
  name: string
  icon: IconType
  link: string
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, link: '/admin/home' },
  { name: 'Products', icon: FiArchive, link: '/admin/products' },
  { name: 'Orders', icon: FiShoppingCart, link: '/admin/orders' },
  { name: 'Bookings', icon: FiCalendar, link: '/admin/bookings' },
  { name: 'Order History', icon: FiFileText, link: '/admin/order-history' },
  { name: 'Booking History', icon: FiFileText, link: '/admin/booking-history' },
]

export default function AdminSidebar({ children }: { children?: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'flex' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  return (
    <VStack
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      className="sidebar"
      justifyContent="space-between"
      {...rest}
    >
      <Box width={'100%'}>
        <Flex
          h="20"
          alignItems="center"
          mx="8"
          my="30px"
          justifyContent="space-between"
        >
          <Flex justifyContent={'center'} w="full">
            <Image src={logo} alt="logo" boxSize="75px" />
          </Flex>

          <CloseButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onClose}
          />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem href={link.link} key={link.name} icon={link.icon}>
            {link.name}
          </NavItem>
        ))}
      </Box>
      <Box width={'100%'} paddingBottom="4">
        <NavItem
          href="/admin/login"
          icon={FiLogOut}
          onClick={() => {
            dispatch(authActions.logOut())
          }}
        >
          Logout
        </NavItem>
      </Box>
    </VStack>
  )
}

interface NavItemProps extends FlexProps {
  icon: IconType
  children: React.ReactNode
  href: string
}
const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
  return (
    <ChakraLink
      as={Link}
      to={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </ChakraLink>
  )
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      display="flex"
      justifyContent="space-between"
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('gray.100', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Box>
        {/* <img src={logo} alt="logo" height="120px" width="120px" /> */}
      </Box>
      <Flex>
        <Menu>
          <MenuButton
            as={Button}
            rounded={'full'}
            variant={'link'}
            cursor={'pointer'}
            minW={0}
          ></MenuButton>
        </Menu>
      </Flex>
    </Flex>
  )
}
