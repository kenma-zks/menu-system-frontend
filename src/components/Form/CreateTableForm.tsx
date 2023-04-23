import React, { useState } from "react";
import useInput from "../../hooks/use-input";
import { Button, FormControl, Input, Text, VStack } from "@chakra-ui/react";
import QRCode from "qrcode.react";

const CreateTableForm = () => {
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [qrCodeValue, setQrCodeValue] = useState<string>("");

  const {
    value: enteredTableNumber,
    isValid: enteredTableNumberIsValid,
    hasError: enteredTableNumberHasError,
    valueChangeHandler: tableNumberChangeHandler,
    inputBlurHandler: tableNumberBlurHandler,
    reset: resetTableNumberInput,
  } = useInput((value) => (value as string).trim() !== "");

  const generateQRCodeHandler = () => {
    if (enteredTableNumberIsValid) {
      setTableNumber(Number(enteredTableNumber));
      setQrCodeValue(`Table ${enteredTableNumber}`);
    }
  };

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    if (enteredTableNumberIsValid && tableNumber !== null) {
      console.log("Table number: ", tableNumber);
      console.log("QR Code value: ", qrCodeValue);

      try {
        const response = await fetch("http://127.0.0.1:8000/api/table/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            table_number: tableNumber,
            qr_code: qrCodeValue,
          }),
        });
        const data = await response.json();
        console.log("Response data: ", data);
      } catch (error) {
        console.error(error);
      }

      resetTableNumberInput();
      setTableNumber(null);
      setQrCodeValue("");
    }
  };

  return (
    <VStack display={"flex"} alignItems={"start"} p="4" w="100%">
      <VStack
        as="form"
        spacing="4"
        onSubmit={submitHandler}
        encType="multipart/form-data"
      >
        <FormControl isInvalid={enteredTableNumberHasError}>
          <Text pb="2">Table number</Text>
          <Input
            type="number"
            placeholder="Table number"
            onChange={tableNumberChangeHandler}
            onBlur={tableNumberBlurHandler}
            value={enteredTableNumber}
          ></Input>
        </FormControl>

        <FormControl>
          <Text pb="2">QR Code</Text>
          <Button onClick={generateQRCodeHandler}>Generate QR Code</Button>
          {qrCodeValue && <QRCode value={qrCodeValue} />}
        </FormControl>

        <FormControl>
          <Button type="submit" colorScheme="orange" size="md" w="full">
            Create
          </Button>
        </FormControl>
      </VStack>
    </VStack>
  );
};

export default CreateTableForm;
