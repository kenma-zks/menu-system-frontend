import {
  Box,
  HStack,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Flex,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import AdminNavbar from "../../components/UI/AdminNavbar";
import OrderedHistoryItems from "../../components/Card/OrderHistoryList";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { IOrderData } from "../../types/types";
import { fetchOrderDetails } from "../../api/api";
import { setOrders } from "../../store/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const [ordersFilterOptions, setOrdersFilterOptions] =
    useState<string>("Today");
  const orders = useSelector((state: RootState) => state.orders.orders);

  const transformOrderData = async (order: IOrderData): Promise<IOrderData> => {
    const cartItems = await Promise.all(
      order.items.map(async (item) => {
        const foodDetails = await fetchFoodDetails(item.food_id);
        return {
          food_id: item.food_id,
          quantity: item.quantity,
          food_name: foodDetails.food_name,
          food_price: foodDetails.food_price,
          food_image: foodDetails.food_image,
        };
      })
    );

    return {
      user_name: order.user_name,
      table_no: order.table_no,
      order_id: order.order_id,
      items: cartItems,
      note: order.note,
      total_price: order.total_price,
      total_items: order.total_items,
      payment_method: order.payment_method,
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
      });
    });
  }, []);

  useEffect(() => {
    fetchOrderDetailsCallback();
  }, [fetchOrderDetailsCallback]);

  const filteredOrders = orders.filter((order) => {
    if (!order.ordered_date) {
      return false; // Skip this order if ordered_date is undefined
    }

    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);
    const last7days = new Date(today);
    last7days.setDate(last7days.getDate() - 7);
    const last30days = new Date(today);
    last30days.setDate(last30days.getDate() - 30);

    const orderDate = new Date(order.ordered_date);
    if (ordersFilterOptions === "Today") {
      return orderDate.getDate() === today.getDate();
    } else if (ordersFilterOptions === "Yesterday") {
      return orderDate.getDate() === yesterday.getDate();
    } else if (ordersFilterOptions === "Last 7 days") {
      return orderDate >= last7days;
    } else if (ordersFilterOptions === "Last 30 days") {
      return orderDate >= last30days;
    } else if (ordersFilterOptions === "All time") {
      return true;
    }
  });

  return (
    <>
      <Box backgroundColor="#F3F2F2" minH="100vh" p="4" w={"100%"}>
        <AdminNavbar />
        <VStack alignItems={"flex-start"} p="4" w={"100%"}>
          <Box pb={3} w={"100%"}>
            <HStack justifyContent={"space-between"} w={"100%"}>
              <Text fontWeight="bold" pb="3" fontSize="xl" w={"90%"}>
                Order History
              </Text>
              <Menu size="sm" matchWidth>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  width="30%"
                  backgroundColor="white"
                  border="1px"
                  borderColor="gray.400"
                  borderRadius="md"
                  _hover={{ bg: "white" }}
                  _expanded={{ bg: "white" }}
                  _focus={{ bg: "white" }}
                  borderRightRadius="0"
                  iconSpacing="2"
                  fontSize="sm"
                  color="gray.600"
                  paddingLeft="2"
                  paddingRight="2"
                >
                  {ordersFilterOptions}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setOrdersFilterOptions("Today")}>
                    Today
                  </MenuItem>
                  <MenuItem onClick={() => setOrdersFilterOptions("Yesterday")}>
                    Yesterday
                  </MenuItem>
                  <MenuItem
                    onClick={() => setOrdersFilterOptions("Last 7 days")}
                  >
                    Last 7 days
                  </MenuItem>
                  <MenuItem
                    onClick={() => setOrdersFilterOptions("Last 30 days")}
                  >
                    Last 30 days
                  </MenuItem>
                  <MenuItem onClick={() => setOrdersFilterOptions("All time")}>
                    All time
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Box>
          <Flex justifyContent="flex-start" flexWrap="wrap">
            {filteredOrders.map((orders) => (
              <OrderedHistoryItems key={orders.order_id} orders={orders} />
            ))}
          </Flex>
        </VStack>
      </Box>
    </>
  );
};

export default OrderHistory;
