import {
  AddIcon,
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
} from '@chakra-ui/icons'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchCategories } from '../../api/api'
import useInput from '../../hooks/use-input'
import { ICategoryData } from '../../types/types'

interface IAllCategoriesProps {
  onReceiveCategoryData: (data: ICategoryData) => void
}

const AllCategories = ({ onReceiveCategoryData }: IAllCategoriesProps) => {
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [categories, setCategories] = useState<ICategoryData[]>([])
  const [editing, setEditing] = useState(false)
  const [editedCategoryId, setEditedCategoryId] = useState<number | null>(null)
  const [editedCategoryName, setEditedCategoryName] = useState('')

  const fetchCategoriesCallback = useCallback(() => {
    fetchCategories<ICategoryData[]>().then((data) => {
      const transformedData = data.map((item) => {
        return {
          id: item.id,
          category_name: item.category_name,
        }
      })
      setCategories(transformedData)
    })
  }, [])

  useEffect(() => {
    fetchCategoriesCallback()
  }, [fetchCategoriesCallback])

  const createCategoryHandler = () => {
    setShowCreateCategory(true)
  }

  const closeCategoryHandler = () => {
    setShowCreateCategory(false)
  }

  const deleteCategoryHandler = (id: number) => {
    fetch(`http://127.0.0.1:8000/api/menu/foodcategory/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedCategories = categories.filter(
          (category) => category.id !== id,
        )
        setCategories(updatedCategories)
      })
      .catch((error) => {
        console.error('Error deleting category:', error)
      })
    toast({
      title: 'Category Deleted',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    })
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
        const updatedCategories = categories.map((category) => {
          if (category.id === id) {
            category.category_name = name
          }
          return category
        })
        setCategories(updatedCategories)
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

  const {
    value: enteredCategoryName,
    isValid: enteredCategoryNameIsValid,
    valueChangeHandler: categoryChangeHandler,
    inputBlurHandler: categoryBlurHandler,
    reset: resetCategoryInput,
  } = useInput((value) => (value as string).trim() !== '')

  const maxId = categories.reduce((max, item) => {
    if (item.id > max) {
      max = item.id
    }
    return max
  }, 0)

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault()

    if (enteredCategoryNameIsValid) {
      const categoryData = {
        id: maxId + 1,
        category_name: enteredCategoryName,
      }

      // Send a POST request to the server to add the new category
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
          // Add the new category to the categories state
          setCategories((prevCategories) => [...prevCategories, categoryData])
          // Show a success toast notification
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
          // Show an error toast notification
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
