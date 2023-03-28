import { AddIcon, DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Avatar,
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
  HStack,
  Icon,
  IconButton,
  Image,
  Select,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { IProductData } from "../../types/types";
import momo from "../../assets/momo.jpg";
import { FaMoneyBillWaveAlt } from "react-icons/fa";

const DUMMY_Cart = {
  cart_id: 6,
  items: [
    {
      item_name: "Chicken Burger",
      item_price: 5.3,
      item_category: "burger",
    },
    {
      item_name: "Mix Salad",
      item_price: 2.3,
      item_category: "veg",
    },
    {
      item_name: "Mix Salad",
      item_price: 2.3,
      item_category: "veg",
    },
    {
      item_name: "Mix Salad",
      item_price: 2.3,
      item_category: "burger",
    },
  ],
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    setQuantity(quantity - 1);
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
                {DUMMY_Cart.items.map((item, index) => (
                  <Box key={index} pb="4">
                    <Stack
                      direction={"row"}
                      spacing={4}
                      align={"center"}
                      alignItems={"start"}
                      pb="2"
                    >
                      <Image
                        src={momo}
                        alt={"Chicken Burger"}
                        width={"140px"}
                        objectFit={"cover"}
                        borderRadius={"md"}
                        h="80px"
                      />

                      <Stack width="100%" pr="3">
                        <Text fontWeight={"semibold"} fontSize={"md"}>
                          {item.item_name}
                        </Text>
                        <Text
                          fontSize={"sm"}
                          color="gray"
                          fontWeight={"semibold"}
                        >
                          {item.item_category}
                        </Text>
                        <Stack direction={"row"} spacing={"4"}>
                          <IconButton
                            aria-label="Remove from cart"
                            icon={<MinusIcon />}
                            borderRadius="md"
                            bg="gray.300"
                            _hover={{ bg: "gray.400" }}
                            size="xs"
                            onClick={handleDecrement}
                          />
                          <Text fontSize={"md"}>{quantity}</Text>
                          <IconButton
                            aria-label="Add to cart"
                            icon={<AddIcon />}
                            borderRadius="md"
                            bg="gray.300"
                            _hover={{ bg: "gray.400" }}
                            size="xs"
                            onClick={handleIncrement}
                          />
                          <Spacer />
                          <Text
                            fontWeight={"semibold"}
                            fontSize={"sm"}
                            pb="2"
                            color={"orange"}
                          >
                            {quantity} X {item.item_price}
                          </Text>
                        </Stack>
                      </Stack>
                    </Stack>

                    {index !== DUMMY_Cart.items.length - 1 && (
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
                    {quantity} (items)
                  </Text>
                </Stack>
                <Stack direction={"row"} spacing={"4"} pt="2">
                  <Text fontWeight={"semibold"} fontSize={"sm"} color="gray">
                    Subtotal
                  </Text>
                  <Spacer />
                  <Text fontWeight={"semibold"} fontSize={"sm"}>
                    Rs {quantity * 5.3}
                  </Text>
                </Stack>
                <Stack direction={"row"} spacing={"4"} pt="2">
                  <Text fontWeight={"semibold"} fontSize={"sm"} color="gray">
                    Discount
                  </Text>
                  <Spacer />
                  <Text fontWeight={"semibold"} fontSize={"sm"} color="orange">
                    Rs 0
                  </Text>
                </Stack>
                <Divider pt={2} pb="2" borderBottomWidth={"3px"} />
                <Stack direction={"row"} spacing={"4"} pt="2">
                  <Text fontWeight={"semibold"} fontSize={"md"}>
                    Total
                  </Text>
                  <Spacer />
                  <Text fontWeight={"semibold"} fontSize={"md"}>
                    Rs {quantity * 5.3}
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
