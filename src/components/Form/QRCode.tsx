import { useState } from "react";
import {
  Button,
  FormControl,
  Text,
  VStack,
  Box,
  Image,
  Input,
  HStack,
} from "@chakra-ui/react";
import QRCode from "qrcode";

const GenQRCode = () => {
  const [qrCodeData, setQRCodeData] = useState("http://localhost:5173/home");
  const [qrCodeImage, setQRCodeImage] = useState("");

  const generateQRCodeHandler = async () => {
    try {
      const dataURL = await QRCode.toDataURL(qrCodeData);
      setQRCodeImage(dataURL);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQRCodeClick = () => {
    const qrCodeWindow = window.open("", "Print", "height=600,width=800");
    qrCodeWindow?.document.write(`<img src="${qrCodeImage}" />`);
    qrCodeWindow?.document.close();
    qrCodeWindow?.focus();
    qrCodeWindow?.print();
    qrCodeWindow?.close();
  };

  return (
    <VStack display="flex" alignItems="center" p="4" w="100%">
      <FormControl mb="4">
        <Text pb="2">Enter URL to generate QR code:</Text>
        <HStack>
          <Input
            type="text"
            value={qrCodeData}
            onChange={(e) => setQRCodeData(e.target.value)}
            w="40%"
            mr={4}
          />
          <Button onClick={generateQRCodeHandler}>Generate</Button>
        </HStack>
      </FormControl>
      {qrCodeImage && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Text mb="2">Generated QR code:</Text>
          <Image src={qrCodeImage} />
          <Button onClick={handleQRCodeClick} mt="2">
            Print
          </Button>
        </Box>
      )}
    </VStack>
  );
};

export default GenQRCode;
