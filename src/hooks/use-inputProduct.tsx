import { useState } from "react";

const useInputProduct = (
  validateValue: (value: string | number | File, allowEmpty: boolean) => boolean
) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(enteredValue, !isTouched);
  const hasError = !valueIsValid && isTouched;

  const valueChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>
  ) => {
    setEnteredValue(event.target.value);
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInputProduct;
