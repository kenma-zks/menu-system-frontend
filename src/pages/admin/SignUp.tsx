import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import SignUpForm from '../../components/Form/SignUpForm'
import { IRegisterData } from '../../types/types'
import React from 'react'
import { useRegisterUserMutation } from '../../store/authApiSlice'

let errorText = ''

const SignUp = () => {
  const [isError, setIsError] = useState<boolean | null>(null)
  const toast = useToast()
  const navigate = useNavigate()

  const [verifyRegister] = useRegisterUserMutation()

  async function formReceiveHandler(data: IRegisterData) {
    verifyRegister({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone_number: data.phone_number,
      password: data.password,
      confirm_password: data.confirm_password,
    })
      .unwrap()
      .then(() => navigate('/admin/login', { state: { isRegistered: true } }))
      .catch((err: Error) => {
        setIsError(true)
      })
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
