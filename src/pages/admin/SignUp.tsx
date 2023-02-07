import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import SignUpForm from '../../components/Form/SignUpForm'
import { IRegisterData } from '../../types/types'
import React from 'react'
import { useRegisterUserMutation } from '../../store/authApiSlice'

type HttpError = {
  statusCode: 400
}

type FetchError = {
  message: string
}

type IError = HttpError | FetchError

let errorText = ''

const SignUp = () => {
  const [isError, setIsError] = useState<boolean | null>(null)
  const toast = useToast()
  const navigate = useNavigate()

  const [verifyRegister] = useRegisterUserMutation

  async function formReceiveHandler(data: IRegisterData) {
    try {
      const response = await fetch(
        'http://localhost:8000/api/accounts/register/',
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      const responseData = await response.json()
      console.log(responseData)
      if (!response.ok || response.status === 400) {
        if (response.status === 400) {
          errorText = Object.values<string>(responseData as {})[0][0]
        } else {
          errorText = 'Something went wrong'
        }
        throw new Error(errorText)
      }
      navigate('/admin/login', { state: { isRegistered: true } })
    } catch (error) {
      setIsError(true)
    }
  }

  useEffect(() => {
    if (isError !== null) {
      if (isError) {
        toast({
          title: errorText,
          status: 'error',
          isClosable: true,
          variant: 'left-accent',
          duration: 3000,
        })
      } else {
        toast({
          title: `Successfully registered`,
          status: 'success',
          isClosable: true,
          variant: 'left-accent',
          duration: 3000,
        })
      }
    }
    setTimeout(() => {
      setIsError(null)
    }, 3000)
  }, [isError, toast])

  return (
    <>
      <SignUpForm onReceiveFormData={formReceiveHandler} />
    </>
  )
}

export default SignUp
