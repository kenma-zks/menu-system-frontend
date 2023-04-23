import { WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
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
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { fetchBookingDetails } from "../../api/api";
import useInput from "../../hooks/use-input";
import { setBookings, updateBookings } from "../../store/bookingSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { IBookingData } from "../../types/types";

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: IBookingData | null;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const fetchBookingDetailsCallback = useCallback(() => {
    fetchBookingDetails<IBookingData[]>().then((data) => {
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
    fetchBookingDetailsCallback();
  }, [fetchBookingDetailsCallback]);

  const {
    value: enteredStatus,
    isValid: enteredStatusIsValid,
    valueChangeHandler: statusChangeHandler,
  } = useInput((value) => (value as string).trim() !== "");

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(enteredStatus);
    if (enteredStatusIsValid) {
      const updatedBooking = {
        id: booking?.id,
        first_name: booking?.first_name,
        last_name: booking?.last_name,
        booking_date: booking?.booking_date,
        booking_duration: booking?.booking_duration,
        table_capacity: booking?.table_capacity,
        phone_number: booking?.phone_number,
        email: booking?.email,
        note: booking?.note,
        status: enteredStatus,
      };
      fetch(`http://127.0.0.1:8000/api/booking/list/${booking?.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBooking),
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(updateBookings(data));
          toast({
            title: "Booking Status Updated",
            description: "Booking status has been updated successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent
          key={booking?.id}
          borderRadius="3xl"
          as={"form"}
          onSubmit={submitHandler}
        >
          <ModalHeader>Booking Details</ModalHeader>

          <ModalCloseButton />
          <ModalBody overflowY="auto">
            <VStack>
              <HStack w="100%">
                <FormControl>
                  <FormLabel fontWeight="normal">First name</FormLabel>
                  <Input
                    placeholder="First name"
                    defaultValue={booking?.first_name}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="normal">Last name</FormLabel>
                  <Input
                    placeholder="Last name"
                    defaultValue={booking?.last_name}
                  />
                </FormControl>
              </HStack>
              <FormControl>
                <FormLabel fontWeight="normal"> Email</FormLabel>
                <Input placeholder="Email" defaultValue={booking?.email} />
              </FormControl>
              <HStack w="100%">
                <FormControl>
                  <FormLabel fontWeight="normal">Phone number</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children="+977" />
                    <Input
                      placeholder="Phone number"
                      defaultValue={booking?.phone_number}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="normal">Table capacity</FormLabel>
                  <Input
                    placeholder="Table capacity"
                    defaultValue={booking?.table_capacity}
                  />
                </FormControl>
              </HStack>
              <HStack w="100%">
                <FormControl>
                  <FormLabel fontWeight="normal">Booking date</FormLabel>
                  <Input
                    placeholder="Booking date"
                    defaultValue={booking?.booking_date}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="normal">Booking duration</FormLabel>
                  <Input
                    placeholder="Booking duration"
                    defaultValue={booking?.booking_duration}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="normal">Status</FormLabel>
                  <Select
                    placeholder="Select Option"
                    defaultValue={booking?.status}
                    onChange={statusChangeHandler}
                  >
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel fontWeight="normal">Note</FormLabel>
                <Textarea placeholder="Note" defaultValue={booking?.note} />
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
              w="20%"
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

            <Button type="submit" colorScheme="orange">
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditBookingModal;
