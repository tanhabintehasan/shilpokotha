import React from "react";
import FilterCollapse from "../FilterCollapse";

const SideBar = () => {
  return (
    <div className="w-full ">
      <FilterCollapse
        title="Fashion"
        options={["Traditional", "Handcrafted", "Contemporary", "Winter"]}
      />
    </div>
  );
};

export default SideBar;
