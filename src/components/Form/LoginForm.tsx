import {
  Box,
  Button,
  Checkbox,
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
} from '@chakra-ui/react'
import React, { Fragment, useState } from 'react'
import { ILoginData } from '../../types/types'
import login2 from '../../assets/login2.webp'
import logo from '../../assets/logo.png'
import { Link as RouterLink } from 'react-router-dom'
import useInput from '../../hooks/use-input'

interface ILoginFormProps {
  onReceiveFormData: (data: ILoginData) => void
}

const LoginForm = ({ onReceiveFormData }: ILoginFormProps) => {
  const toast = useToast()

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: enteredEmailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput((value) => (value as string).includes('@'))

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: enteredPasswordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput((value) => (value as string).trim().length >= 8)

  const validate = enteredEmailIsValid && enteredPasswordIsValid

  const submitHandler = (
    e: React.FormEvent<HTMLDivElement | HTMLFormElement>,
  ) => {
    e.preventDefault()
    if (validate) {
      onReceiveFormData({ email: enteredEmail, password: enteredPassword })
    } else {
      toast({
        title: 'Login failed.',
        description: 'Please check your credentials.',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top',
      })
    }
  }

  return (
    <Fragment>
      <Box as="form" onSubmit={submitHandler}>
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
          <Flex flex={1.25}>
            <Image alt={'Login Image'} objectFit={'cover'} src={login2} />
          </Flex>
          <Flex flex={1} w="full">
            <Stack spacing={4} w={'full'} pl={'60px'} pt={10} pr={40}>
              <Image alt={'logo'} src={logo} h={75} w={75} />

              <Heading
                pt={20}
                fontSize={'3xl'}
                fontWeight={'semibold'}
                pb={4}
                color="#633c7e"
              >
                Login
              </Heading>
              <Text
                fontSize={'small'}
                fontWeight={'semibold'}
                color={'gray'}
                pb={4}
              >
                Login to your account
              </Text>

              <FormControl
                id="email"
                isRequired
                isInvalid={enteredEmailHasError}
              >
                <FormLabel fontSize={'small'} color="#633c7e">
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
              </FormControl>
              <FormControl
                id="password"
                isRequired
                isInvalid={enteredPasswordHasError}
              >
                <FormLabel fontSize={'small'} color="#633c7e">
                  Password
                </FormLabel>
                <Input
                  type="password"
                  placeholder="Password"
                  value={enteredPassword}
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                  autoComplete="off"
                />
              </FormControl>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
                pb={4}
              >
                <Checkbox>
                  <Text fontSize={'small'} color={'gray'}>
                    Remember me
                  </Text>
                </Checkbox>
                <Link color={'#03a6d4'} fontSize={'small'}>
                  Forgot password?
                </Link>
              </Stack>

              <Button
                bg={'#144ec7'}
                color={'white'}
                _hover={{
                  backgroundColor: '#1B1091',
                }}
                _active={{
                  backgroundColor: '#1B1091',
                }}
                type="submit"
              >
                Sign in
              </Button>
              <Stack pt={3}>
                <Text
                  fontSize={'small'}
                  fontWeight={'semibold'}
                  color={'gray'}
                  align="center"
                >
                  Don't have an account?
                  <Link color={'#03a6d4'} as={RouterLink} to="/admin/signup">
                    Sign Up
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Flex>
        </Stack>
      </Box>
    </Fragment>
  )
}

export default LoginForm
