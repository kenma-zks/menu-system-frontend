import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
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
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Image,
  Input,
  Spacer,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartItem, IOrderData, OrderedItem } from "../../types/types";
import { addItemToCart, removeItemFromCart } from "../../store/cartSlice";
import { addOrder, deleteOrder, setOrders } from "../../store/orderSlice";
import KhaltiConfig from "../Khalti/KhaltiConfig";
import KhaltiCheckout from "khalti-checkout-web";
import useInput from "../../hooks/use-input";

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

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const totalQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const toast = useToast();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [newOrder, setNewOrder] = useState<IOrderData | null>(null);

  const {
    value: enteredName,
    isValid: enteredNameisValid,
    hasError: enteredNameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInput((value) => (value as string).trim() !== "");

  const {
    value: enteredTable,
    isValid: enteredTableisValid,
    hasError: enteredTableHasError,
    valueChangeHandler: tableChangeHandler,
    inputBlurHandler: tableBlurHandler,
    reset: resetTableInput,
  } = useInput((value) => (value as string).trim() !== "");

  const addItemHandler = (
    id: number,
    food_name: string,
    food_price: string | number,
    food_image: string | File,
    quantity: number,
    totalAmount: number | string
  ) => {
    if (food_name && food_price && quantity && !isOrderPlaced) {
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
    if (!isOrderPlaced) {
      dispatch(removeItemFromCart(id));
    }
  };

  const leastDestructiveRef = useRef<HTMLButtonElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [cancelAlertIsOpen, setCancelAlertIsOpen] = useState(false);

  const alertOnClose = () => {
    setAlertIsOpen(false);
  };

  const cancelAlertOnClose = () => {
    setCancelAlertIsOpen(false);
  };

  const handlePayment = () => {
    const config = KhaltiConfig();
    const checkout = new KhaltiCheckout(config);
    const addKhaltiScript = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://khalti.com/static/khalti-checkout.js";
      script.async = true;
      script.onload = () => {
        checkout.show({ amount: totalAmount * 100 });
      };
      document.body.appendChild(script);
    };
    addKhaltiScript();
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredNameisValid && enteredTableisValid) {
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
        user_name: enteredName,
        table_no: enteredTable,
        items: orderedItems,
        total_price: totalAmount,
        total_items: totalQuantity,
        payment_method: paymentMethod,
      };
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
        alertOnClose();
        setNewOrder(data);
        setIsOrderPlaced(true);
        console.log(data);

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
      resetNameInput();
      resetTableInput();
    } else {
      toast({
        title: "Invalid Input",
        description: "Please check your inputs and try again!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const cancelHandler = async () => {
    try {
      if (newOrder) {
        // Check if a new order was created
        await fetch(`http://127.0.0.1:8000/api/order/${newOrder.order_id}`, {
          method: "DELETE",
        });
        dispatch(deleteOrder(newOrder.order_id));
        setIsOrderPlaced(false);
        cancelAlertOnClose();
        toast({
          title: "Order Cancelled",
          description: `Your order #${newOrder.order_id} has been cancelled successfully!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
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
                            isDisabled={isOrderPlaced}
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
                            isDisabled={isOrderPlaced}
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
                    disabled={cartItems.length === 0}
                  >
                    <Text fontWeight="semibold" fontSize="sm">
                      Cash
                    </Text>
                  </Box>
                  <Box
                    borderWidth="2px"
                    borderRadius="lg"
                    borderColor={
                      paymentMethod === "Khalti" ? "orange" : "gray.200"
                    }
                    p={3}
                    onClick={() => {
                      setPaymentMethod("Khalti");
                      handlePayment();
                    }}
                    _hover={{ borderColor: "gray.300", cursor: "pointer" }}
                    alignItems="center"
                    as="button" // set the element as a button
                    bgColor={
                      paymentMethod === "Khalti" ? "orange.100" : "white"
                    }
                    disabled={cartItems.length === 0}
                  >
                    <Text fontWeight="semibold" fontSize="sm">
                      Pay with Khalti
                    </Text>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            {isOrderPlaced ? (
              <>
                <Button
                  variant="solid"
                  colorScheme="orange"
                  width="100%"
                  borderRadius="md"
                  _hover={{ bg: "orange.400" }}
                  onClick={() => setCancelAlertIsOpen(true)}
                >
                  Cancel Order
                </Button>
                <AlertDialog
                  isOpen={cancelAlertIsOpen}
                  leastDestructiveRef={leastDestructiveRef}
                  onClose={() => setCancelAlertIsOpen(false)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Confirm Cancellation
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure you want to cancel your order?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button
                        ref={cancelRef}
                        onClick={() => setCancelAlertIsOpen(false)}
                      >
                        No, keep my order
                      </Button>
                      <Button colorScheme="red" onClick={cancelHandler} ml={3}>
                        Yes, cancel my order
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Button
                  variant="solid"
                  colorScheme="orange"
                  width="100%"
                  borderRadius="md"
                  _hover={{ bg: "orange.400" }}
                  onClick={() => setAlertIsOpen(true)}
                  disabled={cartItems.length === 0}
                >
                  Process Transaction
                </Button>
                <AlertDialog
                  isOpen={alertIsOpen}
                  leastDestructiveRef={leastDestructiveRef}
                  onClose={alertOnClose}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Confirm Order
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      <FormControl
                        id="firstName"
                        isRequired
                        pb="4"
                        isInvalid={enteredNameHasError}
                      >
                        <FormLabel fontSize={"small"} color="#633c7e">
                          Enter your name
                        </FormLabel>
                        <Input
                          type="text"
                          placeholder="Name"
                          onChange={nameChangeHandler}
                          onBlur={nameBlurHandler}
                          value={enteredName}
                        />
                        {enteredNameHasError && (
                          <FormErrorMessage>
                            Please enter a valid name
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="firstName"
                        isRequired
                        pb="4"
                        isInvalid={enteredTableHasError}
                      >
                        <FormLabel fontSize={"small"} color="#633c7e">
                          Enter table number
                        </FormLabel>
                        <Input
                          type="text"
                          placeholder="Table number"
                          onChange={tableChangeHandler}
                          onBlur={tableBlurHandler}
                          value={enteredTable}
                        />
                      </FormControl>
                      {enteredTableHasError && (
                        <FormErrorMessage>
                          Please enter a valid table number
                        </FormErrorMessage>
                      )}

                      <Text fontWeight={"semibold"} fontSize={"sm"} pt="4">
                        You cannot cancel your order once it is accepted.
                      </Text>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button
                        ref={cancelRef}
                        onClick={() => setAlertIsOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button colorScheme="red" onClick={submitHandler} ml={3}>
                        Order
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default CartDrawer;
