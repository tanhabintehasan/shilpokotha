import React from "react";
import Button from "@mui/material/Button";
import { IoSearch } from "react-icons/io5";

const Search = () => {
  return (
    <div className="searchbox w-full h-[50px] bg-[#F5F0E6] rounded-[5px] border border-[#B89B7A] relative -mt-[20px]">
      <input
        type="text"
        placeholder="Search for products... "
        className="w-full h-[45px] px-4 text-[#111111] placeholder:text-[#6B6B6B] rounded-[5px] bg-transparent outline-none text-[15px]"
      />
      <Button className="!absolute top-[8px] right-[5px] z-50 !w-[37px] !min-w-[37px] h-[37px] !rounded-full !text-black">
        {" "}
        <IoSearch className="text-[#B89B7A] text-[22px]" />{" "}
      </Button>
    </div>
  );
};

export default Search;
