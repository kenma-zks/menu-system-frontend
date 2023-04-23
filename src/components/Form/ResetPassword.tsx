import React, { Fragment, useState } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import { useVerifyPasswordMutation } from "../../store/authApiSlice";
import { useToast } from "@chakra-ui/react";

const ResetPassword = () => {
  const [verifyPassword] = useVerifyPasswordMutation();
  const toast = useToast();

  const formReceiveHandler = (data: {
    user_id: number;
    password: string;
    confirm_password: string;
  }) => {
    console.log(typeof data.user_id);
    verifyPassword({
      user_id: data.user_id,
      password: data.password,
      confirm_password: data.confirm_password,
    })
      .unwrap()
      .then(() => {
        toast({
          title: "Password reset.",
          description: "You can now log in.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      })
      .catch((err) => {
        toast({
          title: "Password reset failed.",
          description: "Password doesn't match.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      });
  };

  return (
    <Fragment>
      <ResetPasswordForm onReceiveFormData={formReceiveHandler} />
    </Fragment>
  );
};

export default ResetPassword;
