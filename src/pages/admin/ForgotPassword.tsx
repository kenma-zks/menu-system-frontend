import { useState, Fragment } from "react";
import { useToast } from "@chakra-ui/react";
import {
  useVerifyCodeMutation,
  useVerifyEmailMutation,
} from "../../store/authApiSlice";
import ForgotPasswordForm from "../../components/Form/ForgotPasswordForm";
import VerifyCodeForm from "../../components/Form/VerifyCodeForm";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const toast = useToast();
  const [sentCode, setSentCode] = useState(false);
  const [verifyEmail] = useVerifyEmailMutation();
  const [verifyCode] = useVerifyCodeMutation();
  const [codeVerified, setCodeVerified] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  const formReceiveHandler = (data: { email: string }) => {
    verifyEmail({ email: data.email })
      .unwrap()
      .then(() => {
        setSentCode(true);
        toast({
          title: "Code sent.",
          description: "Please check your email.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Email doesn't exist.",
          description: "Please check your credentials.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  const codeReceiveHandler = (data: { code: string }) => {
    verifyCode({ code: data.code })
      .unwrap()
      .then((res) => {
        setUserId(res.user_id);
        setCodeVerified(true);
        toast({
          title: "Code verified.",
          description: "Please check your email.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Code doesn't exist.",
          description: "Please check your credentials.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  if (codeVerified) {
    navigate("/admin/forgot-password/reset-password", {
      state: { userId: userId },
    });
  }

  return (
    <Fragment>
      {sentCode ? (
        <VerifyCodeForm onReceiveFormData={codeReceiveHandler} />
      ) : (
        <ForgotPasswordForm onReceiveFormData={formReceiveHandler} />
      )}
    </Fragment>
  );
};

export default ForgotPassword;
