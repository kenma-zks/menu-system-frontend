import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import OrderedItems from "../../components/Card/OrderedItems";
import AdminNavbar from "../../components/UI/AdminNavbar";
import PreparingOrders from "../../components/Card/PreparingOrders";

const AdminOrders = () => {
  return (
    <>
      <Box backgroundColor="#F3F2F2" minH="100vh" p="4">
        <AdminNavbar />
        <VStack alignItems={"flex-start"} p="4">
          <Box pb={3}>
            <Tabs colorScheme="orange" align="start">
              <TabList px="8">
                <Tab>Live Orders</Tab>
                <Tab>Preparing Orders</Tab>
              </TabList>
              <Box>
                <TabPanels>
                  <TabPanel p="4">
                    <OrderedItems />
                  </TabPanel>
                  <TabPanel p="4">
                    <PreparingOrders />
                  </TabPanel>
                </TabPanels>
              </Box>
            </Tabs>
          </Box>
        </VStack>
      </Box>
    </>
  );
};

export default AdminOrders;
