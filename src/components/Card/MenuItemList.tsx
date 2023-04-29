import { Box, Flex, HStack, Image, Text, VStack, Wrap } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchFoodDetails } from "../../api/api";
import { IProductData } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setProducts } from "../../store/productsSlice";
import MenuItemCard from "./MenuItemCard";

interface MenuItemListProps {
  selectedCategoryId: number;
  searchQuery: string;
}

const MenuItemList = ({
  selectedCategoryId,
  searchQuery,
}: MenuItemListProps) => {
  const products = useAppSelector((state) => state.products.products);
  const dispatch = useAppDispatch();

  const fetchFoodDetailsCallback = useCallback(() => {
    fetchFoodDetails<IProductData[]>().then((data) => {
      const transformedData = data.map((item) => {
        return {
          food_id: item.food_id,
          food_name: item.food_name,
          food_price: item.food_price,
          category_id: item.category_id,
          food_image: item.food_image,
          food_available: item.food_available,
          food_description: item.food_description,
        };
      });
      dispatch(setProducts(transformedData));
    });
  }, []);

  useEffect(() => {
    fetchFoodDetailsCallback();
  }, [fetchFoodDetailsCallback]);

  useEffect(() => {
    const urls = products.map((product) => {
      if (product.food_image instanceof File) {
        return URL.createObjectURL(product.food_image);
      }
      return "";
    });
    return () => {
      urls.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === null || selectedCategoryId === 0) {
      return products.filter((product) =>
        product.food_name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    } else {
      return products.filter(
        (product) =>
          product.category_id === selectedCategoryId &&
          product.food_name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }
  }, [products, selectedCategoryId, searchQuery]);

  if (filteredProducts.length === 0) {
    return (
      <Flex width="100%" justifyContent="center" alignItems="center">
        <Text fontSize="sm" fontWeight="semibold" color={"gray"}>
          No items found
        </Text>
        <span role="img" aria-label="sad face" style={{ fontSize: "1rem" }}>
          😞
        </span>
      </Flex>
    );
  }
  return (
    <>
      <Flex justifyContent="flex-start" flexWrap="wrap">
        {filteredProducts.map((product) => (
          <MenuItemCard key={product.food_id} product={product} />
        ))}
      </Flex>
    </>
  );
};

export default MenuItemList;
