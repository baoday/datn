// BlogDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Layout/Footer';
import Header from '../Layout/Header';
import styles from '../../styles/styles';
const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v2/blog/get-blog/${id}`);
        setBlog(response.data.blog);
        setReviews(response.data.blog.reviews); // Set reviews from blog data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/v2/blog/review`, {
        user: 'Guest',
        comment: comment,
        blogId: id,
      });
      console.log(response.data.message);
      setReviews([...reviews, { user: 'User', comment: comment, createdAt: new Date() }]);
      setComment('');
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <Header activeHeading={4} />
        <div className={`${styles.section}`}>
          <div className="container mx-auto py-8">
            <h1 className="text-4xl font-bold mb-4">Đang Tải...</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div>
        <Header activeHeading={4} />
        <div className={`${styles.section}`}>
          <div className="container mx-auto py-8">
            <h1 className="text-4xl font-bold mb-4">Không Tìm Thấy Bài Viết</h1>
            <Link to="/blogs" className="text-blue-500">Quay Lại</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header activeHeading={4} />
      <div className={`${styles.section}`}>
        <div className="container mx-auto py-8">
          <div className="mb-4">
            <Link to="/blogs" className="text-blue-500">Quay Lại</Link>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{textAlign:'center'}}>{blog.title}</h1>
          <img src={blog.images[0]?.url || 'https://via.placeholder.com/150'} alt={blog.title} className="w-full h-60 object-cover rounded-lg mb-4" />
          <p>{blog.description}</p>

          {/* Render reviews */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Đánh giá</h2>
            {reviews.length > 0 ? (
              <ul>
                {reviews.map((review, index) => (
                  <li key={index} className="mb-2">
                    <strong>{review.user}</strong>: {review.comment}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Chưa có đánh giá nào cho bài viết này.</p>
            )}

            <form onSubmit={handleSubmitReview} className="mt-4">
              <textarea
                value={comment}
                onChange={handleCommentChange}
                placeholder="Nhận xét của bạn..."
                className="w-full p-2 border rounded"
                rows="4"
              />
              <button type="submit" className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Gửi Đánh Giá
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;
