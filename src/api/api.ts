export const fetchCategories = async <tdata>(): Promise<tdata> => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/menu/foodcategory/')
    if (!response.ok) {
      throw new Error('Something went wrong')
    }
    return await response.json()
  } catch (error) {
    throw error
  }
}

export const fetchFoodDetails = async <tdata>(): Promise<tdata> => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/menu/fooddetails/')
    if (!response.ok) {
      throw new Error('Something went wrong')
    }
    return await response.json()
  } catch (error) {
    throw error
  }
}
