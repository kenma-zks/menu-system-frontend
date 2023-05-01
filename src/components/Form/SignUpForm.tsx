import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import bg1 from "../../assets/bg1.webp";
import useInput from "../../hooks/use-input";

import { Link as RouterLink } from "react-router-dom";
import { IRegisterData } from "../../types/types";

interface IRegisterFormProps {
  onReceiveFormData: (data: IRegisterData) => void;
}

const SignUpForm = ({ onReceiveFormData }: IRegisterFormProps) => {
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
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: enteredPasswordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput((value) => (value as string).trim().length >= 8);

  const {
    value: enteredConfirmPassword,
    isValid: enteredConfirmPasswordIsValid,
    hasError: enteredConfirmPasswordHasError,
    valueChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
    reset: resetConfirmPasswordInput,
  } = useInput(
    (value) =>
      (value as string).trim() === enteredPassword &&
      enteredPassword.trim().length >= 8
  );

  const validate =
    enteredFirstNameIsValid &&
    enteredLastNameIsValid &&
    enteredEmailIsValid &&
    enteredPhoneNumberIsValid &&
    enteredPasswordIsValid &&
    enteredConfirmPasswordIsValid;

  function submitHandler(
    event: React.FormEvent<HTMLFormElement | HTMLDivElement>
  ) {
    event.preventDefault();

    if (validate) {
      const data = {
        first_name: enteredFirstName,
        last_name: enteredLastName,
        email: enteredEmail,
        phone_number: enteredPhoneNumber,
        password: enteredPassword,
        confirm_password: enteredConfirmPassword,
      };
      resetFirstNameInput();
      resetLastNameInput();
      resetEmailInput();
      resetPhoneNumberInput();
      resetPasswordInput();
      resetConfirmPasswordInput();
      onReceiveFormData(data);
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

  return (
    <Box as="form" onSubmit={submitHandler}>
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex flex={1} display={{ base: "none", md: "none", lg: "flex" }}>
          <Image alt={"Signup Image"} objectFit={"cover"} src={bg1} w={600} />
        </Flex>
        <Flex
          flex={1}
          w={"full"}
          justify={"center"}
          pt={{ base: 10, md: 40, lg: 20 }}
          pl={10}
          pr={{ base: 20, md: 40, lg: 60 }}
        >
          <Stack spacing={4} w={"full"}>
            <Heading
              fontSize={"3xl"}
              fontWeight={"semibold"}
              pb={4}
              color="#633c7e"
            >
              Register
            </Heading>
            <Text
              fontSize={"small"}
              fontWeight={"medium"}
              color={"gray"}
              pb={4}
            >
              Let's get you set up with an account. Please fill out the form
              below
            </Text>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <FormControl
                id="firstName"
                isRequired
                isInvalid={enteredFirstNameHasError}
              >
                <FormLabel fontSize={"small"} color="#633c7e">
                  First Name
                </FormLabel>
                <Input
                  type="text"
                  placeholder="First name"
                  onChange={firstNameChangeHandler}
                  onBlur={firstNameBlurHandler}
                  value={enteredFirstName}
                />
                {enteredFirstNameHasError && (
                  <FormErrorMessage>
                    Please enter a valid first name.
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="lastName"
                isRequired
                isInvalid={enteredLastNameHasError}
              >
                <FormLabel fontSize={"small"} color="#633c7e">
                  Last Name
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Last name"
                  onChange={lastNameChangeHandler}
                  onBlur={lastNameBlurHandler}
                  value={enteredLastName}
                />
                {enteredLastNameHasError && (
                  <FormErrorMessage>
                    Please enter a valid last name.
                  </FormErrorMessage>
                )}
              </FormControl>
            </Stack>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <FormControl
                id="phoneNumber"
                isRequired
                isInvalid={enteredPhoneNumberHasError}
              >
                <FormLabel fontSize={"small"} color="#633c7e">
                  Phone Number
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Phone number"
                  onChange={phoneNumberChangeHandler}
                  onBlur={phoneNumberBlurHandler}
                  value={enteredPhoneNumber}
                />
                {enteredPhoneNumberHasError && (
                  <FormErrorMessage>
                    Please enter a valid phone number.
                  </FormErrorMessage>
                )}
              </FormControl>
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
                  placeholder="Email Address"
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                  value={enteredEmail}
                />
                {enteredEmailHasError && (
                  <FormErrorMessage>
                    Please enter a valid email address.
                  </FormErrorMessage>
                )}
              </FormControl>
            </Stack>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <FormControl
                id="password"
                isRequired
                isInvalid={enteredPasswordHasError}
              >
                <FormLabel fontSize={"small"} color="#633c7e">
                  Password
                </FormLabel>
                <Input
                  type="password"
                  placeholder="Password"
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                  value={enteredPassword}
                />
                {enteredPasswordHasError && (
                  <FormErrorMessage>
                    Password must be at least 8 characters.
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="confirmPassword"
                isRequired
                isInvalid={enteredConfirmPasswordHasError}
              >
                <FormLabel fontSize={"small"} color="#633c7e">
                  Confirm Password
                </FormLabel>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  onChange={confirmPasswordChangeHandler}
                  onBlur={confirmPasswordBlurHandler}
                  value={enteredConfirmPassword}
                />
                {enteredConfirmPasswordHasError && (
                  <FormErrorMessage>Password does not match.</FormErrorMessage>
                )}
              </FormControl>
            </Stack>
            <Box pt={4}>
              <Button
                backgroundColor="#144ec7"
                color="white"
                w={200}
                _hover={{
                  backgroundColor: "#1B1091",
                }}
                _active={{
                  backgroundColor: "#1B1091",
                }}
                type="submit"
              >
                Create Account
              </Button>
            </Box>
            <Stack>
              <Text
                align={"left"}
                fontSize={"small"}
                fontWeight={"semibold"}
                color={"gray"}
              >
                Already have an account?{" "}
                <Link color="#03a6d4" as={RouterLink} to="/admin/login">
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Flex>
      </Stack>
    </Box>
  );
};

export default SignUpForm;
