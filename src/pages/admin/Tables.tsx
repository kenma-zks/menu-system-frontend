import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import CreateTableForm from "../../components/Form/CreateTableForm";

const Tables = () => {
  return (
    <Box minH="100vh">
      <Box backgroundColor="#F0F2F4">
        <VStack alignItems={"flex-start"}>
          <Box w={"full"}>
            <Tabs colorScheme="orange" align="start">
              <TabList px="8" pt="8">
                <Tab>Create Tables</Tab>
                <Tab>All Tables</Tab>
              </TabList>
              <Box>
                <TabPanels>
                  <TabPanel bgColor="white">
                    <CreateTableForm />
                  </TabPanel>
                  <TabPanel bgColor={"white"} p="8">
                    All Tables
                  </TabPanel>
                </TabPanels>
              </Box>
            </Tabs>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default Tables;
