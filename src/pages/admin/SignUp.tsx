import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import SignUpForm from '../../components/Form/SignUpForm'
import { IRegisterData } from '../../types/types'

let errorText = ''

const SignUp = () => {
  const [isError, setIsError] = useState<boolean | null>(null)
  const toast = useToast()

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
      if (response.status === 400) {
        setIsError(true)
        errorText = Object.values<string>(responseData as {})[0][0]
        console.log(errorText)
      }

      setIsError(!response.ok)
    } catch (error) {
      setIsError(true)
      errorText = 'Something went wrong'
    }
  }

  useEffect(() => {
    console.log(isError)
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
