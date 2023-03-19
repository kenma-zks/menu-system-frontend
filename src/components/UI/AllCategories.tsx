import {
  AddIcon,
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
} from '@chakra-ui/icons'
import { Box, HStack, Input, Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import useInput from '../../hooks/use-input'
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from '../../store/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { ICategoryData } from '../../types/types'

interface IAllCategoriesProps {
  onReceiveCategoryData: (data: ICategoryData) => void
}

const AllCategories = ({ onReceiveCategoryData }: IAllCategoriesProps) => {
  const [showCreateCategory, setShowCreateCategory] = useState(false)

  const [editing, setEditing] = useState(false)
  const [editedCategoryId, setEditedCategoryId] = useState<number | null>(null)
  const [editedCategoryName, setEditedCategoryName] = useState('')
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.categories.categories)

  const createCategoryHandler = () => {
    setShowCreateCategory(true)
  }

  const closeCategoryHandler = () => {
    setShowCreateCategory(false)
  }

  const editCategoryNameHandler = (id: number, name: string) => {
    fetch(`http://127.0.0.1:8000/api/menu/foodcategory/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category_name: name }),
    })
      .then(() => {
        dispatch(updateCategory({ id, category_name: name }))
      })
      .catch((error) => {
        console.error('Error editing category name:', error)
      })
    toast({
      title: 'Category Name Edited',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    })
  }

  const cancelEditCategoryNameHandler = () => {
    setEditing(false)
    setEditedCategoryId(null)
    setEditedCategoryName('')
  }

  const saveEditCategoryNameHandler = (id: number, category_name: string) => {
    editCategoryNameHandler(id, category_name)
    setEditing(false)
    setEditedCategoryId(null)
    setEditedCategoryName('')
  }

  const deleteCategoryHandler = (id: number) => {
    fetch(`http://127.0.0.1:8000/api/menu/foodcategory/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        dispatch(deleteCategory(id))
        toast({
          title: 'Category Deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
      })
      .catch((error) => {
        console.error('Error deleting category:', error)
      })
    console.log('Delete category with id:', id)
  }

  const {
    value: enteredCategoryName,
    isValid: enteredCategoryNameIsValid,
    valueChangeHandler: categoryChangeHandler,
    inputBlurHandler: categoryBlurHandler,
    reset: resetCategoryInput,
  } = useInput((value) => (value as string).trim() !== '')

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault()

    if (enteredCategoryNameIsValid) {
      const categoryData = {
        category_name: enteredCategoryName,
      }

      fetch('http://127.0.0.1:8000/api/menu/foodcategory/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to add category')
          }
          return response.json()
        })
        .then((data) => {
          const categoryWithId = {
            ...categoryData,
            id: data.id,
          }
          console.log('categoryWithId:', categoryWithId)
          dispatch(addCategory(categoryWithId))
          toast({
            title: 'Category added',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          resetCategoryInput()
          setShowCreateCategory(false)
        })
        .catch((error) => {
          console.error('Error adding category:', error)
          toast({
            title: 'Failed to add category',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        })
    } else {
      toast({
        title: 'Invalid input.',
        description: 'Please enter a valid category name.',
        status: 'error',
        duration: 9000,
        isClosable: true,
        variant: 'left-accent',
      })
    }
  }
  const toast = useToast()

  return (
    <Box p={4}>
      <HStack width="100%" alignItems="flex-start">
        <Box width={'60%'}>
          <Box display={'flex'} pb={'4'} pl="2">
            <Text width={'10%'}>SN</Text>
            <Text width={'70%'}>Name</Text>
            <HStack spacing={16} width={'20%'} alignItems={'center'}>
              <Text>Actions</Text>
              <AddIcon onClick={createCategoryHandler} cursor={'pointer'} />
            </HStack>
          </Box>

          {!editing &&
            categories.map((category, index) => (
              <Box
                key={category.id}
                p="3"
                bg={index % 2 === 0 ? '#f3f3f3' : 'white'}
                borderBottom={
                  index === categories.length - 1
                    ? '2px solid gray'
                    : index % 2 === 0
                    ? '1px solid gray'
                    : ''
                }
              >
                <Box display={'flex'}>
                  <Text width={'10%'}>{index + 1}</Text>
                  {editedCategoryId === category.id ? (
                    <Input
                      width={'70%'}
                      variant="flushed"
                      borderColor={'black'}
                      onChange={(e) => setEditedCategoryName(e.target.value)}
                      value={editedCategoryName}
                    />
                  ) : (
                    <Text width={'70%'}>{category.category_name}</Text>
                  )}
                  <HStack width={'20%'} spacing={'6'} alignItems={'center'}>
                    {editedCategoryId === category.id ? (
                      <>
                        <CheckIcon
                          onClick={() =>
                            saveEditCategoryNameHandler(
                              category.id,
                              editedCategoryName,
                            )
                          }
                          cursor="pointer"
                        />
                        <CloseIcon
                          onClick={cancelEditCategoryNameHandler}
                          cursor="pointer"
                        />
                      </>
                    ) : (
                      <>
                        <EditIcon
                          onClick={() => setEditedCategoryId(category.id)}
                          cursor="pointer"
                        />
                        <DeleteIcon
                          onClick={() => deleteCategoryHandler(category.id)}
                          cursor="pointer"
                        />
                      </>
                    )}
                  </HStack>
                </Box>
              </Box>
            ))}

          {showCreateCategory && (
            <Box bg={'white'} pt="2">
              <Box display={'flex'}>
                <Input
                  p={3}
                  pl={20}
                  placeholder="Category Name"
                  borderColor={'black'}
                  variant="flushed"
                  width={'79%'}
                  value={enteredCategoryName}
                  onChange={categoryChangeHandler}
                  onBlur={categoryBlurHandler}
                />
                <HStack spacing={'6'}>
                  <CheckIcon onClick={submitHandler} cursor="pointer" />
                  <CloseIcon
                    cursor={'pointer'}
                    onClick={closeCategoryHandler}
                  />
                </HStack>
              </Box>
            </Box>
          )}
        </Box>
      </HStack>
    </Box>
  )
}

export default AllCategories
