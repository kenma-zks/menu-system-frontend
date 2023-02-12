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