import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.mixed().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const {
    handleSubmit,
    control,
    reset,
    setValue,
  } = useForm({
    defaultValues: isLogin ? initialValuesLogin : initialValuesRegister,
    resolver: yupResolver(isLogin ? loginSchema : registerSchema),
  });

  const register = async (values) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture[0].name);

    const savedUserResponse = await fetch(
      "http://localhost:5000/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    reset();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    reset();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values) => {
      if (isLogin) {
        await login({
          email: values.email,
          password: values.password,
        });
      }
    if (isRegister) await register(values);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        {isRegister && (
          <>
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label="First Name"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ gridColumn: "span 2" }}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label="Last Name"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ gridColumn: "span 2" }}
                />
              )}
            />
            <Controller
              name="location"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label="Location"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ gridColumn: "span 4" }}
                />
              )}
            />
            <Controller
              name="occupation"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label="Occupation"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ gridColumn: "span 4" }}
                />
              )}
            />
            <Box
              gridColumn="span 4"
              border={`1px solid ${palette.neutral.medium}`}
              borderRadius="5px"
              p="1rem"
            >
              <Controller
                name="picture"
                control={control}
                render={({ field, fieldState }) => (
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setValue("picture", acceptedFiles)
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!field.value ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{field.value[0].name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                )}
              />
            </Box>
          </>
        )}

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              label="Email"
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              label="Password"
              type="password"
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />
      </Box>

      {/* BUTTONS */}
      <Box>
        <Button
          fullWidth
          type="submit"
          sx={{
            m: "2rem 0",
            p: "1rem",
            backgroundColor: palette.primary.main,
            color: palette.background.alt,
            "&:hover": { color: palette.primary.main },
          }}
        >
          {isLogin ? "LOGIN" : "REGISTER"}
        </Button>
        <Typography
          onClick={() => {
            setPageType(isLogin ? "register" : "login");
            reset();
          }}
          sx={{
            textDecoration: "underline",
            color: palette.primary.main,
            "&:hover": {
              cursor: "pointer",
              color: palette.primary.light,
            },
          }}
        >
          {isLogin
            ? "Don't have an account? Sign Up here."
            : "Already have an account? Login here."}
        </Typography>
      </Box>
    </form>
  );
};

export default Form;
