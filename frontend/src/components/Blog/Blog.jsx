import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import styles from "../../styles/styles";
import "./blog.css";

const BlogCard = ({ blog }) => (
  <div className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <img
      src={blog.images[0]?.url || "https://via.placeholder.com/150"}
      alt={blog.title}
      className="w-full h-40 object-cover rounded-lg mb-4"
    />
    <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
    <p className="text-gray-600 mb-4">{blog.description}</p>
    <Button
      variant="contained"
      color="primary"
      component="a"
      href={`/blogs/${blog._id}`}
      className="text-blue-500 hover:underline"
    >
      Xem chi tiết
    </Button>
  </div>
);

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v2/blog/all-blog"
        );
        setBlogs(response.data.blogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Header activeHeading={4} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        <h1 className="text-center font-bold text-2xl mb-8">Tin Tức</h1>
        {loading ? (
          <h1 className="text-center w-full pb-[100px] text-[20px]">Đang tải...</h1>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <h1 className="text-center w-full pb-[100px] text-[20px]">Không có Blog nào!</h1>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BlogsPage;
