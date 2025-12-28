import React, { useState, useEffect } from "react";

import axios from "axios";

import { Switch, Table, TableBody, TableCell, TableHead, TableRow, Paper, Chip, CircularProgress } from "@mui/material";

import { MdOutlineStars } from "react-icons/md";



const ProductSlider = () => {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const BACKEND_URL = "http://localhost:5000";



  // image path handler - standardized

  const getImageUrl = (path) => {

    if (!path) return "https://placehold.co/150?text=No+Image";

    if (path.startsWith("http")) return path;

    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    return `${BACKEND_URL}${cleanPath}`;

  };



  const fetchSliderProducts = async () => {

    try {

      setLoading(true);

      // Calling /all/product to match the designType 'product' in your schema

      const res = await axios.get(`${BACKEND_URL}/api/product-slider/all/product`);

      setProducts(Array.isArray(res.data) ? res.data : []);

    } catch (err) {

      console.error("Slider data load failed", err);

    } finally {

      setLoading(false);

    }

  };



  const handleToggle = async (id) => {

    try {

      const res = await axios.patch(`${BACKEND_URL}/api/product-slider/toggle/${id}`);

      if (res.status === 200) {

        setProducts(prev =>

          prev.map(p => p._id === id ? { ...p, isActive: !p.isActive } : p)

        );

      }

    } catch (err) {

      alert("Failed to update status");

    }

  };



  useEffect(() => { fetchSliderProducts(); }, []);



  return (

    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="flex items-center gap-3 mb-8">

        <MdOutlineStars className="text-4xl text-[#891b1b]" />

        <div>

          <h2 className="text-2xl font-bold text-gray-800">Slider Content Manager</h2>

          <p className="text-sm text-gray-500">Managing assets for the homepage carousel</p>

        </div>

      </div>



      <Paper className="shadow-lg rounded-xl overflow-hidden border border-gray-200">

        {loading ? (

          <div className="flex justify-center p-10"><CircularProgress sx={{color: "#891b1b"}} /></div>

        ) : (

          <Table>

            <TableHead className="bg-gray-100">

              <TableRow>

                <TableCell className="font-bold">Preview</TableCell>

                <TableCell className="font-bold">Product Name</TableCell>

                <TableCell className="font-bold">Price</TableCell>

                <TableCell className="font-bold text-center">Status</TableCell>

                <TableCell className="font-bold text-center">Action</TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {products.length === 0 ? (

                <TableRow><TableCell colSpan={5} align="center">No items found for this category</TableCell></TableRow>

              ) : (

                products.map((product) => (

                  <TableRow key={product._id} hover>

                    <TableCell>

                      <img

                        src={getImageUrl(product.imageURL)}

                        className="w-16 h-10 object-cover rounded shadow-sm border"

                        alt={product.name}

                      />

                    </TableCell>

                    <TableCell className="font-medium text-gray-700">{product.name}</TableCell>

                    <TableCell className="text-[#891b1b] font-bold">৳{product.price}</TableCell>

                    <TableCell align="center">

                      <Chip

                        label={product.isActive ? "Active" : "Hidden"}

                        size="small"

                        sx={{

                            bgcolor: product.isActive ? "#e8f5e9" : "#f5f5f5",

                            color: product.isActive ? "#2e7d32" : "#757575",

                            fontWeight: 'bold'

                        }}

                      />

                    </TableCell>

                    <TableCell align="center">

                      <Switch

                        checked={product.isActive}

                        onChange={() => handleToggle(product._id)}

                        color="error"

                      />

                    </TableCell>

                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>

        )}

      </Paper>

    </div>

  );

};



export default ProductSlider;