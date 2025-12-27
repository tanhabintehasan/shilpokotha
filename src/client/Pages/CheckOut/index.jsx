import React, { useState } from "react";
import {
  TextField,
  Button,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { MdOutlinePayments, MdLocalShipping, MdLock } from "react-icons/md";

const CheckOut = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  return (
    <section className="bg-[#f8f9fa] py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: BILLING DETAILS */}
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <MdLocalShipping className="text-[#691414] text-2xl" />
                <h2 className="text-xl font-bold text-gray-800">
                  Billing & Shipping
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  placeholder="John"
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  placeholder="Doe"
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  className="md:col-span-2"
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  placeholder="+880"
                />
                <TextField fullWidth label="City" variant="outlined" />
                <TextField
                  fullWidth
                  label="Full Address"
                  variant="outlined"
                  multiline
                  rows={3}
                  className="md:col-span-2"
                  placeholder="House no, Street name, Area..."
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Additional Information
              </h2>
              <TextField
                fullWidth
                label="Order Notes (Optional)"
                variant="outlined"
                multiline
                rows={2}
                placeholder="Notes about your order, e.g. special notes for delivery."
              />
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY & PAYMENT */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md border-2 border-[#691414]/10 sticky top-4">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
                  Your Order
                </h2>

                {/* Product List Summary */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      Men Opaque Casual Shirt{" "}
                      <b className="text-gray-800">x 1</b>
                    </span>
                    <span className="font-bold text-gray-800">৳1,650</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-800">৳1,650</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold uppercase text-xs">
                      Free
                    </span>
                  </div>
                  <Divider />
                  <div className="flex justify-between text-2xl font-black text-[#691414] pt-2">
                    <span>Total</span>
                    <span>৳1,650</span>
                  </div>
                </div>

                {/* PAYMENT SECTION */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MdOutlinePayments /> Payment Method
                  </h3>

                  <FormControl component="fieldset" className="w-full">
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <div
                        className={`border rounded-lg p-3 mb-3 transition-colors ${
                          paymentMethod === "cod"
                            ? "border-[#691414] bg-[#691414]/5"
                            : "border-gray-200"
                        }`}
                      >
                        <FormControlLabel
                          value="cod"
                          control={
                            <Radio
                              sx={{
                                color: "#691414",
                                "&.Mui-checked": { color: "#691414" },
                              }}
                            />
                          }
                          label={
                            <span className="font-bold text-gray-700">
                              Cash on Delivery
                            </span>
                          }
                        />
                        {paymentMethod === "cod" && (
                          <p className="text-[11px] text-gray-500 ml-8">
                            Pay with cash upon delivery.
                          </p>
                        )}
                      </div>

                      <div
                        className={`border rounded-lg p-3 mb-3 transition-colors ${
                          paymentMethod === "bkash"
                            ? "border-[#e2136e] bg-[#e2136e]/5"
                            : "border-gray-200"
                        }`}
                      >
                        <FormControlLabel
                          value="bkash"
                          control={
                            <Radio
                              sx={{
                                color: "#e2136e",
                                "&.Mui-checked": { color: "#e2136e" },
                              }}
                            />
                          }
                          label={
                            <span className="font-bold text-gray-700">
                              bKash / Mobile Banking
                            </span>
                          }
                        />
                      </div>
                    </RadioGroup>
                  </FormControl>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<MdLock />}
                    sx={{
                      backgroundColor: "#691414",
                      height: "60px",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      mt: 4,
                      borderRadius: "8px",
                      "&:hover": { backgroundColor: "#4a0e0e" },
                    }}
                  >
                    Place Order ৳1,650
                  </Button>

                  <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest font-bold">
                    100% Secure SSL Encrypted Connection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
