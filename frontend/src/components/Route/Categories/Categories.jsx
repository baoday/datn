import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { brandingData } from "../../../static/data";
import styles from "../../../styles/styles";
import axios from "axios";
const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v2/category/get-all-categories");
        setCategories(response.data.categories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (category) => {
    navigate(`/products?category=${category.title}`);
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div
          className={`branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md`}
        >
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start" key={index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
                  <p className="text-xs md:text-sm">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div
        className={`${styles.section} bg-white p-6 rounded-lg mb-12`}
        id="categories"
      >
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
          {categories &&
            categories.map((category) => (
              <div
                className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden"
                key={category._id}
                onClick={() => handleSubmit(category)}
              >
                <h5 className={`text-[18px] leading-[1.3]`}>{category.title}</h5>
                <img
                  src={category.images[0].url}
                  className="w-[120px] object-cover"
                  alt={category.title}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Categories;