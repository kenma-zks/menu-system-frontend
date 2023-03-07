import React from 'react'
import { ChevronDownIcon, Search2Icon } from '@chakra-ui/icons'
import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  VStack,
} from '@chakra-ui/react'
import ProductCard from '../../components/Card/ProductCard'

const AllProducts = () => {
  return (
    <VStack alignItems={'flex-start'}>
      <HStack pb="6" spacing={0} width={'600px'}>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            width="25%"
            backgroundColor="white"
            border="1px"
            borderColor="gray.400"
            borderRadius="md"
            _hover={{ bg: 'white' }}
            _expanded={{ bg: 'white' }}
            _focus={{ bg: 'white' }}
            borderRightRadius="0"
            iconSpacing="20"
            fontSize={'sm'}
            color="gray.600"
          >
            Filter
          </MenuButton>
          <MenuList>
            <MenuItem>Category 1</MenuItem>
            <MenuItem>Category 2</MenuItem>
          </MenuList>
        </Menu>
        <InputGroup width="75%">
          <InputLeftElement
            pointerEvents="none"
            children={<Search2Icon color="gray" />}
          />
          <Input
            borderLeftRadius="0"
            borderColor="gray.400"
            placeholder="Search products ..."
          />
        </InputGroup>
      </HStack>
      <ProductCard />
    </VStack>
  )
}

export default AllProducts
