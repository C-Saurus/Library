import React from "react";

import "./index.css";
import { useState } from "react";
import { addBook, getById, updateBook } from "../../../service/book/bookThunk";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getLocalStorage } from "../../../utils/localStore";
import { successToast, errorToast, warnToast } from "../../../utils/toast";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CloseButton, Col, Form, Row, Spinner } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { bookSchema } from "../../../utils/validate";
import { useForm } from "react-hook-form";
import { getAll } from "../../../service/category/cateThunk";
import { confirmAlert } from "react-confirm-alert";
const BookDetails = () => {
  const [edit, setEdit] = useState(false);
  const [load, setLoad] = useState(false);
  const [book, setBook] = useState();
  const [image, setImage] = useState(book?.thumb);
  const [fileImg, setFileImg] = useState(null);
  const [category, setCategory] = useState();
  const params = useParams();
  const navigate = useNavigate();
  const token = getLocalStorage("token") ?? undefined;
  const userRole = getLocalStorage("role") ?? undefined;
  const dispatch = useDispatch();
  const id = params?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(bookSchema),
  });
  useEffect(() => {
    if (!token) {
      warnToast("Bạn phải đăng nhập trước đã!");
      navigate("/");
    }
    if (!userRole || userRole !== "ADMIN") {
      warnToast("Không có quyền truy cập!");
      navigate("/");
    }
    if (id > 0) {
      Promise.all([
        dispatch(getById({ id: id, token: token })),
        dispatch(getAll(token)),
      ])
        .then((res) => {
          setBook(res[0]?.payload);
          setCategory(res[1]?.payload);
          setEdit(false);
        })
        .catch(() => {
          errorToast("Hãy kiểm tra kết nối của bạn!");
        });
    } else {
      dispatch(getAll(token)).then((res) => {
        setBook([]);
        setCategory(res?.payload);
        setEdit(true);
      });
    }
  }, [dispatch, token, id, userRole, navigate]);

  const handleEdit = () => {
    setLoad(true);
    setEdit(true);
    setTimeout(function () {
      setLoad(false);
    }, 1000);
  };

  const onSubmit = (data) => {
    setLoad(true);
    data.thumb = book?.thumb;
    const formData = new FormData();
    formData.append("bookData", JSON.stringify(data));
    formData.append("fileImg", fileImg ?? null);
    if (id < 0) {
      confirmAlert({
        title: "Xác nhận tạo mới",
        message: "Bạn có chắc muốn thêm mục này?",
        buttons: [
          {
            label: "Có",
            onClick: () => {
              dispatch(addBook({ formData: formData, token: token })).then(
                (res) => {
                  if (res?.payload?.statusCode === 200) {
                    successToast(res?.payload.msg);
                    navigate("/admin");
                  } else {
                    errorToast(res?.payload.msg);
                  }
                }
              );
            },
          },
          {
            label: "Không",
            onClick: () => {},
          },
        ],
      });
    } else {
      dispatch(updateBook({ formData: formData, token: token, id: id })).then(
        (res) => {
          if (res?.payload?.statusCode === 200) {
            successToast(res?.payload.msg);
          } else {
            errorToast(res?.payload.msg);
          }
        }
      );
    }
    setLoad(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setFileImg(file);
  };

  return (
    <div style={{ backgroundColor: "#F0F0F0" }}>
      {(category && book?.title && id > 0) || (id < 0 && category) ? (
        <Form className="wrapper" onSubmit={handleSubmit(onSubmit)}>
          <div className="container">
            <div className="pt-3">
              <Row>
                <Col xs={12} sm={12} lg={7} md={6}>
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Tiêu đề</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập tiêu đề"
                        name="title"
                        disabled={!edit}
                        {...register("title", {
                          value: `${book?.title ?? ""}`,
                        })}
                      />
                      <Form.Text className="text-danger">
                        {errors.title?.message}
                      </Form.Text>
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Tác giả</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập tác giả"
                        name="author"
                        disabled={!edit}
                        {...register("author", {
                          value: `${book?.author ?? ""}`,
                        })}
                      />
                      <Form.Text className="text-danger">
                        {errors.author?.message}
                      </Form.Text>
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group>
                      <Form.Label>Mô tả</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="desc"
                        disabled={!edit}
                        {...register("desc", { value: `${book?.desc ?? ""}` })}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Ngày phát hành</Form.Label>
                      <Form.Control
                        type="date"
                        name="pubDate"
                        disabled={!edit}
                        {...register("pubDate", {
                          value: `${book?.pubDate ?? ""}`,
                        })}
                      />
                      <Form.Text className="text-danger">
                        {errors.pubDate?.message}
                      </Form.Text>
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Số trang</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Số trang"
                        name="numpage"
                        disabled={!edit}
                        {...register("numpage", {
                          value: `${book?.numpage ?? 0}`,
                        })}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridState">
                      <Form.Label>Thể loại</Form.Label>
                      <Form.Select
                        defaultValue={book?.cateId}
                        name="cateId"
                        disabled={!edit}
                        {...register("cateId")}
                      >
                        {category?.map((category) => (
                          <option
                            key={category?.cateId}
                            value={category?.cateId}
                          >
                            {category?.cateName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Giá</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Giá bán"
                        name="price"
                        disabled={!edit}
                        {...register("price", { value: `${book?.price ?? 0}` })}
                      />
                      <Form.Text className="text-danger">
                        {errors.price?.message}
                      </Form.Text>
                    </Form.Group>
                  </Row>
                </Col>
                <Col xs={12} sm={12} lg={5} md={6}>
                  <div>
                    <Form.Group as={Col}>
                      <div className="d-flex justify-content-between">
                        <Form.Label>Ảnh bìa</Form.Label>
                      </div>
                      <Form.Control
                        type="file"
                        onChange={handleImageChange}
                        accept="image/**"
                        name="thumb"
                        disabled={!edit}
                      />
                      {(book?.thumb || image) && (
                        <img
                          className="img-thumbnail"
                          src={
                            image
                              ? image
                              : "http://localhost:9090" + book?.thumb
                          }
                          alt="Preview"
                        />
                      )}
                    </Form.Group>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="footer">
            {edit ? (
              <Button
                className="footer_btn"
                variant="primary"
                type="submit"
                disabled={load || !edit}
              >
                {id > 0 ? "Save" : "Add"}
              </Button>
            ) : (
              <Button
                className="footer_btn"
                variant="primary"
                onClick={handleEdit}
                disabled={edit}
              >
                Edit
              </Button>
            )}
          </div>
        </Form>
      ) : (
        <div
          style={{
            backgroundColor: "#F0F0F0",
            height: "87vh",
            textAlign: "center",
            paddingTop: "25%",
          }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
