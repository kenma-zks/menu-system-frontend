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
import { Link as RouterLink } from "react-router-dom";
import useInput from "../../hooks/use-input";
import { IVerifyEmailData } from "../../types/types";

interface IForgotPasswordFormProps {
  onReceiveFormData: (data: IVerifyEmailData) => void;
}

const ForgotPasswordForm = ({
  onReceiveFormData,
}: IForgotPasswordFormProps) => {
  const toast = useToast();

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: enteredEmailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput((value) => (value as string).includes("@"));

  const submitHandler = (
    e: React.FormEvent<HTMLDivElement | HTMLFormElement>
  ) => {
    e.preventDefault();
    if (enteredEmailIsValid) {
      onReceiveFormData({ email: enteredEmail });
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
              pl={{ base: "20px", md: "40px", lg: "60px" }}
              pt={10}
              pr={{ base: "20px", md: "40px", lg: "20" }}
            >
              <Image alt={"logo"} src={logo} h={75} w={75} />

              <Heading
                pt={20}
                fontSize={"3xl"}
                fontWeight={"semibold"}
                pb={4}
                color="#633c7e"
              >
                Trouble logging in?
              </Heading>
              <Text
                fontSize={"small"}
                fontWeight={"semibold"}
                color={"gray"}
                pb={4}
              >
                Enter your email and we'll send you a code to reset your
                password.
              </Text>

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
                Send Code
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

export default ForgotPasswordForm;
