import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Image,
  Spacer,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import momo from "../../assets/momo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { CartItem } from "../../types/types";
import { addItemToCart, removeItemFromCart } from "../../store/cartSlice";
import OrderedItems from "../Card/OrderedItems";
import { fetchOrderDetails } from "../../api/api";
import { addOrder, setOrders } from "../../store/orderSlice";

interface RootState {
  cart: {
    cartItems: CartItem[];
    totalQuantity: number;
    totalAmount: number;
  };
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderedItem {
  food_id: number;
  quantity: number;
}

interface IOrderData {
  items: OrderedItem[];
  total_price: number | string;
  total_items: number | string;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const totalQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const toast = useToast();

  const addItemHandler = (
    id: number,
    food_name: string,
    food_price: string | number,
    food_image: string | File,
    quantity: number,
    totalAmount: number | string
  ) => {
    if (food_name && food_price && quantity) {
      dispatch(
        addItemToCart({
          id: id,
          food_name: food_name,
          food_price: food_price,
          food_image: food_image,
          quantity,
          totalAmount,
        })
      );
    }
  };

  const removeItemHandler = (id: number) => {
    dispatch(removeItemFromCart(id));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderedItems = await Promise.all(
      cartItems.map(async (item) => {
        const response = await fetch(
          "http://127.0.0.1:8000/api/menu/fooddetails/" + item.id
        );
        const food = await response.json();
        const orderedItem: OrderedItem = {
          food_id: food.food_id,
          quantity: item.quantity,
        };
        return orderedItem;
      })
    );

    const order: IOrderData = {
      items: orderedItems,
      total_price: totalAmount,
      total_items: totalQuantity,
    };
    ``;
    try {
      const response = await fetch("http://127.0.0.1:8000/api/order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      const data = await response.json();
      dispatch(addOrder(data));
      console.log(setOrders(data));
      toast({
        title: "Order Placed",
        description: `Your order #${data.order_id} has been placed successfully!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <Box borderBottomWidth="2px">
            <DrawerCloseButton />
            <DrawerHeader>Cart</DrawerHeader>
          </Box>
          <DrawerBody>
            <Stack pt={6}>
              <Box height="240px" overflowY="auto">
                {cartItems.map((item, index) => (
                  <Box key={item.id} pb="4">
                    <Stack
                      direction={"row"}
                      spacing={4}
                      align={"center"}
                      alignItems={"start"}
                      pb="2"
                    >
                      <Image
                        src={item.food_image as string}
                        alt={"Food Item"}
                        maxW={"140px"}
                        minW={"140px"}
                        objectFit={"cover"}
                        borderRadius={"md"}
                        maxH="80px"
                        minH="80px"
                      />

                      <Stack width="100%" pr="3">
                        <Text fontWeight={"semibold"} fontSize={"md"}>
                          {item.food_name}
                        </Text>
                        <Text
                          fontSize={"sm"}
                          color="gray"
                          fontWeight={"semibold"}
                        ></Text>
                        <Stack direction={"row"} spacing={"4"}>
                          <IconButton
                            aria-label="Remove from cart"
                            icon={<MinusIcon />}
                            borderRadius="md"
                            bg="gray.300"
                            _hover={{ bg: "gray.400" }}
                            size="xs"
                            data-index={index}
                            onClick={() => removeItemHandler(item.id!)}
                          />
                          <Text fontSize={"md"}>{item.quantity}</Text>
                          <IconButton
                            aria-label="Add to cart"
                            icon={<AddIcon />}
                            borderRadius="md"
                            bg="gray.300"
                            _hover={{ bg: "gray.400" }}
                            size="xs"
                            onClick={() => {
                              addItemHandler(
                                item.id!,
                                item.food_name,
                                item.food_price,
                                item.food_image,
                                1,
                                item.totalAmount
                              );
                            }}
                          />
                          <Spacer />
                          <Text
                            fontWeight={"semibold"}
                            fontSize={"sm"}
                            pb="2"
                            color={"orange"}
                          >
                            {item.quantity} X Rs {item.food_price}
                          </Text>
                        </Stack>
                      </Stack>
                    </Stack>

                    {index !== cartItems.length - 1 && (
                      <Divider borderBottomWidth={"3px"} />
                    )}
                  </Box>
                ))}
              </Box>
              <Divider pt="2" borderBottomWidth={"3px"} />
              <Box>
                <Stack direction={"row"} spacing={"4"} pt="2">
                  <Text fontWeight={"semibold"} fontSize={"sm"} color="gray">
                    Item
                  </Text>
                  <Spacer />
                  <Text fontWeight={"semibold"} fontSize={"sm"}>
                    {totalQuantity}
                  </Text>
                </Stack>
                <Stack direction={"row"} spacing={"4"} pt="2">
                  <Text fontWeight={"semibold"} fontSize={"sm"} color="gray">
                    Subtotal
                  </Text>
                  <Spacer />
                  <Text fontWeight={"semibold"} fontSize={"sm"}>
                    Rs {totalAmount}
                  </Text>
                </Stack>

                <Divider pt={2} pb="2" borderBottomWidth={"3px"} />
                <Stack direction={"row"} spacing={"4"} pt="2">
                  <Text fontWeight={"semibold"} fontSize={"md"}>
                    Total
                  </Text>
                  <Spacer />
                  <Text fontWeight={"semibold"} fontSize={"md"}>
                    Rs {totalAmount}
                  </Text>
                </Stack>
                <Divider pb="2" borderBottomWidth={"3px"} />
                <Stack pt="2" pb="2">
                  <Text fontWeight={"semibold"} fontSize={"md"}>
                    Payment Method
                  </Text>
                </Stack>
                <Stack direction="row" spacing="4" pt="2">
                  <Box
                    borderWidth="2px"
                    borderRadius="lg"
                    borderColor={
                      paymentMethod === "cash" ? "orange" : "gray.200"
                    }
                    p={3}
                    onClick={() => setPaymentMethod("cash")}
                    _hover={{ borderColor: "gray.300", cursor: "pointer" }}
                    alignItems="center"
                    as="button" // set the element as a button
                    bgColor={paymentMethod === "cash" ? "orange.100" : "white"}
                  >
                    <Text fontWeight="semibold" fontSize="sm">
                      Cash
                    </Text>
                  </Box>
                  <Box
                    borderWidth="2px"
                    borderRadius="lg"
                    borderColor={paymentMethod === "qr" ? "orange" : "gray.200"}
                    p={3}
                    onClick={() => setPaymentMethod("qr")}
                    _hover={{ borderColor: "gray.300", cursor: "pointer" }}
                    alignItems="center"
                    as="button" // set the element as a button
                    bgColor={paymentMethod === "qr" ? "orange.100" : "white"}
                  >
                    <Text fontWeight="semibold" fontSize="sm">
                      QR
                    </Text>
                  </Box>
                  <Box
                    borderWidth="2px"
                    borderRadius="lg"
                    borderColor={
                      paymentMethod === "debit" ? "orange" : "gray.200"
                    }
                    p={3}
                    onClick={() => setPaymentMethod("debit")}
                    _hover={{ borderColor: "gray.300", cursor: "pointer" }}
                    alignItems="center"
                    as="button" // set the element as a button
                    bgColor={paymentMethod === "debit" ? "orange.100" : "white"}
                  >
                    <Text fontWeight="semibold" fontSize="sm">
                      Debit
                    </Text>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="solid"
              colorScheme="orange"
              width="100%"
              borderRadius="md"
              _hover={{ bg: "orange.400" }}
              onClick={submitHandler}
            >
              Process Transaction
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default CartDrawer;
