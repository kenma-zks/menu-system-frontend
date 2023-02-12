import { CheckIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  Avatar,
  Spacer,
  Divider,
  IconButton,
  Button,
  Icon,
  useToast,
  CloseButton,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiCornerUpLeft, FiX } from 'react-icons/fi'
import momo from '../../assets/momo.jpg'

type Order = {
  order_id: number
  items: Array<{
    item_name: string
    item_price: number
    item_quantity: number
  }>
  total_price: number
  total_items: number
  order_status: string
  ordered_date: string
  ordered_time: string
}

const DUMMY_ORDER = [
  {
    order_id: 6,
    items: [
      {
        item_name: 'Chicken Burger',
        item_price: 5.3,
        item_quantity: 2,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
    ],
    total_price: 7.3,
    total_items: 3,
    order_status: 'pending',
    ordered_date: '2 FEB 2023',
    ordered_time: '10:00 PM',
  },
  {
    order_id: 5,
    items: [
      {
        item_name: 'Chicken Burger',
        item_price: 5.3,
        item_quantity: 2,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
    ],
    total_price: 7.3,
    total_items: 3,
    order_status: 'pending',
    ordered_date: '2 FEB 2023',
    ordered_time: '10:00 PM',
  },
  {
    order_id: 4,
    items: [
      {
        item_name: 'Chicken Burger',
        item_price: 5.3,
        item_quantity: 2,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
    ],
    total_price: 7.3,
    total_items: 3,
    order_status: 'pending',
    ordered_date: '2 FEB 2023',
    ordered_time: '10:00 PM',
  },
  {
    order_id: 3,
    items: [
      {
        item_name: 'Chicken Burger',
        item_price: 5.3,
        item_quantity: 2,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
    ],
    total_price: 7.3,
    total_items: 3,
    order_status: 'pending',
    ordered_date: '2 FEB 2023',
    ordered_time: '10:00 PM',
  },
  {
    order_id: 2,
    items: [
      {
        item_name: 'Chicken Burger',
        item_price: 5.3,
        item_quantity: 2,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
    ],
    total_price: 7.3,
    total_items: 3,
    order_status: 'pending',
    ordered_date: '2 FEB 2023',
    ordered_time: '10:00 PM',
  },
  {
    order_id: 1,
    items: [
      {
        item_name: 'Chicken Burger',
        item_price: 5.3,
        item_quantity: 2,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
      {
        item_name: 'Mix Salad',
        item_price: 2.3,
        item_quantity: 1,
      },
    ],
    total_price: 7.3,
    total_items: 3,
    order_status: 'pending',
    ordered_date: '2 FEB 2023',
    ordered_time: '10:00 PM',
  },
]

const OrderedItems = () => {
  const [orderState, setOrderState] = useState<{
    [key: string]: { accepted: boolean; rejected: boolean }
  }>({})

  const [displayOrder, setDisplayOrder] = useState(DUMMY_ORDER)
  const [previousDisplayOrder, setPreviousDisplayOrder] = useState(displayOrder)

  const handleAcceptOrder = (orderId: number) => {
    setOrderState({
      ...orderState,
      [orderId]: { accepted: true, rejected: false },
    })
  }

  const handleRejectOrder = (orderId: number) => {
    setOrderState({
      ...orderState,
      [orderId]: { accepted: false, rejected: true },
    })
  }

  const handleDelete = (orderId: number) => {
    setPreviousDisplayOrder(displayOrder)

    const updatedOrders = displayOrder.filter(
      (order) => order.order_id !== orderId,
    )
    setDisplayOrder(updatedOrders)
    toast({
      title: 'Order Deleted',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
      render: () => (
        <Box backgroundColor={'#38A169'} width="300px" borderRadius={6} p={3}>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="md" fontWeight={600} color={'white'} pl={2}>
              Order #{orderId} Deleted
            </Text>
            <IconButton
              onClick={handleUndo}
              aria-label="Undo"
              icon={<FiCornerUpLeft />}
              variant="solid"
              colorScheme="white"
              pr={2}
            />
          </Flex>
        </Box>
      ),
    })
  }

  const handleUndo = () => {
    setDisplayOrder(previousDisplayOrder)
  }
  const toast = useToast()

  return (
    <>
      <Flex flexWrap={'wrap'}>
        {DUMMY_ORDER.map(
          (order) =>
            displayOrder.includes(order) && (
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                width="360px"
                p="4"
                borderRadius={'8'}
                height="330px"
                mr="4"
                mb="4"
                key={order.order_id}
              >
                <Stack mb="6">
                  <>
                    <Stack direction={'row'}>
                      <Stack direction={'column'}>
                        <Text fontWeight={600}> Order # {order.order_id}</Text>

                        <Text
                          color="#B4B4B4"
                          fontSize={'small'}
                          fontWeight={500}
                        >
                          {order.ordered_date}, {order.ordered_time}
                        </Text>
                      </Stack>
                      <Spacer />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        colorScheme="orange"
                        onClick={() => handleDelete(order.order_id)}
                      />
                    </Stack>

                    <Stack pt={6}>
                      <Box height="150px" overflowY="auto">
                        {order.items.map((item, index) => (
                          <Stack
                            direction={'row'}
                            spacing={4}
                            align={'center'}
                            alignItems={'start'}
                            key={index}
                          >
                            <Avatar size="lg" src={momo} mr="1" />
                            <Stack fontSize={'sm'} width="100%" pr="3">
                              <Text fontWeight={500} pb="2">
                                {item.item_name}
                              </Text>
                              <Stack direction={'row'} fontSize={'sm'}>
                                <Text fontWeight={500} pb="2">
                                  $ {item.item_price}
                                </Text>
                                <Spacer />
                                <Text fontWeight={500} pb="2">
                                  Qty: {item.item_quantity}
                                </Text>
                              </Stack>
                              {index !== order.items.length - 1 && (
                                <Divider borderBottomWidth={'3px'} />
                              )}
                            </Stack>
                          </Stack>
                        ))}
                      </Box>
                      <Divider borderBottomWidth={'3px'} />
                      <Stack pt={2} spacing={0} direction={'row'}>
                        <Stack direction={'column'} fontSize={'sm'}>
                          <Text
                            color="#B4B4B4"
                            fontSize={'small'}
                            fontWeight={500}
                            mb={-2}
                          >
                            X{order.total_items} items
                          </Text>
                          <Text fontWeight={500}>${order.total_price}</Text>
                        </Stack>
                        <Spacer />
                        <Stack direction={'row'}>
                          {!orderState[order.order_id]?.accepted &&
                            !orderState[order.order_id]?.rejected && (
                              <>
                                <IconButton
                                  aria-label="Completed order"
                                  icon={<CheckIcon />}
                                  mr={3}
                                  variant="outline"
                                  colorScheme={'green'}
                                  onClick={() =>
                                    handleAcceptOrder(order.order_id)
                                  }
                                />
                                <IconButton
                                  aria-label="Reject order"
                                  icon={<CloseIcon />}
                                  variant="outline"
                                  colorScheme={'red'}
                                  onClick={() =>
                                    handleRejectOrder(order.order_id)
                                  }
                                />
                              </>
                            )}
                          {orderState[order.order_id]?.accepted && (
                            <Button
                              aria-label="Completed order"
                              leftIcon={<CheckIcon />}
                              variant="outline"
                              colorScheme={'green'}
                              isDisabled
                            >
                              Completed
                            </Button>
                          )}
                          {orderState[order.order_id]?.rejected && (
                            <Button
                              aria-label="Rejected order"
                              leftIcon={<CloseIcon />}
                              variant="outline"
                              colorScheme={'red'}
                              isDisabled
                            >
                              Rejected
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  </>
                </Stack>
              </Box>
            ),
        )}
      </Flex>
    </>
  )
}

export default OrderedItems
