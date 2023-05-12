import React, { useRef, useState } from "react";

import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import useInput from "../hooks/use-input";

import { IBookingData } from "../types/types";

interface BookVisitProps {
  onAddBooking: (booking: IBookingData) => void;
}

const BookVisitForm = ({ onAddBooking }: BookVisitProps) => {
  const {
    value: enteredFirstName,
    isValid: enteredFirstNameIsValid,
    hasError: enteredFirstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    reset: resetFirstNameInput,
  } = useInput((value) => (value as string).trim() !== "");

  const {
    value: enteredLastName,
    isValid: enteredLastNameIsValid,
    hasError: enteredLastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    reset: resetLastNameInput,
  } = useInput((value) => (value as string).trim() !== "");

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: enteredEmailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput((value) => (value as string).includes("@"));

  const {
    value: enteredPhoneNumber,
    isValid: enteredPhoneNumberIsValid,
    hasError: enteredPhoneNumberHasError,
    valueChangeHandler: phoneNumberChangeHandler,
    inputBlurHandler: phoneNumberBlurHandler,
    reset: resetPhoneNumberInput,
  } = useInput((value) => (value as number).toString().length === 10);

  const {
    value: enteredTableCapacity,
    isValid: enteredTableCapacityIsValid,
    hasError: enteredTableCapacityHasError,
    valueChangeHandler: tableCapacityChangeHandler,
    inputBlurHandler: tableCapacityBlurHandler,
    reset: resetTableCapacityInput,
  } = useInput((value) => (value as string).trim() !== "");

  const {
    value: enteredBookingDate,
    isValid: enteredBookingDateIsValid,
    hasError: enteredBookingDateHasError,
    valueChangeHandler: bookingDateChangeHandler,
    inputBlurHandler: bookingDateBlurHandler,
    reset: resetBookingDateInput,
  } = useInput((value) => {
    const trimmedValue = (value as string).trim();
    const currentDate = new Date();
    const enteredDate = new Date(trimmedValue);

    return trimmedValue !== "" && enteredDate >= currentDate;
  });

  const {
    value: enteredBookingTime,
    isValid: enteredBookingTimeIsValid,
    hasError: enteredBookingTimeHasError,
    valueChangeHandler: bookingTimeChangeHandler,
    inputBlurHandler: bookingTimeBlurHandler,
    reset: resetBookingTimeInput,
  } = useInput((value) => (value as string).trim() !== "");

  const {
    value: enteredNote,
    valueChangeHandler: enteredNoteChangeHandler,
    reset: resetNoteInput,
  } = useInput(() => true);

  const validate =
    enteredFirstNameIsValid &&
    enteredLastNameIsValid &&
    enteredEmailIsValid &&
    enteredPhoneNumberIsValid &&
    enteredTableCapacityIsValid &&
    enteredBookingDateIsValid &&
    enteredBookingTimeIsValid;

  function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (validate) {
      const booking = {
        first_name: enteredFirstName,
        last_name: enteredLastName,
        email: enteredEmail,
        phone_number: enteredPhoneNumber,
        table_capacity: enteredTableCapacity,
        booking_date: enteredBookingDate,
        booking_time: enteredBookingTime,
        note: enteredNote,
        status: "Pending",
      };
      resetFirstNameInput();
      resetLastNameInput();
      resetEmailInput();
      resetPhoneNumberInput();
      resetTableCapacityInput();
      resetBookingDateInput();
      resetBookingTimeInput();
      resetNoteInput();
      onAddBooking(booking);
    } else {
      toast({
        title: "Invalid input.",
        description: "Please check your input.",
        status: "error",
        duration: 9000,
        isClosable: true,
        variant: "left-accent",
      });
    }
  }
  const toast = useToast();
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().substring(0, 16);

  return (
    <VStack padding={4} alignItems="flex-start">
      <form onSubmit={submitHandler}>
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" mb="2%">
          Book Visit
        </Text>
        <Flex>
          <FormControl mr="3%" isInvalid={enteredFirstNameHasError}>
            <FormLabel htmlFor="first-name" fontWeight="normal">
              First name
            </FormLabel>
            <Input
              id="first-name"
              placeholder="First name"
              onChange={firstNameChangeHandler}
              onBlur={firstNameBlurHandler}
              value={enteredFirstName}
            />
            {enteredFirstNameHasError && (
              <FormErrorMessage>Enter a valid name</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={enteredLastNameHasError}>
            <FormLabel htmlFor="last-name" fontWeight="normal">
              Last name
            </FormLabel>
            <Input
              id="last-name"
              placeholder="Last name"
              onChange={lastNameChangeHandler}
              onBlur={lastNameBlurHandler}
              value={enteredLastName}
            />
            {enteredLastNameHasError && (
              <FormErrorMessage> Enter a valid name </FormErrorMessage>
            )}
          </FormControl>
        </Flex>
        <FormControl mt="3%" isInvalid={enteredEmailHasError}>
          <FormLabel htmlFor="email" fontWeight="normal">
            Email Address
          </FormLabel>
          <Input
            id="email"
            placeholder="Email Address"
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            value={enteredEmail}
          />
          {enteredEmailHasError && (
            <FormErrorMessage>Enter a valid email</FormErrorMessage>
          )}
        </FormControl>
        <FormControl mt="3%" isInvalid={enteredPhoneNumberHasError}>
          <FormLabel htmlFor="email" fontWeight="normal">
            Phone Number
          </FormLabel>
          <InputGroup>
            <InputLeftAddon children="+977" />
            <Input
              type="number"
              placeholder="Phone number"
              onChange={phoneNumberChangeHandler}
              onBlur={phoneNumberBlurHandler}
              value={enteredPhoneNumber}
            />
          </InputGroup>
          {enteredPhoneNumberHasError && (
            <FormErrorMessage>Enter a valid phone number</FormErrorMessage>
          )}
        </FormControl>

        <FormControl mt="3%" isInvalid={enteredTableCapacityHasError}>
          <FormLabel htmlFor="table-capacity" fontWeight="normal">
            Table Capacity
          </FormLabel>
          <Input
            placeholder="Table Capacity"
            onChange={tableCapacityChangeHandler}
            onBlur={tableCapacityBlurHandler}
            value={enteredTableCapacity}
          />
          {enteredTableCapacityHasError && (
            <FormErrorMessage>Enter a valid table capacity</FormErrorMessage>
          )}
        </FormControl>

        <FormControl mt="3%" isInvalid={enteredBookingDateHasError}>
          <FormLabel htmlFor="booking-date" fontWeight="normal">
            Booking Date
          </FormLabel>
          <Input
            placeholder="Booking Date"
            type="date"
            min={currentDateString}
            onChange={bookingDateChangeHandler}
            onBlur={bookingDateBlurHandler}
            value={enteredBookingDate}
          />
          {enteredBookingDateHasError && (
            <FormErrorMessage>Enter a valid booking date</FormErrorMessage>
          )}
        </FormControl>

        <FormControl mt="3%" isInvalid={enteredBookingTimeHasError}>
          <FormLabel htmlFor="booking_time" fontWeight="normal">
            Booking Time
          </FormLabel>
          <Input
            placeholder="EG: 10AM "
            onChange={bookingTimeChangeHandler}
            onBlur={bookingTimeBlurHandler}
            value={enteredBookingTime}
          />
          {enteredBookingTimeHasError && (
            <FormErrorMessage>Enter a valid booking Time</FormErrorMessage>
          )}
        </FormControl>

        <FormControl mt="3%">
          <FormLabel htmlFor="message" fontWeight="normal">
            Message
          </FormLabel>
          <Textarea
            id="message"
            placeholder="Message"
            value={enteredNote}
            onChange={enteredNoteChangeHandler}
          />
        </FormControl>

        <FormControl mt="5%">
          <Button type="submit" colorScheme="teal" size="md" w="full">
            Book Table
          </Button>
        </FormControl>
      </form>
    </VStack>
  );
};
export default BookVisitForm;
