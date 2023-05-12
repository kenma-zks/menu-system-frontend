import { CheckIcon, CloseIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
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
          booking_time: item.booking_time,
          table_capacity: item.table_capacity,
          phone_number: item.phone_number,
          email: item.email,
          note: item.note,
          status: item.status,
        };
      });
      dispatch(setBookings(transformedData));
      console.log(transformedData);
    });
  }, [dispatch]);

  useEffect(() => {
    fetchBookingDetailsCallback();
  }, [fetchBookingDetailsCallback]);

  const handleAccept = (id?: number) => {
    fetch(`http://127.0.0.1:8000/api/booking/list/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Accepted" }),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(updateBookings(data));
        toast({
          title: "Booking Accepted",
          description: "Booking has been accepted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        const email = data.email;
        const booking_date = data.booking_date;
        const booking_time = data.booking_time;
        const table_capacity = data.table_capacity;
        fetch(`http://127.0.0.1:8000/api/booking/email/`, {
          method: "POST",
          body: JSON.stringify({
            email: email,
            booking_date: booking_date,
            booking_time: booking_time,
            table_capacity: table_capacity,
            status: "Accepted",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          })

          .catch((error) => {
            console.log(error);
          });
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleReject = (id?: number) => {
    fetch(`http://127.0.0.1:8000/api/booking/list/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Rejected" }),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(updateBookings(data));
        toast({
          title: "Booking Rejected",
          description: "Booking has been rejected",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        const email = data.email;
        const booking_date = data.booking_date;
        const booking_time = data.booking_time;
        const table_capacity = data.table_capacity;
        fetch(`http://127.0.0.1:8000/api/booking/email/`, {
          method: "POST",
          body: JSON.stringify({
            email: email,
            booking_date: booking_date,
            booking_time: booking_time,
            table_capacity: table_capacity,
            status: "Rejected",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.log(error);
          });
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent key={booking?.id} borderRadius="3xl">
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
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="normal">Last name</FormLabel>
                  <Input
                    placeholder="Last name"
                    defaultValue={booking?.last_name}
                  />
                </FormControl>
              </Stack>
              <FormControl>
                <FormLabel fontWeight="normal"> Email</FormLabel>
                <Input placeholder="Email" defaultValue={booking?.email} />
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
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="normal">Booking time</FormLabel>
                  <Input
                    placeholder="Booking time"
                    defaultValue={booking?.booking_time}
                  />
                </FormControl>
              </Stack>

              <FormControl>
                <FormLabel fontWeight="normal">Note</FormLabel>
                <Textarea placeholder="Note" defaultValue={booking?.note} />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter w="100%" bgColor={"#EBEEF2"} borderBottomRadius="3xl">
            {booking?.status === "Pending" && (
              <>
                <Button
                  type="submit"
                  colorScheme="orange"
                  mr={3}
                  variant={"outline"}
                  _hover={{
                    bg: "orange.600",
                    color: "white",
                  }}
                  onClick={() => handleReject(booking?.id)}
                >
                  Reject Booking
                </Button>
                <Button
                  type="submit"
                  colorScheme="green"
                  mr={3}
                  variant={"outline"}
                  _hover={{
                    bg: "green.600",
                    color: "white",
                  }}
                  onClick={() => handleAccept(booking?.id)}
                >
                  Accept Booking
                </Button>
              </>
            )}
            {booking?.status === "Accepted" && (
              <>
                <Button
                  type="submit"
                  colorScheme="orange"
                  mr={3}
                  variant={"outline"}
                  _hover={{
                    bg: "orange.600",
                    color: "white",
                  }}
                  onClick={() => handleReject(booking?.id)}
                >
                  Reject Booking
                </Button>
                <Button
                  type="submit"
                  colorScheme="green"
                  mr={3}
                  variant={"solid"}
                  _hover={{
                    bg: "green.600",
                    color: "white",
                  }}
                  isDisabled={true}
                >
                  Booking Accepted
                </Button>
              </>
            )}
            {booking?.status === "Rejected" && (
              <>
                <Button
                  type="submit"
                  colorScheme="green"
                  mr={3}
                  variant={"solid"}
                  _hover={{
                    bg: "green.600",
                    color: "white",
                  }}
                  onClick={() => handleAccept(booking?.id)}
                >
                  Accept Booking
                </Button>
                <Button
                  type="submit"
                  colorScheme="orange"
                  mr={3}
                  variant={"solid"}
                  _hover={{
                    bg: "orange.600",
                    color: "white",
                  }}
                  isDisabled={true}
                >
                  Booking Rejected
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditBookingModal;
