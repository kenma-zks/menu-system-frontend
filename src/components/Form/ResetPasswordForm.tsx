import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Link,
  Flex,
  Image,
  Heading,
  useToast,
  Divider,
  HStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { Fragment, useState } from "react";
import login2 from "../../assets/login2.webp";
import logo from "../../assets/logo.png";
import { Link as RouterLink, useLocation } from "react-router-dom";
import useInput from "../../hooks/use-input";
import { IResetPasswordData } from "../../types/types";

interface IResetPasswordForm {
  onReceiveFormData: (data: IResetPasswordData) => void;
}

const ResetPasswordForm = ({ onReceiveFormData }: IResetPasswordForm) => {
  const toast = useToast();
  const state = useLocation();

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

  const submitHandler = (
    e: React.FormEvent<HTMLDivElement | HTMLFormElement>
  ) => {
    e.preventDefault();
    if (enteredPasswordIsValid && enteredConfirmPasswordIsValid) {
      resetPasswordInput();
      resetConfirmPasswordInput();
      onReceiveFormData({
        user_id: state.state.userId,
        password: enteredPassword,
        confirm_password: enteredConfirmPassword,
      });
    } else {
      toast({
        title: "Reset password failed.",
        description: "Please check your credentials.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Fragment>
      <Box as="form" onSubmit={submitHandler}>
        <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
          <Flex flex={1.25} display={{ base: "none", md: "none", lg: "flex" }}>
            <Image alt={"Login Image"} objectFit={"cover"} src={login2} />
          </Flex>
          <Flex flex={1} w="full">
            <Stack
              spacing={4}
              w={"full"}
              pl={{ base: 10, md: "60px" }}
              pt={10}
              pr={{ base: 10, md: "60px" }}
            >
              <Image alt={"logo"} src={logo} h={75} w={75} />

              <Heading
                pt={20}
                fontSize={"3xl"}
                fontWeight={"semibold"}
                pb={4}
                color="#633c7e"
              >
                Reset Password
              </Heading>
              <Text
                fontSize={"small"}
                fontWeight={"semibold"}
                color={"gray"}
                pb={4}
              >
                Enter your new password and confirm it.
              </Text>

              <FormControl
                id="password"
                isRequired
                isInvalid={enteredPasswordHasError}
              >
                <FormLabel fontSize={"small"} color="#633c7e">
                  New Password
                </FormLabel>
                <Input
                  type="password"
                  placeholder="password"
                  value={enteredPassword}
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                  autoComplete="off"
                />
                {enteredConfirmPasswordHasError && (
                  <FormErrorMessage>
                    Please enter a valid password.
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="password"
                isRequired
                isInvalid={enteredConfirmPasswordHasError}
                pb={4}
              >
                <FormLabel fontSize={"small"} color="#633c7e">
                  Confirm Password
                </FormLabel>
                <Input
                  type="password"
                  placeholder="confirm password"
                  value={enteredConfirmPassword}
                  onChange={confirmPasswordChangeHandler}
                  onBlur={confirmPasswordBlurHandler}
                  autoComplete="off"
                />
                {enteredConfirmPasswordHasError && (
                  <FormErrorMessage>Password does not match.</FormErrorMessage>
                )}
              </FormControl>

              <Button
                bg={"#144ec7"}
                color={"white"}
                _hover={{
                  backgroundColor: "#1B1091",
                }}
                _active={{
                  backgroundColor: "#1B1091",
                }}
                type="submit"
              >
                Reset Password
              </Button>
              <HStack pt={3} justify="center" align="center">
                <Divider
                  borderBottomColor={"gray"}
                  borderBottomWidth={"1px"}
                  orientation="horizontal"
                />
                <Text px={"4"} fontSize="sm" fontWeight="semibold" color="gray">
                  OR
                </Text>
                <Divider
                  borderBottomColor={"gray"}
                  borderBottomWidth={"1px"}
                  orientation="horizontal"
                />
              </HStack>
              <Flex justify="space-between" align="center" pt={3}>
                <Text fontSize="sm" fontWeight="semibold" color="gray">
                  <Link color="black.100" as={RouterLink} to="/admin/login">
                    Back to login
                  </Link>
                </Text>

                <Stack>
                  <Text
                    fontSize={"sm"}
                    fontWeight={"semibold"}
                    color={"gray"}
                    align="center"
                  >
                    <Link
                      color={"black.100"}
                      as={RouterLink}
                      to="/admin/signup"
                    >
                      Create new account
                    </Link>
                  </Text>
                </Stack>
              </Flex>
            </Stack>
          </Flex>
        </Stack>
      </Box>
    </Fragment>
  );
};

export default ResetPasswordForm;
