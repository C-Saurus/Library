import React from "react";
import ReactStars from "react-rating-stars-component";
import "./index.css";
import { useState } from "react";
import { getById } from "../../service/book/bookThunk";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getLocalStorage } from "../../utils/localStore";
import { successToast, errorToast, warnToast } from "../../utils/toast";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { getAll } from "../../service/category/cateThunk";
import { addOrder, findOrder } from "../../service/order/orderThunk";
import {
  addCmt,
  getAllByBookId,
  getAllByBookIdAndUsername,
  updateCmt,
} from "../../service/cmt/cmtThunk";
const Book = () => {
  const edit = false;
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [book, setBook] = useState();
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState();
  const [cmt, setCmt] = useState();
  const [currentCmt, setCurrentCmt] = useState();
  const [editCmt, setEditCmt] = useState(false);
  const [order, setOrder] = useState();
  const params = useParams();
  const navigate = useNavigate();
  const token = getLocalStorage("token") ?? undefined;
  const username = getLocalStorage("username") ?? undefined;
  const userId = getLocalStorage("user_id") ?? undefined;
  const dispatch = useDispatch();
  const id = params?.id;
  useEffect(() => {
    if (!token) {
      warnToast("Bạn phải đăng nhập trước đã!");
      navigate("/");
    }
    Promise.all([
      dispatch(getById({ id: id, token: token })),
      dispatch(getAll(token)),
      dispatch(
        getAllByBookId({
          params: { bookId: id, username: username },
          token: token,
        })
      ),
      dispatch(
        getAllByBookIdAndUsername({
          params: { bookId: id, username: username },
          token: token,
        })
      ),
      dispatch(
        findOrder({
          params: { bookId: id, userId: userId },
          token: token,
        })
      ),
    ])
      .then((res) => {
        setBook(res[0]?.payload);
        setCategory(res[1]?.payload);
        setCmt(res[2]?.payload);
        setCurrentCmt(res[3]?.payload);
        setOrder(res[4]?.payload);
      })
      .catch(() => {
        errorToast("Hãy kiểm tra kết nối của bạn!");
      });
  }, [dispatch, token, id, navigate, username, userId]);
  const ratingChanged = (newRating) => {
    setLoad(true);
    currentCmt.point = newRating;
    if (!currentCmt?.username) {
      currentCmt.username = username;
      currentCmt.bookId = id;
      dispatch(addCmt({ body: currentCmt, token: token })).then((res) => {
        if (res?.payload?.statusCode === 200) {
          successToast(res?.payload?.msg);
        } else {
          errorToast(res?.payload?.msg);
        }
      });
    } else {
      dispatch(updateCmt({ formData: currentCmt, token: token })).then(
        (res) => {
          if (res?.payload?.statusCode === 200) {
            successToast(res?.payload?.msg);
          } else {
            errorToast(res?.payload?.msg);
          }
        }
      );
    }
    setLoad(false);
  };

  const handlePost = () => {
    setLoad(true);
    if (!currentCmt?.username) {
      currentCmt.username = username;
      currentCmt.bookId = id;
      dispatch(addCmt({ body: currentCmt, token: token })).then((res) => {
        if (res?.payload?.statusCode === 200) {
          successToast(res?.payload?.msg);
        } else {
          errorToast(res?.payload?.msg);
        }
      });
    } else {
      dispatch(updateCmt({ formData: currentCmt, token: token })).then(
        (res) => {
          if (res?.payload?.statusCode === 200) {
            successToast(res?.payload?.msg);
          } else {
            errorToast(res?.payload?.msg);
          }
        }
      );
    }
    setLoad(false);
  };

  const handleEditCmt = () => {
    if (editCmt) {
      dispatch(updateCmt({ formData: currentCmt, token: token })).then(
        (res) => {
          if (res?.payload?.statusCode === 200) {
            successToast(res?.payload?.msg);
          } else {
            errorToast(res?.payload?.msg);
          }
        }
      );
    }
    setEditCmt(!editCmt);
  };

  const handleDeleteCmt = () => {
    setCurrentCmt({
      ...currentCmt,
      cmt: null,
    });
    currentCmt.cmt = null;
    dispatch(updateCmt({ formData: currentCmt, token: token })).then((res) => {
      if (res?.payload?.statusCode === 200) {
        successToast(res?.payload?.msg);
      } else {
        errorToast(res?.payload?.msg);
      }
    });
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleOrder = () => {
    const data = {
      userId: userId,
      bookId: id,
      quantity: quantity,
      price: quantity * book?.price,
    };
    setLoad(true);
    dispatch(addOrder({ body: data, token: token })).then((res) => {
      if (res?.payload?.statusCode === 200) {
        successToast(res?.payload?.msg);
        setShow(false);
      } else {
        errorToast(res?.payload?.msg);
      }
    });
    setLoad(false);
    if (!order) {
      setOrder(true);
    }
  };
  return (
    <div style={{ backgroundColor: "#F0F0F0" }}>
      {book?.title ? (
        <div className="wrapper">
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
                        value={book?.title}
                        disabled={!edit}
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Tác giả</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập tác giả"
                        name="author"
                        value={book?.author}
                        disabled={!edit}
                      />
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
                        value={book?.desc}
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
                        value={book?.pubDate}
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Số trang</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Số trang"
                        name="numpage"
                        disabled={!edit}
                        value={book?.numpage}
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
                        value={book?.price}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <h3>Nhận xét</h3>
                    <ul>
                      {cmt.map((item) => (
                        <li key={item?.id}>
                          <div>
                            <span>{item?.username}: </span>
                            <span>{item?.cmt}</span>
                          </div>
                          {item?.point && (
                            <ReactStars
                              count={5}
                              size={30}
                              value={item?.point}
                              edit={false}
                              activeColor="#ffd700"
                            />
                          )}
                        </li>
                      ))}
                      {(currentCmt?.cmt || currentCmt?.point) && (
                        <li>
                          <span>{currentCmt?.username}: </span>
                          {currentCmt?.cmt && (
                            <div>
                              <div>
                                <Form.Control
                                  type="text"
                                  placeholder="Suy nghĩ của bạn..."
                                  disabled={!editCmt}
                                  value={currentCmt?.cmt}
                                  onChange={(e) =>
                                    setCurrentCmt({
                                      ...currentCmt,
                                      cmt: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div style={{ color: "blueviolet" }}>
                                <span
                                  className="me-5"
                                  style={{ cursor: "pointer" }}
                                  onClick={handleDeleteCmt}
                                >
                                  Xóa
                                </span>
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={handleEditCmt}
                                >
                                  {!editCmt ? "Chỉnh sửa" : "Lưu"}
                                </span>
                              </div>
                            </div>
                          )}
                          {currentCmt?.point && (
                            <ReactStars
                              count={5}
                              size={30}
                              value={currentCmt?.point}
                              edit={false}
                              activeColor="#ffd700"
                            />
                          )}
                        </li>
                      )}
                    </ul>
                    <Form.Group as={Col}>
                      <Form.Label>
                        {order.length > 0
                          ? "Nhận xét ngay"
                          : "Bạn chưa mua hàng"}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Viết gì đó..."
                        name="cmt"
                        disabled={order.length === 0}
                        onChange={(e) =>
                          setCurrentCmt({ ...currentCmt, cmt: e.target.value })
                        }
                      />
                      <Button
                        className="mt-2"
                        disabled={order.length === 0}
                        onClick={handlePost}
                      >
                        Đăng
                      </Button>
                    </Form.Group>
                  </Row>
                </Col>
                <Col xs={12} sm={12} lg={5} md={6}>
                  <div>
                    <div as={Col}>
                      <Form.Label>Ảnh bìa</Form.Label>
                      <img
                        className="img-thumbnail"
                        src={"http://localhost:9090" + book?.thumb}
                        alt="Preview"
                      />
                    </div>
                    <div as={Col} className="pt-5 pb-4">
                      <Button
                        className="w-100"
                        variant="primary"
                        onClick={handleShow}
                        disabled={load}
                      >
                        Mua ngay
                      </Button>
                    </div>
                    {order.length > 0 && (
                      <div>
                        <span
                          style={{
                            bottom: "-80px",
                            fontSize: "20px",
                            fontWeight: "600",
                          }}
                        >
                          Lịch sử mua
                        </span>
                        <table className="table table-striped table-bordered">
                          <thead>
                            <tr>
                              <th>Mã đơn</th>
                              <th>Số lượng</th>
                              <th>Giá tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.map((item) => (
                              <tr key={item?.orderId}>
                                <td>{item?.orderId}</td>
                                <td>{item?.quantity}</td>
                                <td>{item?.price} vnd</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="w-100 align-items-center">
                      <span
                        style={{
                          bottom: "-80px",
                          fontSize: "20px",
                          fontWeight: "600",
                        }}
                      >
                        Đánh giá sản phẩm
                      </span>
                      <ReactStars
                        count={5}
                        onChange={ratingChanged}
                        size={60}
                        value={currentCmt?.point ?? 0}
                        edit={order.length > 0}
                        activeColor="#ffd700"
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Xác nhận mua hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập số sách"
                    autoFocus
                    name="quantity"
                    value={quantity}
                    min={1}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Đơn giá</Form.Label>
                  <Form.Control
                    type="number"
                    value={book?.price * quantity}
                    name="price"
                    disabled
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Chú thích</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleOrder} disabled={load}>
                Xác nhận
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
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

export default Book;
