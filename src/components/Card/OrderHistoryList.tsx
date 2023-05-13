import { DeleteIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { IOrderData } from "../../types/types";
import { deleteOrder } from "../../store/orderSlice";
import OrderReceipt from "./OrderReceipt";
import { FiInfo } from "react-icons/fi";

const OrderedHistoryItems = ({ orders }: { orders: IOrderData }) => {
  const dispatch = useDispatch();

  const [selectedOrder, setSelectedOrder] = useState<IOrderData | null>(null);
  const [previewOrder, setPreviewOrder] = useState<IOrderData | null>(null);
  const toast = useToast();

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

  return (
    <>
      <Box
        bg={useColorModeValue("white", "gray.800")}
        width={{ base: "280px", md: "330px", lg: "330px" }}
        p="4"
        borderRadius={"8"}
        height="330px"
        mr="8"
        mb="4"
        key={orders.order_id}
      >
        <Stack mb="6">
          <>
            <Stack direction={"row"}>
              <Stack direction={"column"}>
                <Text fontWeight={600}>{orders.user_name}</Text>
                <Text fontWeight={600}> Table : {orders.table_no}</Text>
              </Stack>
              <Spacer />
              <IconButton
                aria-label="Preview"
                icon={<FiInfo />}
                onClick={() => setPreviewOrder(orders)}
              />

              <IconButton
                aria-label="Delete"
                icon={<DeleteIcon />}
                colorScheme="orange"
                onClick={() => onDeleteClick(orders)}
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
                    <Button colorScheme="red" onClick={handleDelete} ml={3}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Stack>

            <Stack pt={6}>
              <Box height="150px" overflowY="auto">
                {orders.items.map((item, index) => (
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
                      {index !== orders.items.length - 1 && (
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
                    X {orders.total_items} items
                  </Text>
                  <Text fontWeight={500}>
                    Rs. {orders.total_price} ({orders.payment_method})
                  </Text>
                </Stack>
                <Spacer />
                <Stack direction={"row"}>
                  {orders.order_status === "Completed" && (
                    <Button colorScheme="green" size="md" variant="outline">
                      Completed
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </>
        </Stack>
      </Box>
      {previewOrder && (
        <OrderReceipt
          order={previewOrder}
          onClose={() => setPreviewOrder(null)}
        />
      )}
    </>
  );
};
export default OrderedHistoryItems;
