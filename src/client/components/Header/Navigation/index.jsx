import React, { useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import Cetagorypanel from "./Cetagorypanel";
import Button from "@mui/material/Button";
import { RiMenuLine } from "react-icons/ri";
import { LiaAngleDoubleDownSolid } from "react-icons/lia";
import { MdRocketLaunch } from "react-icons/md";

const Navigation = () => {
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);

  const openCetagorypanel = () => {
    setIsOpenCatPanel(true);
  };
  return (
    <>
      {" "}
      <nav className="py-4 bg-[#B89B7A]">
        {" "}
        <div className="container flex items-center justify-end gap-3 ">
          {" "}
          <div className="col-1 w-[23%]">
            {" "}
            <Button
              className="!text-black gap-1 w-full !normal-case"
              onClick={openCetagorypanel}
            >
              {" "}
              <RiMenuLine className="text-[16px]" />{" "}
              <p className="text-[14px] font-400"> Shop By Cetagoris</p>{" "}
              <LiaAngleDoubleDownSolid className="text-[16px]" />{" "}
            </Button>{" "}
          </div>
          <div className="col-2 w-[60%]">
            <ul className="flex items-center gap-1">
              <li className="list-none">
                <Button className="!px-[7px] !py-[5px]">
                  <Link
                    to="/"
                    className="link transition !text-[13px] !text-black !normal-case font-[400] nav"
                  >
                    Home
                  </Link>
                </Button>
              </li>
              <li className="list-none relative nav group">
                <Button className="!px-[7px] !py-[5px]">
                  <Link
                    to="/products/fashion"
                    className="link transition !text-[13px] !text-black !normal-case font-[400]"
                  >
                    Fashion
                  </Link>
                </Button>

                {/* Submenu: Now visible on group-hover */}
                <div className="submenu absolute top-[100%] left-0 min-w-[160px] bg-[#B89B7A] shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <ul>
                    <li className="list-none w-full">
                      <Link to="/products/traditional" className="w-full block">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start hover:!bg-[#a68a6a]">
                          Traditional
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link to="/products/handcrafted" className="w-full block">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start hover:!bg-[#a68a6a]">
                          Handcrafted
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link
                        to="/products/contemporary"
                        className="w-full block"
                      >
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start hover:!bg-[#a68a6a]">
                          Contemporary
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link to="/products/winter" className="w-full block">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start hover:!bg-[#a68a6a]">
                          Winter
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="list-none relative nav group">
                <Button className="!px-[7px] !py-[5px]">
                  <Link
                    to="/products/bags"
                    className="link transition !text-[13px] !text-black !normal-case font-[400]"
                  >
                    Bags
                  </Link>
                </Button>

                {/* Submenu becomes visible on group-hover */}
                <div className="submenu absolute top-[100%] left-0 min-w-[180px] bg-[#B89B7A] shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <ul>
                    <li className="list-none w-full">
                      <Link to="/products/hand-bags">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start hover:!bg-[#a68a6a]">
                          Hand Bags
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link to="/products/tote-bags">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start hover:!bg-[#a68a6a]">
                          Tote Bags
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link to="/products/jute-bags">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start hover:!bg-[#a68a6a]">
                          Jute Bags
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link to="/products/backpacks">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start hover:!bg-[#a68a6a]">
                          Backpacks
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="list-none relative nav">
                <Button className="!px-[7px] !py-[5px]">
                  <Link
                    to="/products/footwear"
                    className="link transition !text-[13px] !text-black !normal-case font-[400]"
                  >
                    Footwear
                  </Link>
                </Button>

                <div className="submenu absolute top-[100%] left-0 min-w-[180px] bg-[#B89B7A] shadow-md opacity-0 invisible transition-all duration-300 z-50">
                  <ul>
                    <li className="list-none w-full">
                      <Link to="/footwear/traditional">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Traditional Footwear
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link to="/products/leather-sandals">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Leather Sandals
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link to="/products/flats">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Flats
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link to="/products/sneakers">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Sneakers
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link to="/products/ethnic">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Ethnic Footwear
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="list-none relative nav">
                <Button className="!px-[7px] !py-[5px]">
                  <Link
                    to="/products/beauty"
                    className="link transition !text-[13px] !text-black !normal-case font-[400]"
                  >
                    Beauty
                  </Link>
                </Button>

                <div className="submenu absolute top-[100%] left-0 min-w-[180px] bg-[#B89B7A] shadow-md opacity-0 invisible transition-all duration-300 z-50">
                  <ul>
                    {/* Multani Mati */}
                    <li className="list-none w-full">
                      <Link to="/products/multani-mati">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Multani Mati
                        </Button>
                      </Link>
                    </li>

                    {/* Herbal Soaps */}
                    <li className="list-none w-full">
                      <Link to="/products/herbal-soaps">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Herbal Soaps
                        </Button>
                      </Link>
                    </li>

                    {/* Natural Face Packs */}
                    <li className="list-none w-full">
                      <Link to="/products/face-packs">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Natural Face Packs
                        </Button>
                      </Link>
                    </li>

                    {/* Other Bangladeshi Beauty Products */}
                    <li className="list-none w-full">
                      <Link to="/products/other-products">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Other Local Products
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="list-none relative nav">
                <Button className="!px-[7px] !py-[5px]">
                  <Link
                    to="/products/jewellery"
                    className="link transition !text-[13px] !text-black !normal-case font-[400]"
                  >
                    Jewellery
                  </Link>
                </Button>

                <div className="submenu absolute top-[100%] left-0 min-w-[180px] bg-[#B89B7A] shadow-md opacity-0 invisible transition-all duration-300 z-50">
                  <ul>
                    {/* Gold Jewellery */}
                    <li className="list-none w-full">
                      <Link to="/products/gold">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Gold Jewellery
                        </Button>
                      </Link>
                    </li>

                    {/* Silver Jewellery */}
                    <li className="list-none w-full">
                      <Link to="/products/silver">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Silver Jewellery
                        </Button>
                      </Link>
                    </li>

                    {/* Tribal/Traditional Jewellery */}
                    <li className="list-none w-full">
                      <Link to="/products/tribal">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Tribal/Traditional Jewellery
                        </Button>
                      </Link>
                    </li>

                    {/* Handmade / Artisanal Jewellery */}
                    <li className="list-none w-full">
                      <Link to="/products/handmade">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Handmade Jewellery
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="list-none relative nav">
                <Button className="!px-[7px] !py-[5px]">
                  <Link
                    to="/products/wellness"
                    className="link transition !text-[13px] !text-black !normal-case font-[400]"
                  >
                    Wellness
                  </Link>
                </Button>

                <div className="submenu absolute top-[100%] left-0 min-w-[180px] bg-[#B89B7A] shadow-md opacity-0 invisible transition-all duration-300 z-50">
                  <ul>
                    {/* Herbal Oils */}
                    <li className="list-none w-full">
                      <Link to="/products/herbal-oils">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Herbal Oils
                        </Button>
                      </Link>
                    </li>

                    {/* Natural Teas */}
                    <li className="list-none w-full">
                      <Link to="/products/natural-teas">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Natural Teas
                        </Button>
                      </Link>
                    </li>

                    {/* Traditional Remedies */}
                    <li className="list-none w-full">
                      <Link to="/products/traditional-remedies">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Traditional Remedies
                        </Button>
                      </Link>
                    </li>

                    {/* Other Local Wellness Products */}
                    <li className="list-none w-full">
                      <Link to="/products/other-products">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Other Local Products
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="list-none relative nav">
                <Button className="!px-[7px] !py-[5px]">
                  <Link
                    to="/products/home-decor"
                    className="link transition !text-[13px] !text-black !normal-case font-[400]"
                  >
                    Home Decor
                  </Link>
                </Button>

                <div className="submenu absolute top-[100%] left-0 min-w-[180px] bg-[#B89B7A] shadow-md opacity-0 invisible transition-all duration-300 z-50">
                  <ul>
                    {/* Bamboo & Cane Products */}
                    <li className="list-none w-full">
                      <Link to="/products/bamboo-cane">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Bamboo & Cane Products
                        </Button>
                      </Link>
                    </li>

                    {/* Pottery & Clay Items */}
                    <li className="list-none w-full">
                      <Link to="/products/pottery-clay">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Pottery & Clay Items
                        </Button>
                      </Link>
                    </li>

                    {/* Handcrafted Fabrics & Textiles */}
                    <li className="list-none w-full">
                      <Link to="/products/textiles">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Handcrafted Fabrics & Textiles
                        </Button>
                      </Link>
                    </li>

                    {/* Brass & Bell Metal Items */}
                    <li className="list-none w-full">
                      <Link to="/products/brass-bellmetal">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Brass & Bell Metal Items
                        </Button>
                      </Link>
                    </li>

                    {/* Other Traditional Home Decor */}
                    <li className="list-none w-full">
                      <Link to="/products/other-products">
                        <Button className="!text-[13px] !text-black !normal-case font-[400] w-full !text-left !justify-start">
                          Other Traditional Products
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className="col-3 w-[17%]">
            <p className="text-[14px] font-400 flex items-center gap-1">
              <MdRocketLaunch className="text-[16px]" />
              Free Intertional Delivery
            </p>
          </div>
        </div>
      </nav>
      {/* cetagory panel component */}
      <Cetagorypanel
        isOpenCatPanel={isOpenCatPanel}
        setIsOpenCatPanel={setIsOpenCatPanel}
      />
    </>
  );
};

export default Navigation;
