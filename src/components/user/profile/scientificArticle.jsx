import {
  Col,
  Row,
  Empty,
  Button,
  Pagination,
  Card,
  message,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { deleteArticleApi, getAllArticle } from "../../../services/api";
import ArticalModal from "./modalArticle";
import ArticalEditModal from "./modalEditArtical";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./article.scss";
const { Link } = Typography;
const ScientificArticle = () => {
  const [listProduct, setListProduct] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const UserId = sessionStorage.getItem("userId");
  const [currentPage, setCurrentPage] = useState(1);
  const [product, setProduct] = useState();
  const itemsPerPage = 4;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listProduct.slice(indexOfFirstItem, indexOfLastItem);
  const actions = (id) => [
    <EditOutlined
      style={{ color: "blue" }}
      key="edit"
      onClick={() => setIsOpenEdit(true)}
    />,
    <DeleteOutlined
      style={{ color: "red" }}
      onClick={() => {
        deleteArticle(id);
      }}
      key="setting"
    />,
  ];
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const getArtical = async () => {
    try {
      const res = await getAllArticle({
        UserId: UserId,
      });
      if (res && res?.data) {
        const sortArticles = res.data.sort((a, b) => b.publishYear - a.publishYear);
        setListProduct(sortArticles);
      }
    } catch (error) {
      console.log("Có lỗi tại getArtical", error);
    }
  };
  const deleteArticle = async (id) => {
    try {
      const res = await deleteArticleApi({
        id: id,
      });
      if (res && res.statusCode === 200) {
        message.success("Xóa bài báo thành công");
        getArtical();
      }
    } catch (error) {
      console.log("Có lỗi tại deleteArtical", error);
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
        <Row gutter={[10, 10]}>
          {currentItems.map((product, index) => (
            <Col span={12} key={index}>
              <div className="card-container">
                <Card actions={actions(product.id)} className="custom-card">
                  <Card.Meta
                    title={product.achievementName}
                    description={
                      <>
                        <p>Năm xuất bản: {product.publishYear}</p>
                        <Link
                          href={product.articleLink}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Đường dẫn bài báo
                        </Link>
                      </>
                    }
                  />
                </Card>
              </div>
            </Col>
          ))}
          <Col span={24}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={listProduct.length}
                onChange={handlePageChange}
              />
            </div>
          </Col>
        </Row>
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
