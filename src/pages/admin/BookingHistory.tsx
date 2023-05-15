import { ChevronDownIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Select,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchPastBookingDetails } from "../../api/api";
import BookingHistoryModal from "../../components/UI/BookingHistoryModal";
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
  const [bookingFilterOptions, setBookingFilterOptions] =
    useState<string>("All time");

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
    fetchPastBookingDetailsCallback();
  }, [fetchPastBookingDetailsCallback]);

  const openModalHandler = (booking: IBookingData) => {
    setIsModalOpen(true);
    setSelectedBooking(booking);
  };

  const filteredBookingDate = bookings.filter((booking) => {
    if (!booking.booking_date) {
      return false; // Skip this order if ordered_date is undefined
    }

    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);
    const last7days = new Date(today);
    last7days.setDate(last7days.getDate() - 7);
    const last30days = new Date(today);
    last30days.setDate(last30days.getDate() - 30);

    const bookingDate = new Date(booking.booking_date);
    if (bookingFilterOptions === "Today") {
      return bookingDate.getDate() === today.getDate();
    } else if (bookingFilterOptions === "Yesterday") {
      return bookingDate.getDate() === yesterday.getDate();
    } else if (bookingFilterOptions === "Last 7 days") {
      return bookingDate >= last7days;
    } else if (bookingFilterOptions === "Last 30 days") {
      return bookingDate >= last30days;
    } else if (bookingFilterOptions === "All time") {
      return true;
    }
  });

  return (
    <Box minH="100vh" backgroundColor="#EBEEF2" p="4">
      <BookingAdminNavbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <VStack alignItems={"flex-start"} p="4">
        <HStack justifyContent={"space-between"} w={"100%"} pb={3}>
          <Text fontWeight="bold" pb="1">
            BOOKINGS
          </Text>
          <Menu size="sm" matchWidth>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              width="30%"
              backgroundColor="white"
              border="1px"
              borderColor="gray.400"
              borderRadius="md"
              _hover={{ bg: "white" }}
              _expanded={{ bg: "white" }}
              _focus={{ bg: "white" }}
              borderRightRadius="0"
              iconSpacing="2"
              fontSize="sm"
              color="gray.600"
              paddingLeft="2"
              paddingRight="2"
            >
              {bookingFilterOptions}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setBookingFilterOptions("Today")}>
                Today
              </MenuItem>
              <MenuItem onClick={() => setBookingFilterOptions("Yesterday")}>
                Yesterday
              </MenuItem>
              <MenuItem onClick={() => setBookingFilterOptions("Last 7 days")}>
                Last 7 days
              </MenuItem>
              <MenuItem onClick={() => setBookingFilterOptions("Last 30 days")}>
                Last 30 days
              </MenuItem>
              <MenuItem onClick={() => setBookingFilterOptions("All time")}>
                All time
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        <Box w="100%">
          {Object.entries(groupedBookings).map(([date]) => {
            return (
              <React.Fragment key={date}>
                {filteredBookingDate.map((booking) => (
                  <Box pb="4" key={booking.id}>
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
                          w={{ base: "30%", md: "40%" }}
                        >
                          {booking.first_name} {booking.last_name}
                        </Text>
                        <Text
                          color="gray"
                          fontSize={{ base: "sm", md: "md" }}
                          w={{ base: "20%", md: "30%" }}
                        >
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
                    {selectedBooking && (
                      <BookingHistoryModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        booking={selectedBooking}
                      />
                    )}
                  </Box>
                ))}
              </React.Fragment>
            );
          })}
        </Box>
      </VStack>
    </Box>
  );
};

export default BookingHistory;
