import { Box, Flex } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { fetchCategories } from "../../api/api";
import { ICategoryData } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCategories } from "../../store/categoriesSlice";
import CategoryMenuCard from "./CategoryMenuCard";

const CategoryItemList = ({
  setSelectedCategoryItem,
}: {
  setSelectedCategoryItem: (item: ICategoryData) => void;
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const categories = useAppSelector((state) => state.categories.categories);
  const dispatch = useAppDispatch();

  const fetchCategoryDetailsCallback = useCallback(() => {
    fetchCategories<ICategoryData[]>().then((data) => {
      const transformedData = data.map((item) => {
        return {
          id: item.id,
          category_name: item.category_name,
        };
      });
      dispatch(setCategories(transformedData));
    });
  }, []);

  useEffect(() => {
    fetchCategoryDetailsCallback();
  }, [fetchCategoryDetailsCallback]);

  const handleCategoryClick = (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setSelectedCategoryId(category.id);
      setSelectedCategoryItem(category);
    }
  };

  return (
    <>
      <Flex flexWrap={"wrap"}>
        <CategoryMenuCard
          category={{ id: 0, category_name: "All" }}
          handleCategoryClick={() => {
            setSelectedCategoryId(0);
            setSelectedCategoryItem({ id: 0, category_name: "All" });
          }}
          isActive={selectedCategoryId === 0}
        />
        {categories.map((category) => (
          <CategoryMenuCard
            key={category.id}
            category={category}
            handleCategoryClick={handleCategoryClick}
            isActive={selectedCategoryId === category.id}
          />
        ))}
      </Flex>
    </>
  );
};

export default CategoryItemList;
