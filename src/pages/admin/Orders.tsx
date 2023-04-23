import { Box, Text, VStack } from "@chakra-ui/react";
import React from "react";
import OrderedItems from "../../components/Card/OrderedItems";
import AdminNavbar from "../../components/UI/AdminNavbar";

const AdminOrders = () => {
  return (
    <>
      <Box backgroundColor="#F3F2F2" minH="100vh" p="4">
        <AdminNavbar />
        <VStack alignItems={"flex-start"} p="4">
          <Box pb={3}>
            <Text fontWeight="bold" pb="3">
              ORDER LIST
            </Text>
          </Box>
          <Box>
            <OrderedItems />
          </Box>
        </VStack>
      </Box>
    </>
  );
};

export default AdminOrders;
