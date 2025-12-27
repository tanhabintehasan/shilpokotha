import React, { useState } from "react";
import { Button, Chip, Divider, Tooltip, IconButton } from "@mui/material";
import {
  MdLocalShipping,
  MdCheckCircle,
  MdAccessTime,
  MdRemoveRedEye,
  MdAssignmentReturn,
  MdStarRate,
  MdShoppingBag,
} from "react-icons/md";

const MyOrders = () => {
  const [orders] = useState([
    {
      id: "#SK-9021",
      date: "Oct 24, 2025",
      total: 3450,
      status: "Delivered",
      paymentMethod: "bKash",
      items: [
        { name: "Men Opaque Casual Shirt", qty: 2, price: 1200, img: "Shirt" },
        { name: "Premium Cotton Panjabi", qty: 1, price: 1050, img: "Panjabi" },
      ],
    },
    {
      id: "#SK-9055",
      date: "Nov 02, 2025",
      total: 1650,
      status: "Shipped",
      paymentMethod: "Cash on Delivery",
      items: [
        {
          name: "Slim Fit Formal Trouser",
          qty: 1,
          price: 1650,
          img: "Trouser",
        },
      ],
    },
  ]);

  const getStatusDetails = (status) => {
    switch (status) {
      case "Delivered":
        return { color: "success", icon: <MdCheckCircle /> };
      case "Shipped":
        return { color: "primary", icon: <MdLocalShipping /> };
      default:
        return { color: "warning", icon: <MdAccessTime /> };
    }
  };

  return (
    <div className="container">
      {" "}
      <div className="w-full animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="py-3 pb-0">
            <h2 className="text-xl font-bold text-black-800">Order History</h2>
            <p className="text-xs text-black-500">
              View and track your previous purchases
            </p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button className="px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-md text-[#691414]">
              Recent
            </button>
            <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700">
              Returns
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm"
            >
              <div className="p-4 bg-gray-50/50 flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-4 md:gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Order Number
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {order.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Total Paid
                    </p>
                    <p className="text-sm font-bold text-[#691414]">
                      ৳{order.total}
                    </p>
                  </div>
                </div>
                <Chip
                  label={order.status}
                  size="small"
                  color={getStatusDetails(order.status).color}
                  icon={getStatusDetails(order.status).icon}
                  sx={{ fontWeight: "bold", fontSize: "11px" }}
                />
              </div>

              <div className="p-4 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-14 bg-[#691414] text-white flex items-center justify-center rounded text-[10px] font-bold shrink-0">
                      {item.img}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-800 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Qty: {item.qty} | ৳{item.price} each
                      </p>
                    </div>
                    {order.status === "Delivered" && (
                      <IconButton size="small" sx={{ color: "#FFB400" }}>
                        <MdStarRate />
                      </IconButton>
                    )}
                  </div>
                ))}

                <Divider />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Paid via {order.paymentMethod}
                  </p>
                  <div className="flex gap-2">
                    {order.status === "Delivered" && (
                      <Button
                        size="small"
                        startIcon={<MdAssignmentReturn />}
                        sx={{
                          color: "#666",
                          textTransform: "none",
                          fontWeight: "bold",
                        }}
                      >
                        Return
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<MdRemoveRedEye />}
                      sx={{
                        borderColor: "#ddd",
                        color: "#444",
                        textTransform: "none",
                        fontWeight: "bold",
                      }}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
