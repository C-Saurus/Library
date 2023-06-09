import React from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { getLocalStorage } from "../../utils/localStore";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteOrder,
  getAllByUserId,
  updateOrder,
} from "../../service/order/orderThunk";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { errorToast, successToast } from "../../utils/toast";

const Order = () => {
  const token = getLocalStorage("token") ?? undefined;
  const userId = getLocalStorage("user_id") ?? undefined;
  const [order, setOrder] = useState();
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [valueOrder, setValueOrder] = useState({
    orderId: 0,
    quantity: 0,
    price: 0,
  });
  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    setValueOrder({
      orderId: item?.orderId,
      quantity: item?.quantity,
      price: item?.price,
    });
    setShow(true);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAllByUserId({ id: userId, token: token })).then((res) => {
      setOrder(res.payload);
    });
  }, [dispatch, token, userId]);

  const handleUpdate = () => {
    dispatch(updateOrder({ formData: valueOrder, token: token })).then(
      (res) => {
        if (res.payload?.statusCode === 200) {
          successToast(res.payload?.msg);
        } else {
          errorToast(res.payload?.msg);
        }
      }
    );
  };

  const handleView = (id) => {
    navigate(`/book/${id}`);
  };

  function handleDelete(orderId, bookId, quantity) {
    confirmAlert({
      title: "Xác nhận xóa",
      message: "Bạn có chắc muốn xóa mục này?",
      buttons: [
        {
          label: "Có",
          onClick: () => {
            setLoad(true);
            dispatch(
              deleteOrder({
                params: {
                  orderId: orderId,
                  bookId: bookId,
                  quantity: quantity,
                },
                token: token,
              })
            ).then((res) => {
              if (res?.payload?.statusCode === 200) {
                successToast(res?.payload?.msg);
              } else {
                errorToast(res?.payload?.msg);
              }
            });
            setLoad(false);
          },
        },
        {
          label: "Không",
          onClick: () => {},
        },
      ],
    });
  }
  return (
    <div style={{ backgroundColor: "#F0F0F0", minHeight: "87vh" }}>
      {order ? (
        <div className="container">
          <div className="row">
            <h1>Danh sách giỏ hàng</h1>
          </div>
          {order.length <= 0 ? (
            <h1 style={{ textAlign: "center", paddingTop: "25%" }}>
              Giỏ hàng của bạn đang trống
            </h1>
          ) : (
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Tên sách</th>
                  <th>Số lượng</th>
                  <th>Giá thành</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item) => (
                  <tr key={item.orderId}>
                    <td>{item?.bookName}</td>
                    <td>{item?.quantity}</td>
                    <td>{item?.price} vnd</td>
                    <td>
                      <Button
                        onClick={() => handleView(item.bookId)}
                        variant="warning"
                        disabled={load}
                        className="me-2"
                      >
                        Chi tiết
                      </Button>
                      <Button
                        onClick={() =>
                          handleDelete(
                            item?.orderId,
                            item?.bookId,
                            item?.quantity
                          )
                        }
                        variant="danger"
                        disabled={load}
                        className="me-2"
                      >
                        Xóa
                      </Button>
                      <Button
                        onClick={() => handleShow(item)}
                        variant="success"
                        disabled={load}
                      >
                        Sửa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Chỉnh sửa đơn hàng</Modal.Title>
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
                    value={valueOrder?.quantity}
                    min={1}
                    onChange={(e) =>
                      setValueOrder({
                        ...valueOrder,
                        quantity: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Đơn giá</Form.Label>
                  <Form.Control
                    type="number"
                    value={valueOrder?.quantity * valueOrder?.price}
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
              <Button variant="primary" onClick={handleUpdate} disabled={load}>
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

export default Order;
