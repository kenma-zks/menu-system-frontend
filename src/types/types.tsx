export interface IBookingData {
  id?: number
  first_name: string
  last_name: string
  email: string
  phone_number: string
  table_capacity: number | string
  booking_date: string
  booking_duration: string
  note: string
  status?: string
}

export interface ILoginData {
  email: string
  password: string
}

export interface IRegisterData {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  password: string
  confirm_password: string
}

export interface IProductData {
  id?: number
  category_id: number | string
  food_name: string
  food_price: number | string
  food_description: string
  food_image?: File | string
  food_available: boolean
}

export interface ICategoryData {
  id: number
  category_name: string
}

export interface tokenState {
  access: string
  refresh: string
}

export interface userState {
  id: number
}

export interface authState {
  authTokens: null | tokenState
  user: null | userState
}
