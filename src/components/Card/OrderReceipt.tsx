import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Divider,
  HStack,
  VStack,
  ModalFooter,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { IOrderData } from "../../types/types";
import { useRef, useState } from "react";
import useInput from "../../hooks/use-input";

interface OrderReceiptProps {
  order: IOrderData | undefined;
  onClose: () => void;
}

const OrderReceipt = ({ order, onClose }: OrderReceiptProps) => {
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: enteredEmailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput((value) => (value as string).includes("@"));

  const leastDestructiveRef = useRef<HTMLButtonElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [alertIsOpen, setAlertIsOpen] = useState(false);

  const mailPDF = async () => {
    if (enteredEmailIsValid) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/order/email/${order?.order_id}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: enteredEmail,
            }),
          }
        );

        const data = await response.json();
        console.log(data);
        setAlertIsOpen(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const generateOrderPDF = () => {
    fetch(`http://localhost:8000/api/order/pdf/${order?.order_id}/`)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={"400px"}>
        <ModalHeader>
          <Text pb="2">Order #{order?.order_id}</Text>
          <Text pb="2" fontSize={"xs"} fontWeight={"semibold"} color={"gray"}>
            Ordered Date: {order?.ordered_date} | Ordered Time:{" "}
            {order?.ordered_time?.split(":").slice(0, 2).join(":")}
          </Text>
          <Divider borderBottomWidth={"2px"} borderColor={"gray"} />
        </ModalHeader>

        <ModalCloseButton />
        <ModalBody>
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Customer Name :
            </Text>
            <VStack>
              <Text fontSize="sm" fontWeight="semibold" color="gray">
                {order?.user_name}
              </Text>
            </VStack>
          </HStack>
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Table No :
            </Text>
            <VStack>
              <Text fontSize="sm" fontWeight="semibold" color="gray">
                {order?.table_no}
              </Text>
            </VStack>
          </HStack>
          <Divider my="4" borderBottomWidth={"2px"} borderColor={"gray"} />
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Ordered Items :
            </Text>
            <VStack alignItems="flex-end">
              {order?.items.map((item) => (
                <Text
                  key={item.food_id}
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray"
                >
                  {item.food_name} x {item.quantity}
                </Text>
              ))}
            </VStack>
          </HStack>
          <Divider my="4" borderBottomWidth={"2px"} borderColor={"gray"} />
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Additional Notes :
            </Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray">
              {order?.note}
            </Text>
          </HStack>
          <Divider my="4" borderBottomWidth={"2px"} borderColor={"gray"} />
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Total Price :
            </Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray">
              Rs {order?.total_price}
            </Text>
          </HStack>
          <Divider my="4" borderBottomWidth={"2px"} borderColor={"gray"} />
          <HStack pb="4" alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Payment Method :
            </Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray">
              {order?.payment_method}
            </Text>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <HStack w={"100%"} justifyContent="space-between">
            <Button w={"100%"} onClick={generateOrderPDF}>
              Create Bill
            </Button>
            <Button w={"100%"} onClick={() => setAlertIsOpen(true)}>
              Mail Bill
            </Button>
            <AlertDialog
              isOpen={alertIsOpen}
              leastDestructiveRef={leastDestructiveRef}
              onClose={() => setAlertIsOpen(false)}
            >
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Enter your email address
                </AlertDialogHeader>

                <AlertDialogBody>
                  <FormControl
                    id="email"
                    isRequired
                    isInvalid={enteredEmailHasError}
                  >
                    <FormLabel fontSize={"small"} color="#633c7e">
                      Email address
                    </FormLabel>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={enteredEmail}
                      onChange={emailChangeHandler}
                      onBlur={emailBlurHandler}
                      autoComplete="off"
                    />
                    {enteredEmailHasError && (
                      <FormErrorMessage>
                        Please enter a valid email address.
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={() => setAlertIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={mailPDF}
                    ml={3}
                    type="submit"
                  >
                    Send
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderReceipt;
