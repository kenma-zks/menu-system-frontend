export const fetchCategories = async <tdata>(): Promise<tdata> => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/menu/foodcategory/"
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchFoodDetails = async <tdata>(): Promise<tdata> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/menu/fooddetails/");
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchBookingDetails = async <tdata>(): Promise<tdata> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/booking/list/");
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchPastBookingDetails = async <tdata>(): Promise<tdata> => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/booking/list/past/"
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchOrderDetails = async <tdata>(): Promise<tdata> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/order/");
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchOrdersByIds = (orderId: number[]): Promise<any[]> => {
  const promises = orderId.map((id) => {
    return fetch(`http://127.0.0.1:8000/api/order/${id}`).then((response) => {
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      return response.json();
    });
  });
  return Promise.all(promises);
};

export const fetchOrderedItemsDetails = async <tdata>(): Promise<tdata> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/ordereditem/");
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
