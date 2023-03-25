import { Box, Flex, HStack, Image, Text, VStack, Wrap } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchFoodDetails } from "../../api/api";
import { IProductData } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setProducts } from "../../store/productsSlice";
import MenuItemCard from "./MenuItemCard";

interface MenuItemListProps {
  selectedCategoryId: number;
}

const MenuItemList = ({ selectedCategoryId }: MenuItemListProps) => {
  const products = useAppSelector((state) => state.products.products);
  const dispatch = useAppDispatch();

  const fetchFoodDetailsCallback = useCallback(() => {
    fetchFoodDetails<IProductData[]>().then((data) => {
      const transformedData = data.map((item) => {
        return {
          id: item.id,
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
      return products;
    } else {
      return products.filter(
        (product) => product.category_id === selectedCategoryId
      );
    }
  }, [products, selectedCategoryId]);

  return (
    <>
      <Flex flexWrap={"wrap"}>
        {filteredProducts.map((product) => (
          <MenuItemCard key={product.id} product={product} />
        ))}
      </Flex>
    </>
  );
};

export default MenuItemList;
