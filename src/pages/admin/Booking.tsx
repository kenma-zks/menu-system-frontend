import { WarningIcon } from '@chakra-ui/icons'
import { Box, HStack, Select, Text, VStack } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchBookingDetails } from '../../api/api'
import AdminNavbar from '../../components/UI/AdminNavbar'
import EditBookingModal from '../../components/UI/EditBookingModal'
import { setBookings } from '../../store/bookingSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { IBookingData } from '../../types/types'

const Booking = () => {
  const bookings = useAppSelector((state) => state.bookings.bookings)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<IBookingData | null>(
    null,
  )
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const dispatch = useAppDispatch()

  const groupedBookings = bookings.reduce(
    (acc: Record<string, IBookingData[]>, booking) => {
      const bookingDate = new Date(booking.booking_date).toLocaleDateString()
      if (!acc[bookingDate]) {
        acc[bookingDate] = []
      }

      if (
        selectedStatus === 'All' ||
        booking.status?.toLowerCase() === selectedStatus.toLowerCase()
      ) {
        acc[bookingDate].push(booking)
      }

      return acc
    },
    {},
  )

  const fetchBookingDetailsCallback = useCallback(() => {
    fetchBookingDetails<IBookingData[]>().then((data) => {
      const transformedData = data.map((item) => {
        return {
          id: item.id,
          first_name: item.first_name,
          last_name: item.last_name,
          booking_date: item.booking_date,
          booking_duration: item.booking_duration,
          table_capacity: item.table_capacity,
          phone_number: item.phone_number,
          email: item.email,
          note: item.note,
          status: item.status,
        }
      })
      dispatch(setBookings(transformedData))
    })
  }, [dispatch])

  useEffect(() => {
    fetchBookingDetailsCallback()
  }, [fetchBookingDetailsCallback])

  const openModalHandler = (booking: IBookingData) => {
    setIsModalOpen(true)
    setSelectedBooking(booking)
  }

  const statusFilter = 'All'

  return (
    <Box minH="100vh" backgroundColor="#EBEEF2" p="4">
      <AdminNavbar />
      <VStack alignItems={'flex-start'} p="4">
        <Box pb={3}>
          <Text fontWeight="bold" pb="1">
            BOOKINGS
          </Text>
        </Box>
        <Box w="15%" pb="2">
          <Text color="gray" fontSize={'sm'} pb="2">
            Filter by Status
          </Text>
          <Select
            fontSize="sm"
            backgroundColor={'white'}
            borderRadius="md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
          </Select>
        </Box>

        <Box w="100%">
          {Object.entries(groupedBookings).map(([date, bookings]) => {
            const filteredBookings =
              statusFilter === 'All'
                ? bookings
                : bookings.filter((booking) => booking.status === statusFilter)
            if (!filteredBookings.length) return null

            return (
              <React.Fragment key={date}>
                <Box pb="4">
                  <Text fontWeight="medium" fontSize="sm" pb="1" color="gray">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  {filteredBookings.map((booking) => (
                    <Box
                      key={booking.id}
                      w="60%"
                      p="4"
                      backgroundColor="white"
                      borderRadius="md"
                      mb="2"
                      _hover={{ boxShadow: 'md', cursor: 'pointer' }}
                      onClick={() => openModalHandler(booking)}
                    >
                      <HStack
                        w="100%"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text fontWeight="medium" fontSize={'sm'} w="40%">
                          {booking.first_name} {booking.last_name}
                        </Text>
                        <Text color="gray" fontSize={'sm'} w="30%">
                          {booking.booking_duration}
                        </Text>
                        <Box
                          backgroundColor={
                            booking.status === 'Accepted'
                              ? 'green.200'
                              : booking.status === 'Rejected'
                              ? 'red.200'
                              : 'gray.300'
                          }
                          color="white"
                          fontSize={'sm'}
                          w="20%"
                          py="2"
                          borderRadius={'md'}
                          display="flex"
                          justifyContent="center"
                        >
                          <HStack spacing={2}>
                            <WarningIcon />
                            <Text
                              fontWeight="medium"
                              color={
                                booking.status === 'Accepted'
                                  ? 'green.600'
                                  : booking.status === 'Rejected'
                                  ? 'red.600'
                                  : 'gray.600'
                              }
                              textAlign="center"
                            >
                              {booking.status}
                            </Text>
                          </HStack>
                        </Box>
                      </HStack>
                    </Box>
                  ))}
                  {selectedBooking && (
                    <EditBookingModal
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      booking={selectedBooking}
                    />
                  )}
                </Box>
              </React.Fragment>
            )
          })}
        </Box>
      </VStack>
    </Box>
  )
}

export default Booking
