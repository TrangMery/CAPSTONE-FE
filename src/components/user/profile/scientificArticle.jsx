import { Col, Row, Empty, Button, Pagination } from "antd";
import { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { getAllArticle } from "../../../services/api";
import ArticalModal from "./modalArticle";
import ArticalEditModal from "./modalEditArtical";
import "./scientific.scss";
const ScientificArticle = () => {
  const [listProduct, setListProduct] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const UserId = sessionStorage.getItem("userId");
  const [currentPage, setCurrentPage] = useState(1);
  const [product, setProduct] = useState();
  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listProduct.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const getArtical = async () => {
    try {
      const res = await getAllArticle({
        UserId: UserId,
      });
      if (res && res?.data) {
        setListProduct(res.data);
      }
    } catch (error) {
      console.log("Có lỗi tại getArtical", error);
    }
  };
  useEffect(() => {
    getArtical();
  }, []);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Thêm mới
        </Button>
      </div>
      {listProduct?.length === 0 ? (
        <Empty
          style={{ marginTop: 100 }}
          description={<span>Chưa có bài báo khoa học</span>}
        />
      ) : (
        <Col md={18} xs={24}>
          {currentItems.map((product, index) => (
            <div className="papper" key={index}>
              <div className="papper-content">
                <EditOutlined
                  className="edit-icon"
                  style={{ cursor: "pointer" }}
                  twoToneColor="#eb2f96"
                  onClick={() => {
                    setIsOpenEdit(true), setProduct(product);
                  }}
                />
                <div className="title">
                  <div>{product.articleName}</div>
                </div>
                <div className="description">
                  <div className="info-row">
                    <div>Tên bài báo: {product.achievementName}</div>
                    <div>Năm xuất bản: {product.publishYear}</div>
                  </div>
                  <a
                    href={product.articleLink}
                    className="file-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link: {product.articleLink}
                  </a>
                </div>
              </div>
            </div>
          ))}
          <div className="pagination">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={listProduct.length}
              onChange={handlePageChange}
            />
          </div>
        </Col>
      )}
      <ArticalModal
        openModal={isOpen}
        setOpenModal={setIsOpen}
        userId={UserId}
        getArtical={getArtical}
      />
      <ArticalEditModal
        openModal={isOpenEdit}
        setOpenModal={setIsOpenEdit}
        product={product}
        getArtical={getArtical}
        setProduct={setProduct}
      />
    </>
  );
};

export default ScientificArticle;
