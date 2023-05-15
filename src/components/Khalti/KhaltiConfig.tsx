import { set } from "react-hook-form";
import myKey from "./KhaltiKey";
import { setPaymentSuccess } from "../../store/paymentSlice";
import { useToast } from "@chakra-ui/react";
import Cookies from "js-cookie";

const KhaltiConfig = (dispatch?: any, toast?: any) => {
  return {
    // ...other config properties
    publicKey: myKey.publicTextKey,
    productIdentity: "123456789",
    productName: "Mero Menu",
    productUrl: "http://localhost:5173/",
    eventHandler: {
      onSuccess(payload: any) {
        // hit merchant api for initiating verfication
        console.log("Payment Sucessful!");
        console.log(payload);
        let data = {
          token: payload.token,
          amount: payload.amount,
        };
        console.log(data);

        fetch(`http://127.0.0.1:8000/api/order/verifypayment/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            dispatch(setPaymentSuccess());
            toast({
              title: "Payment Successful!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            Cookies.set("paymentSuccess", "true", { expires: 1 });
          })
          .catch((error) => {
            console.error("Error:", error);
            toast({
              title: "Payment Failed!",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          });
      },
      // onError handler is optional
      onError(error: Error) {
        // handle errors
        console.log(error);
      },
      onClose() {
        console.log("widget is closing");
      },
    },
    paymentPreference: [
      "KHALTI",
      "EBANKING",
      "MOBILE_BANKING",
      "CONNECT_IPS",
      "SCT",
    ],
  };
};

export default KhaltiConfig;
