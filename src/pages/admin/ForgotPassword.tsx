import { Fragment } from "react";
import ForgotPasswordForm from "../../components/Form/ForgotPasswordForm";
import { useToast } from "@chakra-ui/react";
import { IResetPasswordData } from "../../types/types";
import { useVerifyEmailMutation } from "../../store/authApiSlice";

const ForgotPassword = () => {
  const toast = useToast();
  const [verifyEmail] = useVerifyEmailMutation();

  const formReceiveHandler = (data: IResetPasswordData) => {
    verifyEmail({ email: data.email })
      .unwrap()
      .then(() => {})
      .catch((err) => {
        toast({
          title: "Reset password failed.",
          description: "Please check your credentials.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <Fragment>
      <ForgotPasswordForm onReceiveFormData={formReceiveHandler} />
    </Fragment>
  );
};

export default ForgotPassword;
