import { CheckIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { FiCornerUpLeft, FiX } from "react-icons/fi";
import momo from "../../assets/momo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails, fetchOrderedItemsDetails } from "../../api/api";
import { IOrderData, OrderedItem } from "../../types/types";
import { setOrders } from "../../store/orderSlice";
import { RootState } from "../../store/store";

const OrderedItems = () => {
  const dispatch = useDispatch();

  const [orderState, setOrderState] = useState<{
    [key: string]: { accepted: boolean; rejected: boolean };
  }>({});

  const orders = useSelector((state: RootState) => state.orders.orders);

  const toast = useToast();

  const transformOrderData = async (order: IOrderData): Promise<IOrderData> => {
    const cartItems = await Promise.all(
      order.items.map(async (item) => {
        const foodDetails = await fetchFoodDetails(item.food);
        return {
          food: item.food,
          quantity: item.quantity,
          food_name: foodDetails.food_name,
          food_price: foodDetails.food_price,
          food_image: foodDetails.food_image,
        };
      })
    );
    return {
      order_id: order.order_id,
      items: cartItems,
      total_price: order.total_price,
      total_items: order.total_items,
      order_status: order.order_status,
      ordered_date: order.ordered_date,
      ordered_time: order.ordered_time,
    };
  };

  async function fetchFoodDetails(id: number): Promise<{
    food_name: string;
    food_price: number | string;
    food_image: string;
  }> {
    const response = await fetch(
      `http://127.0.0.1:8000/api/menu/fooddetails/${id}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch food details for food ID ${id}`);
    }
    const data = await response.json();
    return {
      food_name: data.food_name,
      food_price: data.food_price,
      food_image: data.food_image,
    };
  }

  const fetchOrderDetailsCallback = useCallback(() => {
    fetchOrderDetails<IOrderData[]>().then((data) => {
      const transformedData = data.map(transformOrderData);
      Promise.all(transformedData).then((result) => {
        dispatch(setOrders(result));
        console.log(result);
      });
    });
  }, []);

  useEffect(() => {
    fetchOrderDetailsCallback();
  }, [fetchOrderDetailsCallback]);

  return (
    <>
      <Flex flexWrap={"wrap"}>
        {orders.map((order) => (
          <Box
            bg={useColorModeValue("white", "gray.800")}
            width="360px"
            p="4"
            borderRadius={"8"}
            height="330px"
            mr="4"
            mb="4"
            key={order.order_id}
          >
            <Stack mb="6">
              <>
                <Stack direction={"row"}>
                  <Stack direction={"column"}>
                    <Text fontWeight={600}> Order # {order.order_id}</Text>

                    <Text color="#B4B4B4" fontSize={"small"} fontWeight={500}>
                      {order.ordered_date},{"   "}
                      {order.ordered_time.split(":").slice(0, 2).join(":")}
                    </Text>
                  </Stack>
                  <Spacer />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    colorScheme="orange"
                    // onClick={() => handleDelete(order.order_id)}
                  />
                </Stack>

                <Stack pt={6}>
                  <Box height="150px" overflowY="auto">
                    {order.items.map((item, index) => (
                      <Stack
                        direction={"row"}
                        spacing={4}
                        align={"center"}
                        alignItems={"start"}
                        key={index}
                      >
                        <Avatar size="lg" src={item.food_image} mr="1" />
                        <Stack fontSize={"sm"} width="100%" pr="3">
                          <Text fontWeight={500} pb="2">
                            {item.food_name}
                          </Text>
                          <Stack direction={"row"} fontSize={"sm"}>
                            <Text fontWeight={500} pb="2">
                              Rs {item.food_price}
                            </Text>
                            <Spacer />
                            <Text fontWeight={500} pb="2">
                              Qty: {item.quantity}
                            </Text>
                          </Stack>
                          {index !== order.items.length - 1 && (
                            <Divider borderBottomWidth={"3px"} />
                          )}
                        </Stack>
                      </Stack>
                    ))}
                  </Box>
                  <Divider borderBottomWidth={"3px"} />
                  <Stack pt={2} spacing={0} direction={"row"}>
                    <Stack direction={"column"} fontSize={"sm"}>
                      <Text
                        color="#B4B4B4"
                        fontSize={"small"}
                        fontWeight={500}
                        mb={-2}
                      >
                        X {order.total_items} items
                      </Text>
                      <Text fontWeight={500}>${order.total_price}</Text>
                    </Stack>
                    <Spacer />
                    <Stack direction={"row"}>
                      {!orderState[order.order_id]?.accepted &&
                        !orderState[order.order_id]?.rejected && (
                          <>
                            <IconButton
                              aria-label="Completed order"
                              icon={<CheckIcon />}
                              mr={3}
                              variant="outline"
                              colorScheme={"green"}
                              // onClick={() => handleAcceptOrder(order.order_id)}
                            />
                            <IconButton
                              aria-label="Reject order"
                              icon={<CloseIcon />}
                              variant="outline"
                              colorScheme={"red"}
                              // onClick={() => handleRejectOrder(order.order_id)}
                            />
                          </>
                        )}
                      {orderState[order.order_id]?.accepted && (
                        <Button
                          aria-label="Completed order"
                          leftIcon={<CheckIcon />}
                          variant="outline"
                          colorScheme={"green"}
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
                          colorScheme={"red"}
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
        ))}
      </Flex>
    </>
  );
};
export default OrderedItems;
