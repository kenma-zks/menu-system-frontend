import myKey from "./KhaltiKey";

const KhaltiConfig = () => {
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
