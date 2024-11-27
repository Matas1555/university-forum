import { useStateContext } from "../context/contextProvider";
import { useState } from "react";

const SideBar = ({ onTableSelect }) => {
  const { user } = useStateContext();

  // Define the list items in an array
  const menuItems = [
    "Users",
    "Categories",
    "Comments",
    "Forums",
    "Posts",
    "Profiles",
    "Programs",
    "Status",
    "Roles",
    "Universities",
  ];

  const [selectedItem, setSelectedItem] = useState(null);

  const listItemStyle =
    "ml-8 mb-10 p-2 font-inter font-medium text-base rounded-md border-2 border-slate-300 border-blue text-blue border-r-0 rounded-r-none cursor-pointer hover:bg-blue hover:text-lightest-blue duration-300 transition-colors";

  const selectedStyle = "bg-blue text-lightest-blue";

  return (
    <div className="h-screen pt-8 w-40 bg-lightest-blue border-r-2 border-r-blue">
      <ul className="list-none">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`${listItemStyle} ${
              selectedItem === item ? selectedStyle : ""
            }`}
            onClick={() => {
              setSelectedItem(item); 
              onTableSelect(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
