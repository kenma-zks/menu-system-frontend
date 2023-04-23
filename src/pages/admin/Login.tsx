import { Link as RouterLink, NavLink, useLocation } from "react-router-dom";
import LoginForm from "../../components/Form/LoginForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/toast";
import { Fragment, useState } from "react";
import React from "react";
import { ILoginData, tokenState } from "../../types/types";
import { useVerifyLoginMutation } from "../../store/authApiSlice";
import { authActions } from "../../store/authSlice";
import { useAppDispatch } from "../../store/hooks";

const Login = () => {
  const { state } = useLocation();

  const [openToast, setOpenToast] = useState<boolean>(
    state?.isRegistered ? true : false
  );

  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [verifyLogin] = useVerifyLoginMutation();

  const formReceiveHandler = (data: ILoginData) => {
    verifyLogin({ email: data.email, password: data.password })
      .unwrap()
      .then((tokens: tokenState) =>
        dispatch(authActions.setCredentials({ authTokens: tokens }))
      )
      .then(() => navigate("/admin/home"))
      .catch((err) => {
        toast({
          title: "Login failed.",
          description: "Please check your credentials.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      });
  };

  return (
    <Fragment>
      {openToast && (
        <>
          {setOpenToast(false)}
          {toast({
            title: "Account created.",
            description: "You can now log in.",
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
          })}
        </>
      )}

      <LoginForm onReceiveFormData={formReceiveHandler} />
    </Fragment>
  );
};

export default Login;
