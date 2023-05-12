import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ISalesData } from "../../types/types";

const Home = () => {
  const [data, setData] = useState<ISalesData>();

  const [filterOption, setFilterOption] = useState<string>("This year");

  const [salesFilterOptions, setSalesFilterOptions] = useState<string>("Today");

  const fetchSalesData = async (filterOption: string) => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/sales/?filter_option=${filterOption}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setData({
      total_sales: data.total_sales,
      total_orders: data.total_orders,
      today_sales: data.today_sales,
      yesterday_sales: data.yesterday_sales,
      last_7_days_sales: data.last_7_days_sales,
      last_30_days_sales: data.last_30_days_sales,
      last_365_days_sales: data.last_365_days_sales,
      sales_data: data.sales_data,
    });
  };

  useEffect(() => {
    fetchSalesData(filterOption);
  }, [filterOption]);

  return (
    <Box backgroundColor="#F3F2F2" minH="100vh" p="8">
      <HStack w={"100%"} justifyContent={"space-between"} pb={"4"}>
        <Box w={"50%"} backgroundColor="white" p="4" borderRadius={"md"}>
          <HStack justifyContent="space-between">
            <Text fontSize="xl" fontWeight="semibold" pb="4">
              Total Sales
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
                {salesFilterOptions}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setSalesFilterOptions("Today")}>
                  Today
                </MenuItem>
                <MenuItem onClick={() => setSalesFilterOptions("Yesterday")}>
                  Yesterday
                </MenuItem>
                <MenuItem onClick={() => setSalesFilterOptions("Last 7 days")}>
                  Last 7 days
                </MenuItem>
                <MenuItem onClick={() => setSalesFilterOptions("Last 30 days")}>
                  Last 30 days
                </MenuItem>
                <MenuItem
                  onClick={() => setSalesFilterOptions("Last 365 days")}
                >
                  Last 365 days
                </MenuItem>
                <MenuItem onClick={() => setSalesFilterOptions("Total sales")}>
                  All time
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          {salesFilterOptions === "Today" && (
            <Text fontSize="4xl" fontWeight="bold" pb="4">
              Rs. {data?.today_sales}
            </Text>
          )}
          {salesFilterOptions === "Yesterday" && (
            <Text fontSize="4xl" fontWeight="bold" pb="4">
              Rs. {data?.yesterday_sales}
            </Text>
          )}
          {salesFilterOptions === "Last 7 days" && (
            <Text fontSize="4xl" fontWeight="bold" pb="4">
              Rs. {data?.last_7_days_sales}
            </Text>
          )}
          {salesFilterOptions === "Last 30 days" && (
            <Text fontSize="4xl" fontWeight="bold" pb="4">
              Rs. {data?.last_30_days_sales}
            </Text>
          )}
          {salesFilterOptions === "Last 365 days" && (
            <Text fontSize="4xl" fontWeight="bold" pb="4">
              Rs. {data?.last_365_days_sales}
            </Text>
          )}
          {salesFilterOptions === "Total sales" && (
            <Text fontSize="4xl" fontWeight="bold" pb="4">
              Rs. {data?.total_sales}
            </Text>
          )}
          <Text fontSize="sm" fontWeight="bold" color="GRAY">
            Sales this month: {data?.last_7_days_sales}
          </Text>
        </Box>
        <Box w={"50%"} backgroundColor="white" p="4" borderRadius={"md"}>
          <Text fontSize="xl" fontWeight="semibold" pb="4">
            Total Orders
          </Text>
          <Text fontSize="4xl" fontWeight="bold" pb="4">
            {data?.total_orders}
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="GRAY">
            Orders this month: {data?.total_orders}
          </Text>
        </Box>
      </HStack>
      <Box backgroundColor="white" p="4" borderRadius={"md"}>
        <Box backgroundColor="white" p="4" borderRadius="md">
          <HStack justifyContent="space-between" pb="4">
            <Text fontSize="xl" fontWeight="semibold" pb="4">
              Sales Graph
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
                {filterOption}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setFilterOption("This year")}>
                  This year
                </MenuItem>
                <MenuItem onClick={() => setFilterOption("All time")}>
                  All time
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data?.sales_data}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
