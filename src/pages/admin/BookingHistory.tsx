import { WarningIcon } from "@chakra-ui/icons";
import { Box, HStack, Select, Text, VStack } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchPastBookingDetails } from "../../api/api";
import AdminNavbar from "../../components/UI/BookingAdminNavbar";
import BookingHistoryModal from "../../components/UI/BookingHistoryModal";
import EditBookingModal from "../../components/UI/EditBookingModal";
import { setBookings } from "../../store/bookingSlice";
import { useAppSelector } from "../../store/hooks";
import { IBookingData } from "../../types/types";
import BookingAdminNavbar from "../../components/UI/BookingAdminNavbar";

const BookingHistory = () => {
  const bookings = useAppSelector((state) => state.bookings.bookings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IBookingData | null>(
    null
  );
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.first_name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      booking.last_name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const groupedBookings = filteredBookings.reduce(
    (acc: Record<string, IBookingData[]>, booking) => {
      const bookingDate = new Date(booking.booking_date).toLocaleDateString();
      if (!acc[bookingDate]) {
        acc[bookingDate] = [];
      }
      acc[bookingDate].push(booking);
      return acc;
    },
    {}
  );

  const fetchPastBookingDetailsCallback = useCallback(() => {
    fetchPastBookingDetails<IBookingData[]>().then((data) => {
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
        };
      });
      dispatch(setBookings(transformedData));
    });
  }, [dispatch]);

  useEffect(() => {
    fetchPastBookingDetailsCallback();
  }, [fetchPastBookingDetailsCallback]);

  const openModalHandler = (booking: IBookingData) => {
    setIsModalOpen(true);
    setSelectedBooking(booking);
  };

  return (
    <Box minH="100vh" backgroundColor="#EBEEF2" p="4">
      <BookingAdminNavbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <VStack alignItems={"flex-start"} p="4">
        <Box pb={3}>
          <Text fontWeight="bold" pb="1">
            BOOKINGS
          </Text>
        </Box>

        <Box w="100%">
          {Object.entries(groupedBookings).map(([date, bookings]) => {
            return (
              <React.Fragment key={date}>
                <Box pb="4">
                  <Text fontWeight="medium" fontSize="sm" pb="1" color="gray">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                  {bookings.map((booking) => (
                    <Box
                      key={booking.id}
                      w="60%"
                      p="4"
                      backgroundColor="white"
                      borderRadius="md"
                      mb="2"
                      _hover={{ boxShadow: "md", cursor: "pointer" }}
                      onClick={() => openModalHandler(booking)}
                    >
                      <HStack
                        w="100%"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text fontWeight="medium" fontSize={"sm"} w="40%">
                          {booking.first_name} {booking.last_name}
                        </Text>
                        <Text color="gray" fontSize={"sm"} w="30%">
                          {booking.booking_duration}
                        </Text>
                        <Box
                          backgroundColor={
                            booking.status === "Accepted"
                              ? "green.200"
                              : booking.status === "Rejected"
                              ? "red.200"
                              : "gray.300"
                          }
                          color="white"
                          fontSize={"sm"}
                          w="20%"
                          py="2"
                          borderRadius={"md"}
                          display="flex"
                          justifyContent="center"
                        >
                          <HStack spacing={2}>
                            <WarningIcon />
                            <Text
                              fontWeight="medium"
                              color={
                                booking.status === "Accepted"
                                  ? "green.600"
                                  : booking.status === "Rejected"
                                  ? "red.600"
                                  : "gray.600"
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
                    <BookingHistoryModal
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      booking={selectedBooking}
                    />
                  )}
                </Box>
              </React.Fragment>
            );
          })}
        </Box>
      </VStack>
    </Box>
  );
};

export default BookingHistory;
