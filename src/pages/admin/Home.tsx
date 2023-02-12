import {
  Box,
  Button,
  Stack,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import OrderedItems from '../../components/Card/OrderedItems'
import AdminNavbar from '../../components/UI/AdminNavbar'

const DUMMY_ORDER_LIST = [
  {
    id: 6,
  },
  {
    id: 5,
  },
  {
    id: 4,
  },
  {
    id: 3,
  },
  {
    id: 2,
  },
  {
    id: 1,
  },
]

const AdminHome = () => {
  return (
    <>
      <Box backgroundColor="#F3F2F2" minH="100vh" p="4">
        <AdminNavbar />
        <VStack alignItems={'flex-start'} p="4">
          <Box pb={6}>
            <Text fontWeight="bold" pb="3">
              ORDER LIST
            </Text>
            {DUMMY_ORDER_LIST.map((order) => (
              <Button
                colorScheme="teal"
                variant="outline"
                width="80px"
                key={order.id}
                mr="3"
                fontSize={'small'}
                fontWeight={'medium'}
              >
                # {order.id}
              </Button>
            ))}
          </Box>
          <Box>
            <OrderedItems />
          </Box>
        </VStack>
      </Box>
    </>
  )
}

export default AdminHome
