import { WarningIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  color,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchPastBookingDetails } from "../../api/api";
import { deleteBookings, setBookings } from "../../store/bookingSlice";
import { useAppDispatch } from "../../store/hooks";
import { IBookingData } from "../../types/types";

interface ViewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: IBookingData | null;
}

const BookingHistoryModal: React.FC<ViewBookingModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const fetchPastBookingDetailsCallback = useCallback(() => {
    fetchPastBookingDetails<IBookingData[]>().then((data) => {
      const transformedData = data.map((item) => {
        return {
          id: item.id,
          first_name: item.first_name,
          last_name: item.last_name,
          booking_date: item.booking_date,
          booking_duration: item.booking_duration,
          table_capacity: item.table_capacity,
          phone_number: item.phone_number,
          email: item.email,
          note: item.note,
          status: item.status,
        };
      });
      dispatch(setBookings(transformedData));
    });
  }, [dispatch]);

  useEffect(() => {
    fetchPastBookingDetailsCallback();
  }, [fetchPastBookingDetailsCallback]);

  const leastDestructiveRef = useRef<HTMLButtonElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [alertIsOpen, setAlertIsOpen] = useState(false);

  const onDeleteClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setAlertIsOpen(true);
  };

  const alertOnClose = () => {
    setAlertIsOpen(false);
  };

  const onDeleteConfirm = async () => {
    fetch(`http://127.0.0.1:8000/api/booking/list/past/${booking?.id}/`, {
      method: "DELETE",
    }).then(() => {
      dispatch(deleteBookings(booking?.id));
      toast({
        title: "Booking deleted",
        description: "Booking has been deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    });
  };

  return (
    <form>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent key={booking?.id} borderRadius="3xl" as={"form"}>
          <ModalHeader>Booking Details</ModalHeader>

          <ModalCloseButton />
          <ModalBody overflowY="auto">
            <VStack>
              <Stack
                direction={{
                  base: "column",
                  md: "row",
                }}
                spacing={4}
                w="100%"
              >
                <FormControl>
                  <FormLabel fontWeight="normal">First name</FormLabel>
                  <Input
                    placeholder="First name"
                    defaultValue={booking?.first_name}
                    isDisabled
                    textColor={"black"}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="normal">Last name</FormLabel>
                  <Input
                    placeholder="Last name"
                    defaultValue={booking?.last_name}
                    isDisabled
                  />
                </FormControl>
              </Stack>
              <FormControl>
                <FormLabel fontWeight="normal"> Email</FormLabel>
                <Input
                  placeholder="Email"
                  defaultValue={booking?.email}
                  isDisabled
                />
              </FormControl>
              <Stack
                direction={{
                  base: "column",
                  md: "row",
                }}
                spacing={4}
                w="100%"
              >
                <FormControl>
                  <FormLabel fontWeight="normal">Phone number</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children="+977" />
                    <Input
                      placeholder="Phone number"
                      defaultValue={booking?.phone_number}
                      isDisabled
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="normal">Table capacity</FormLabel>
                  <Input
                    placeholder="Table capacity"
                    defaultValue={booking?.table_capacity}
                    isDisabled
                  />
                </FormControl>
              </Stack>
              <Stack
                direction={{
                  base: "column",
                  md: "row",
                }}
                spacing={4}
                w="100%"
              >
                <FormControl>
                  <FormLabel fontWeight="normal">Booking date</FormLabel>
                  <Input
                    placeholder="Booking date"
                    defaultValue={booking?.booking_date}
                    isDisabled
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="normal">Booking duration</FormLabel>
                  <Input
                    placeholder="Booking duration"
                    defaultValue={booking?.booking_duration}
                    isDisabled
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="normal">Status</FormLabel>
                  <Select
                    placeholder="Select Option"
                    defaultValue={booking?.status}
                    isDisabled
                  >
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                  </Select>
                </FormControl>
              </Stack>

              <FormControl>
                <FormLabel fontWeight="normal">Note</FormLabel>
                <Textarea
                  placeholder="Note"
                  defaultValue={booking?.note}
                  isDisabled
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter w="100%" bgColor={"#EBEEF2"} borderBottomRadius="3xl">
            <Box
              backgroundColor={
                booking?.status === "Accepted"
                  ? "green.200"
                  : booking?.status === "Rejected"
                  ? "red.200"
                  : "gray.300"
              }
              color="white"
              fontSize={"sm"}
              w={{ base: "30%", md: "20%" }}
              h="10"
              borderRadius={"md"}
              display="flex"
              justifyContent="center"
              mx="6"
            >
              <HStack spacing={2}>
                <WarningIcon />
                <Text
                  fontWeight="medium"
                  color={
                    booking?.status === "Accepted"
                      ? "green.600"
                      : booking?.status === "Rejected"
                      ? "red.600"
                      : "gray.600"
                  }
                  textAlign="center"
                >
                  {booking?.status}
                </Text>
              </HStack>
            </Box>

            <Button
              type="submit"
              variant={"solid"}
              colorScheme={"red"}
              onClick={onDeleteClick}
              ref={leastDestructiveRef}
            >
              Delete Booking
            </Button>
            <AlertDialog
              isOpen={alertIsOpen}
              leastDestructiveRef={leastDestructiveRef}
              onClose={alertOnClose}
            >
              <AlertDialogOverlay>
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
                    <Button colorScheme="red" onClick={onDeleteConfirm} ml={3}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </form>
  );
};

export default BookingHistoryModal;
