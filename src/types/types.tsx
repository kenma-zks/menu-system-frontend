export interface Booking {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  table_capacity: string
  booking_start: string
  booking_duration: string
  note: string
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
  food_name: string
  food_price: number | string
  category_id: number | string
  food_description: string
  food_image: File | null
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
