import React, { useEffect, useState } from "react";
import "./index.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAll } from "../../service/book/bookThunk";
import { Button, Card, Col, Row, Spinner } from "react-bootstrap";
const Home = () => {
  const [book, setBook] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAll()).then((res) => {
      setBook(res.payload);
    });
  }, [dispatch]);
  const handleView = (id) => {
    navigate(`/book/${id}`);
  };
  return (
    <div style={{ backgroundColor: "#F0F0F0" }}>
      {book ? (
        <div className="container pt-5 min-vh-100">
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {book.map((book) => (
              <Col key={book?.bookId} className="d-flex flex-column">
                <Card border="1">
                  <img
                    className="home_img"
                    variant="top"
                    src={"http://localhost:9090" + book?.thumb}
                    alt="Ảnh bìa"
                  />
                  <Card.Body>
                    <Card.Title className="home_title">
                      {book?.title}
                    </Card.Title>
                    <Card.Title className="home_title">
                      Tác giả: {book?.author}
                    </Card.Title>

                    <Button
                      variant="primary"
                      onClick={() => handleView(book.bookId)}
                    >
                      Chi tiết
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
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

export default Home;
