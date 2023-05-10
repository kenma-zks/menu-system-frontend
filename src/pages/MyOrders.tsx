import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import MyOrdersList from "../components/Card/MyOrdersList";

const MyOrders = () => {
  return (
    <>
      <Box backgroundColor="#F3F2F2" minH="100vh" p="4">
        <VStack alignItems={"flex-start"} p="4">
          <Box pb={3}>
            <Text fontSize="2xl" fontWeight="bold" pb={4}>
              My Orders
            </Text>
            <MyOrdersList />
          </Box>
        </VStack>
      </Box>
    </>
  );
};

export default MyOrders;
