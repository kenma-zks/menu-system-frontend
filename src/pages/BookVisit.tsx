import { useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { IBookingData } from '../types/types'
import BookVisitForm from './BookVisitForm'

let errorText = ''

const BookVisit = () => {
  const [isError, setIsError] = useState<boolean | null>(null)
  const toast = useToast()

  async function addBookingHandler(booking: IBookingData) {
    try {
      const response = await fetch(
        'http://localhost:8000/api/booking/register/',
        {
          method: 'POST',
          body: JSON.stringify(booking),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      const data = await response.json()
      console.log(data)
      if (response.status === 400) {
        setIsError(true)
        errorText = Object.values<string>(data as {})[0][0]
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
          title: `Booking successfull`,
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
      <BookVisitForm onAddBooking={addBookingHandler} />
    </>
  )
}

export default BookVisit
