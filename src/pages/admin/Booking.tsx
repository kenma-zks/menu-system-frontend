import { WarningIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, Select, Text, VStack } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { fetchBookingDetails } from "../../api/api";
import EditBookingModal from "../../components/UI/EditBookingModal";
import { setBookings } from "../../store/bookingSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { IBookingData } from "../../types/types";
import BookingAdminNavbar from "../../components/UI/BookingAdminNavbar";

const Booking = () => {
  const bookings = useAppSelector((state) => state.bookings.bookings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IBookingData | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const dispatch = useAppDispatch();
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

      if (
        selectedStatus === "All" ||
        booking.status?.toLowerCase() === selectedStatus.toLowerCase()
      ) {
        acc[bookingDate].push(booking);
      }

      return acc;
    },
    {}
  );

  const fetchBookingDetailsCallback = useCallback(() => {
    fetchBookingDetails<IBookingData[]>().then((data) => {
      const transformedData = data.map((item) => {
        return {
          id: item.id,
          first_name: item.first_name,
          last_name: item.last_name,
          booking_date: item.booking_date,
          booking_time: item.booking_time,
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
    fetchBookingDetailsCallback();
  }, [fetchBookingDetailsCallback]);

  const openModalHandler = (booking: IBookingData) => {
    setIsModalOpen(true);
    setSelectedBooking(booking);
  };

  const statusFilter = "All";

  return (
    <Box minH="100vh" backgroundColor="#EBEEF2" p="4">
      <BookingAdminNavbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <VStack alignItems={"flex-start"} p={{ base: "2", md: "4" }}>
        <Box pb={{ base: "2", md: "3" }}>
          <Text fontWeight="bold" pb={{ base: "1", md: "2" }}>
            BOOKINGS
          </Text>
        </Box>
        <Box w={{ base: "40%", md: "30%" }} pb={{ base: "2", md: "0" }}>
          <Text
            color="gray"
            fontSize={{ base: "sm", md: "md" }}
            pb={{ base: "2", md: "3" }}
          >
            Filter by Status
          </Text>
          <Select
            fontSize={{ base: "sm", md: "md" }}
            backgroundColor={"white"}
            borderRadius="md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </Select>
        </Box>

        <Box w="100%">
          {Object.entries(groupedBookings).map(([date, bookings]) => {
            const filteredBookings =
              statusFilter === "All"
                ? bookings
                : bookings.filter((booking) => booking.status === statusFilter);
            if (!filteredBookings.length) return null;

            return (
              <React.Fragment key={date}>
                <Box pb="4">
                  <Text
                    fontWeight="medium"
                    fontSize={{ base: "sm", md: "md" }}
                    pb="1"
                    color="gray"
                  >
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                  {filteredBookings.length === 0 ? (
                    <Text fontSize="sm">No bookings</Text>
                  ) : (
                    filteredBookings.map((booking) => (
                      <Box
                        key={booking.id}
                        w={{ base: "100%", md: "100%", lg: "70%" }}
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
                          <Text
                            fontWeight="medium"
                            fontSize={{ base: "sm", md: "md" }}
                            w={{ base: "20%", md: "30%" }}
                          >
                            {booking.first_name} {booking.last_name}
                          </Text>
                          <Text color="gray" fontSize={"sm"} w="30%">
                            {booking.booking_time}
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
                            w={{ base: "40%", md: "40%", lg: "30%" }}
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
                    ))
                  )}
                  {selectedBooking && (
                    <EditBookingModal
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

export default Booking;
