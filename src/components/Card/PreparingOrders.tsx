import { CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { GiCampCookingPot } from "react-icons/gi";
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
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  HStack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../../api/api";
import { IOrderData } from "../../types/types";
import {
  deleteOrder,
  setOrders,
  updateOrderStatus,
} from "../../store/orderSlice";
import { RootState } from "../../store/store";
import { FiInfo } from "react-icons/fi";
import OrderDetailsModal from "../UI/OrderDetailsModal";

const PreparingOrders = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state: RootState) => state.orders.orders);
  const [selectedOrder, setSelectedOrder] = useState<IOrderData | null>(null);
  const [previewOrder, setPreviewOrder] = useState<IOrderData | null>(null);
  const toast = useToast();

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
      total_price: order.total_price,
      total_items: order.total_items,
      note: order.note,
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

  const leastDestructiveRef = useRef<HTMLButtonElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [alertIsOpen, setAlertIsOpen] = useState(false);

  const onDeleteClick = (order: IOrderData) => {
    setSelectedOrder(order);
    setAlertIsOpen(true);
  };

  const alertOnClose = () => {
    setAlertIsOpen(false);
  };

  const handleDelete = () => {
    if (selectedOrder) {
      const { order_id } = selectedOrder;
      fetch(`http://127.0.0.1:8000/api/order/${order_id}`, {
        method: "DELETE",
      }).then(() => {
        dispatch(deleteOrder(order_id));
        setAlertIsOpen(false);
        toast({
          title: "Order Deleted",
          description: `Order #${order_id} has been deleted`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      });
    }
  };

  const handleComplete = (order_id?: number) => {
    fetch(`http://127.0.0.1:8000/api/order/${order_id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_status: "Completed" }),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(updateOrderStatus(data));
        toast({
          title: "Order Completed",
          description: `Order #${order_id} has been completed, notify the customer`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
        // Handle error here
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrderDetailsCallback();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchOrderDetailsCallback]);

  return (
    <>
      <Flex flexWrap={"wrap"}>
        {orders
          .filter((order) => order.order_status === "Preparing")
          .map((order) => (
            <Box
              bg={useColorModeValue("white", "gray.800")}
              width={{ base: "300px", md: "360px" }}
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
                      <Text fontWeight={600}>{order.user_name}</Text>
                      <Text fontWeight={600}> Table : {order.table_no}</Text>
                    </Stack>
                    <Spacer />
                    <IconButton
                      aria-label="Preview"
                      icon={<FiInfo />}
                      onClick={() => setPreviewOrder(order)}
                    />

                    <IconButton
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      colorScheme="orange"
                      onClick={() => onDeleteClick(order)}
                    />
                    <AlertDialog
                      isOpen={alertIsOpen}
                      leastDestructiveRef={leastDestructiveRef}
                      onClose={alertOnClose}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                          Delete Product
                        </AlertDialogHeader>

                        <AlertDialogBody>
                          Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <Button
                            ref={cancelRef}
                            onClick={() => setAlertIsOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={handleDelete}
                            ml={3}
                          >
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
                        <Text fontWeight={500}>
                          Rs. {order.total_price} ({order.payment_method})
                        </Text>
                      </Stack>
                      <Spacer />
                      <Stack direction={"row"}>
                        {order.order_status === "Preparing" && (
                          <>
                            <Button
                              colorScheme={"orange"}
                              isDisabled={true}
                              variant="outline"
                            >
                              Preparing
                            </Button>
                            <IconButton
                              aria-label="Completed order"
                              icon={<CheckIcon />}
                              mr={3}
                              variant="outline"
                              colorScheme={"green"}
                              onClick={() => handleComplete(order.order_id)}
                            />
                          </>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                </>
              </Stack>
            </Box>
          ))}
        {previewOrder && (
          <OrderDetailsModal
            order={previewOrder}
            onClose={() => setPreviewOrder(null)}
          />
        )}
      </Flex>
    </>
  );
};
export default PreparingOrders;
