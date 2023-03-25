import { useState } from 'react'

const useDefaultInput = (
  validateValue: (value: string | number | File) => boolean,
  defaultValue: string = '',
) => {
  const [enteredValue, setEnteredValue] = useState(defaultValue)
  const [isTouched, setIsTouched] = useState(false)

  const valueIsValid = validateValue(enteredValue)
  const hasError = !valueIsValid && isTouched

  const valueChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>,
  ) => {
    setEnteredValue(event.target.value)
  }

  const inputBlurHandler = () => {
    setIsTouched(true)
  }

  const reset = () => {
    setEnteredValue(defaultValue)
    setIsTouched(false)
  }

  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  }
}

export default useDefaultInput
