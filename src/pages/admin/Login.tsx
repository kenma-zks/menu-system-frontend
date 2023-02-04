import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import login2 from '../../assets/login2.webp'
import logo from '../../assets/logo.png'

import { Link as RouterLink } from 'react-router-dom'
import LoginForm from '../../components/Form/LoginForm'
import { ILoginData } from '../../types/types'

const Login = () => {
  // const toast = useToast()

  const formReceiveHandler = (data: ILoginData) => {
    fetch('http://127.0.0.1:8000/api/accounts/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        // handle the response from the API
      })
      .catch((error) => {
        console.error(error)
        // handle the error
      })
  }

  return <LoginForm onReceiveFormData={formReceiveHandler} />
}

export default Login
