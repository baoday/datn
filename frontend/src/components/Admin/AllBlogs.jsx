import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllBlogs, createBlog, deleteBlog } from "../../redux/actions/blog";
import Loader from "../Layout/Loader";
import axios from "axios";
import { server } from "../../server";

const AllBlogs = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllblogs = async () => {
    const { data } = await axios.get(`${server}/blog/all-blog`);
    if (data.success && data.blogs.length > 0) {
      console.log(data.blogs);
      const results = [];
      Object.entries(data.blogs).map((val) =>
        results.push({
          id: val[1]._id,
          title: val[1].title,
          category: val[1].category,
        })
      );
      setRows(results);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllblogs();
  }, []);

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    dispatch(createBlog(title, description, category, tags, images));
  };

  const columns = [
    { field: "id", headerName: "ID Bài Viết", minWidth: 150, flex: 0.7 },
    { field: "title", headerName: "Tiêu Đề", minWidth: 180, flex: 1.4 },
    { field: "category", headerName: "Danh Mục", minWidth: 100, flex: 0.5 },
    {
      field: "actions",
      headerName: "Hành Động",
      minWidth: 150,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <>
          <Link to={`/blogs/${params.id}`}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
          <Button onClick={() => handleDelete(params.id)}>
            <AiOutlineDelete size={20} />
          </Button>
        </>
      ),
    },
  ];

  const handleDelete = (id) => {
    dispatch(deleteBlog(id));
  };
  return (
    <>
      <div className="w-full mx-8 pt-1 mt-10 bg-white">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Thêm Blog Mới
        </Button>
        {isLoading ? (
          <Loader />
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Thêm Blog Mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tiêu Đề"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Mô Tả"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Danh Mục"
            type="text"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Thẻ"
            type="text"
            fullWidth
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <input type="file" multiple onChange={handleImageChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllBlogs;
