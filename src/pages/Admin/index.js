import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLocalStorage } from "../../utils/localStore";
import { deleteBook, getAll } from "../../service/book/bookThunk";
import { confirmAlert } from "react-confirm-alert";
import { Button, Spinner } from "react-bootstrap";
import { errorToast, successToast } from "../../utils/toast";

const Admin = () => {
  const token = getLocalStorage("token") ?? undefined;
  const userRole = getLocalStorage("role") ?? undefined;
  const [book, setBook] = useState();
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAll()).then((res) => {
      setBook(res.payload);
    });
  }, [dispatch]);
  const handleAdd = (id) => {
    navigate(`/admin/book/${id}`);
  };
  const handleView = (id) => {
    navigate(`/admin/book/${id}`);
  };

  function handleDelete(id) {
    confirmAlert({
      title: "Xác nhận xóa",
      message: "Bạn có chắc muốn xóa mục này?",
      buttons: [
        {
          label: "Có",
          onClick: () => {
            setLoad(true);
            dispatch(deleteBook({ id: id, token: token })).then((res) => {
              if (res?.payload?.statusCode === 200) {
                successToast(res?.payload?.msg);
              } else {
                errorToast(res?.payload?.msg);
              }
            });
            navigate(0);
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
      {book ? (
        <div className="container">
          <div className="row">
            <h1>Danh sách trong thư viện</h1>
          </div>
          <button
            className="btn btn-primary w-100 mb-3"
            onClick={() => handleAdd(-1)}
          >
            Thêm mới
          </button>
          {book.length <= 0 ? (
            <h1 style={{ textAlign: "center", paddingTop: "25%" }}>
              Danh sách đang trống
            </h1>
          ) : (
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Tiêu đề</th>
                  <th>Tác giả</th>
                  <th>Thể loại</th>
                  <th>Số trang</th>
                  <th>Đã bán</th>
                  {userRole === "ADMIN" ? <th>Action</th> : <></>}
                </tr>
              </thead>
              <tbody>
                {book.map((item) => (
                  <tr key={item.bookId}>
                    <td>{item.title}</td>
                    <td>{item.author}</td>
                    <td>{item.cateName}</td>
                    <td>{item.numpage}</td>
                    <td>{item.sold}</td>
                    {userRole === "ADMIN" ? (
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
                          onClick={() => handleDelete(item.bookId)}
                          variant="danger"
                          disabled={load}
                        >
                          Xóa
                        </Button>
                      </td>
                    ) : (
                      <></>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

export default Admin;
