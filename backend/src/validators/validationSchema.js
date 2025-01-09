import yup from "yup";

const userRegistrationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

const userLoginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const articleCreationSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters long"),
  content: yup
    .string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters long"),
});

const updateArticleSchema = yup.object({
  title: yup
    .string()
    .optional()
    .min(3, "Title must be at least 3 characters long"),
  content: yup
    .string()
    .optional()
    .min(10, "Content must be at least 10 characters long"),
});

export {
  articleCreationSchema,
  userLoginSchema,
  userRegistrationSchema,
  updateArticleSchema,
};
