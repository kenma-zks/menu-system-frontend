import React, { Fragment, useState } from "react";
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
} from "@chakra-ui/react";

import login2 from "../../assets/login2.webp";
import logo from "../../assets/logo.png";
import { Link as RouterLink } from "react-router-dom";
import useInput from "../../hooks/use-input";
import { useVerifyCodeMutation } from "../../store/authApiSlice";
import { IResetCode } from "../../types/types";

interface IVerifyCodeFormProps {
  onReceiveFormData: (data: IResetCode) => void;
}

const VerifyCodeForm = ({ onReceiveFormData }: IVerifyCodeFormProps) => {
  const toast = useToast();
  const {
    value: enteredCode,
    isValid: enteredCodeIsValid,
    hasError: enteredCodeHasError,
    valueChangeHandler: codeChangeHandler,
    inputBlurHandler: codeBlurHandler,
  } = useInput((value) => (value as string).trim() !== "");

  const submitHandler = (
    e: React.FormEvent<HTMLDivElement | HTMLFormElement>
  ) => {
    e.preventDefault();
    if (enteredCodeIsValid) {
      onReceiveFormData({ code: enteredCode });
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
          <Flex flex={1.25}>
            <Image alt={"Login Image"} objectFit={"cover"} src={login2} />
          </Flex>
          <Flex flex={1} w="full">
            <Stack spacing={4} w={"full"} pl={"60px"} pt={10} pr={40}>
              <Image alt={"logo"} src={logo} h={75} w={75} />

              <Heading
                pt={20}
                fontSize={"3xl"}
                fontWeight={"semibold"}
                pb={4}
                color="#633c7e"
              >
                Verify Code
              </Heading>
              <Text
                fontSize={"small"}
                fontWeight={"semibold"}
                color={"gray"}
                pb={4}
              >
                Please enter the code sent to your email address
              </Text>

              <FormControl id="Code" isRequired isInvalid={enteredCodeHasError}>
                <FormLabel fontSize={"small"} color="#633c7e">
                  Code
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Enter code"
                  value={enteredCode}
                  onChange={codeChangeHandler}
                  onBlur={codeBlurHandler}
                  autoComplete="off"
                />
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
                Submit
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

export default VerifyCodeForm;
