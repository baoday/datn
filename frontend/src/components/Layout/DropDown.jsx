import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Thêm axios để thực hiện yêu cầu HTTP
import styles from "../../styles/styles";

const DropDown = ({ setDropDown }) => {
  const [categoriesData, setCategoriesData] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v2/category/get-all-categories'); 
      setCategoriesData(response.data.categories); 
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const submitHandle = (i) => {
    navigate(`/products?category=${i.title}`);
    setDropDown(false);
  };

  return (
    <div className="pb-4 w-[270px] bg-[#fff] absolute z-30 rounded-b-md shadow-sm">
      {categoriesData.length > 0 ? (
        categoriesData.map((i, index) => (
          <div
            key={index}
            className={`${styles.noramlFlex}`}
            onClick={() => submitHandle(i)}
          >
            <img
              src={i.images[0]?.url} 
              style={{
                width: "25px",
                height: "25px",
                objectFit: "contain",
                marginLeft: "10px",
                userSelect: "none",
              }}
              alt={i.title}
            />
            <h3 className="m-3 cursor-pointer select-none">{i.title}</h3>
          </div>
        ))
      ) : (
        <p className="m-3">Đang tải...</p>
      )}
    </div>
  );
};

export default DropDown;
