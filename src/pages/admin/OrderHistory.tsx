import { Box, Text, VStack } from "@chakra-ui/react";
import React from "react";
import OrderedItems from "../../components/Card/OrderedItems";
import AdminNavbar from "../../components/UI/AdminNavbar";
import OrderedHistoryItems from "../../components/Card/OrderHistory";

const OrderHistory = () => {
  return (
    <>
      <Box backgroundColor="#F3F2F2" minH="100vh" p="4">
        <AdminNavbar />
        <VStack alignItems={"flex-start"} p="4">
          <Box pb={3}>
            <Text fontWeight="bold" pb="3">
              ORDER History
            </Text>
          </Box>
          <Box>
            <OrderedHistoryItems />
          </Box>
        </VStack>
      </Box>
    </>
  );
};

export default OrderHistory;
