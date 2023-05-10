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
import {
  addItemToCart,
  clearCart,
  removeItemFromCart,
  setCart,
  setTotalAmount,
  setTotalQuantity,
} from "../../store/cartSlice";
import { addOrder, deleteOrder, setOrders } from "../../store/orderSlice";
import KhaltiConfig from "../Khalti/KhaltiConfig";
import KhaltiCheckout from "khalti-checkout-web";
import useInput from "../../hooks/use-input";
import Cookies from "js-cookie";
import ViewBill from "../Card/ViewBill";

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
  // const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [newOrder, setNewOrder] = useState<IOrderData | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

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
    if (food_name && food_price && quantity) {
      // Dispatch an action to add the item to the Redux store
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

      // Get the cart items from the cookie (if it exists)
      const cartCookie = Cookies.get("cart");
      const cartItems: CartItem[] = cartCookie ? JSON.parse(cartCookie) : [];

      // Find the index of the existing item (if it exists) in the cart cookie
      const existingItemIndex = cartItems.findIndex((item) => item.id === id);

      if (existingItemIndex !== -1) {
        // If the item already exists, update its quantity and totalAmount in the cart cookie
        cartItems[existingItemIndex].quantity += quantity;
        cartItems[existingItemIndex].totalAmount =
          Number(cartItems[existingItemIndex].food_price) *
          cartItems[existingItemIndex].quantity;
      } else {
        // If the item does not exist, add it to the cart cookie
        cartItems.push({
          id: id,
          food_name: food_name,
          food_price: food_price,
          food_image: food_image,
          quantity,
          totalAmount,
        });
      }

      Cookies.set("cart", JSON.stringify(cartItems));
    }
  };

  const removeItemHandler = (id: number) => {
    // Dispatch an action to remove the item from the Redux store
    dispatch(removeItemFromCart(id));

    // Get the cart items from the cookie (if it exists)
    const cartCookie = Cookies.get("cart");
    const cartItems: CartItem[] = cartCookie ? JSON.parse(cartCookie) : [];

    // Find the index of the existing item in the cart cookie
    const existingItemIndex = cartItems.findIndex((item) => item.id === id);

    if (existingItemIndex !== -1) {
      // If the item exists, update its quantity and totalAmount in the cart cookie
      cartItems[existingItemIndex].quantity--;
      cartItems[existingItemIndex].totalAmount =
        Number(cartItems[existingItemIndex].totalAmount) -
        Number(cartItems[existingItemIndex].food_price);

      if (cartItems[existingItemIndex].quantity === 0) {
        // If the item quantity reaches 0, remove it from the cart cookie
        cartItems.splice(existingItemIndex, 1);
      }

      // Set the updated cart items in the cookie
      Cookies.set("cart", JSON.stringify(cartItems));
    }
  };

  useEffect(() => {
    const cartCookie = Cookies.get("cart");
    if (cartCookie) {
      const cartItems = JSON.parse(cartCookie);
      dispatch(setCart(cartItems));

      const totalQuantity = cartItems.reduce(
        (acc: number, item: CartItem) => acc + item.quantity,
        0
      );

      const totalAmount = cartItems.reduce(
        (acc: number, item: CartItem) =>
          acc + Number(item.food_price) * item.quantity,
        0
      );

      dispatch(setTotalQuantity(totalQuantity));
      dispatch(setTotalAmount(totalAmount));
    }

    // const orderPlacedCookie = Cookies.get("orderPlaced");
    // if (orderPlacedCookie) {
    //   setIsOrderPlaced(true);
    // }
  }, [dispatch]);

  const leastDestructiveRef = useRef<HTMLButtonElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [cancelAlertIsOpen, setCancelAlertIsOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");

  const alertOnClose = () => {
    setAlertIsOpen(false);
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

        // Retrieve old order IDs from cookies
        const oldOrderIds = JSON.parse(Cookies.get("orderId") || "[]");

        // Add the new order ID to the array
        oldOrderIds.push(data.order_id);

        // Set the updated order IDs in the cookie
        Cookies.set("orderId", JSON.stringify(oldOrderIds));

        console.log(Cookies.get("orderId"));

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
      dispatch(clearCart());
      Cookies.remove("cart");
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

  const [orderData, setOrderData] = useState<IOrderData>();

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
                            // isDisabled={isOrderPlaced}
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
                            // isDisabled={isOrderPlaced}
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
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {showReceipt && (
        <ViewBill order={orderData} onClose={() => setShowReceipt(false)} />
      )}
    </Box>
  );
};

export default CartDrawer;
