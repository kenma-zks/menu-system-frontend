export interface IBookingData {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  table_capacity: number | string;
  booking_date: string;
  booking_duration: string;
  note: string;
  status?: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IVerifyEmailData {
  email: string;
}

export interface IResetCode {
  code: string;
}

export interface IResetPasswordData {
  user_id: number;
  password: string;
  confirm_password: string;
}

export interface IRegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

export interface IProductData {
  food_id?: number;
  category_id: number | string;
  food_name: string;
  food_price: number | string;
  food_description: string;
  food_image?: File | string;
  food_available: boolean;
}

export interface ICategoryData {
  id: number;
  category_name: string;
}

export interface tokenState {
  access: string;
  refresh: string;
}

export interface userState {
  id: number;
}

export interface authState {
  authTokens: null | tokenState;
  user: null | userState;
}

export interface CartItem {
  id: number;
  food_name: string;
  food_price: string | number;
  food_image: string | File;
  quantity: number;
  totalAmount: number | string;
}

export interface OrderedItem {
  food_id: number;
  quantity: number;
  food_name: string;
  food_price: number | string;
  food_image: string;
}

export interface IOrderData {
  order_id: number;
  items: OrderedItem[];
  total_price: number | string;
  total_items: number | string;
  payment_method: string;
  order_status: string;
  ordered_date: string;
  ordered_time: string;
}
