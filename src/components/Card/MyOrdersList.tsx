import React, { SetStateAction } from "react";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { FiInfo } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { RootState } from "../../store/store";
import { IOrderData } from "../../types/types";
import { fetchOrderDetails, fetchOrdersByIds } from "../../api/api";
import { deleteOrder, setOrders } from "../../store/orderSlice";
import OrderReceipt from "./OrderReceipt";
import ViewBill from "./ViewBill";
import { updateOrderStatus } from "../../store/orderSlice";

const MyOrdersList = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const [selectedOrder, setSelectedOrder] = useState<IOrderData | null>(null);
  const [previewOrder, setPreviewOrder] = useState<IOrderData | null>(null);
  const toast = useToast();
  const [orderStatus, setOrderStatus] = useState("");
  const [order, setOrder] = useState<IOrderData | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderData, setOrderData] = useState<IOrderData>();

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

  useEffect(() => {
    const orderIdArray = JSON.parse(Cookies.get("orderId") || "[]");
    if (orderIdArray.length > 0) {
      const fetchOrders = async () => {
        const orders = await fetchOrdersByIds(orderIdArray);
        const transformedOrders = await Promise.all(
          orders.map(async (order) => {
            return await transformOrderData(order);
          })
        );
        dispatch(setOrders(transformedOrders));
      };
      fetchOrders();
    }
  }, []);

  const leastDestructiveRef = useRef<HTMLButtonElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [alertIsOpen, setAlertIsOpen] = useState(false);

  const onDeleteClick = (order: IOrderData) => {
    setSelectedOrder(order);
    setAlertIsOpen(true);
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

      Cookies.remove("orderId");
    }
  };

  const alertOnClose = () => {
    setAlertIsOpen(false);
  };

  const fetchOrderStatus = async () => {
    try {
      const orderIdArray = JSON.parse(Cookies.get("orderId") || "[]");
      if (orderIdArray.length > 0) {
        const promises = orderIdArray.map(async (orderId: number) => {
          const response = await fetch(
            `http://127.0.0.1:8000/api/order/${orderId}`
          );
          const data = await response.json();
          return data.order_status;
        });
        const orderStatusArray: any = await Promise.all(promises);
        setOrderStatus(orderStatusArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrderStatus();

    const interval = setInterval(fetchOrderStatus, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Flex flexWrap={"wrap"}>
        {orders.map((order, index) => (
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
                      {orderStatus[index] === "Pending" && (
                        <>
                          <Button
                            colorScheme={"red"}
                            variant="outline"
                            onClick={() => onDeleteClick(order)}
                          >
                            Cancel
                          </Button>
                          <AlertDialog
                            leastDestructiveRef={leastDestructiveRef}
                            onClose={alertOnClose}
                            isOpen={alertIsOpen}
                            motionPreset="slideInBottom"
                            isCentered
                          >
                            <AlertDialogOverlay />

                            <AlertDialogContent>
                              <AlertDialogHeader
                                fontSize="lg"
                                fontWeight="bold"
                              >
                                Cancel Order
                              </AlertDialogHeader>

                              <AlertDialogBody>
                                Are you sure? You can't undo this action
                                afterwards.
                              </AlertDialogBody>

                              <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={alertOnClose}>
                                  No
                                </Button>
                                <Button
                                  colorScheme="red"
                                  onClick={handleDelete}
                                  ml={3}
                                >
                                  Yes
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                      {orderStatus[index] === "Preparing" && (
                        <>
                          <Button
                            colorScheme={"orange"}
                            isDisabled={true}
                            variant="outline"
                          >
                            Preparing
                          </Button>
                        </>
                      )}
                      {orderStatus[index] === "Completed" && (
                        <>
                          <Button
                            colorScheme={"green"}
                            isDisabled={true}
                            variant="outline"
                          >
                            Completed
                          </Button>
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
          <ViewBill
            order={previewOrder}
            onClose={() => setPreviewOrder(null)}
          />
        )}
      </Flex>
    </>
  );
};

export default MyOrdersList;
