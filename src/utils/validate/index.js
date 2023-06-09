import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup.string().required("Username không được để trống!"),
  password: yup
    .string()
    .min(8, "Mật khẩu phải trong khoảng 8-20 kí tự")
    .max(20, "Mật khẩu phải trong khoảng 8-20 kí tự")
    .required("Mật khẩu không được để trống"),
});

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không ở đúng định dạng"),

  username: yup.string().required("Username không được để trống!"),

  password: yup
    .string()
    .min(8, "Mật khẩu phải trong khoảng 8-20 kí tự")
    .max(20, "Mật khẩu phải trong khoảng 8-20 kí tự")
    .required("Mật khẩu không được để trống"),
});

export const bookSchema = yup.object().shape({
  title: yup.string().required("Tiêu đề không được để trống"),
  author: yup.string().required("Tác giả không được để trống"),
  pubDate: yup.string().required("Ngày phát hành không được để trống"),
  price: yup.string().required("Giá bán không được để trống"),
});

export const orderSchema = yup.object().shape({
  quantity: yup
    .number()
    .required("Vui lòng nhập số lượng")
    .min(1, "Số lượng phải lớn hơn 0"),
});
