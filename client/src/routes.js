import Dashboard from "views/Dashboard.js";
//import Map from "views/Map.js";
//import Rtl from "views/Rtl.js"
import Profile from "views/Profile.js";
import AddProduct from "views/AddProduct.js";
import Products from "views/Products";
import Inventory from "views/Inventory";
import Sale from "views/Sale.js";
import ShowSales from "views/ShowSales.js";
import Changes from "views/Changes.js";

import {FiPackage,FiUser} from 'react-icons/fi';
import {RiDashboardFill,RiAddBoxFill,RiSlideshowLine,RiBookReadFill} from 'react-icons/ri';
import {AiTwotoneReconciliation} from 'react-icons/ai';
import {FaMoneyBillAlt} from 'react-icons/fa';

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <RiDashboardFill size='28' />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/products",
    name: "Products",
    icon: <FiPackage size='28'/>,
    component: Products,
    layout: "/admin",
  },    
  {
    path: "/inventory",
    name: "Inventory",
    icon: <AiTwotoneReconciliation size='28'/>,
    component: Inventory,
    layout: "/admin",
  },  
  {
    path: "/addproduct",
    name: "Add Product",
    icon: <RiAddBoxFill size='28' />,
    component: AddProduct,
    layout: "/admin",
  },
  {
    path: "/sales",
    name: "Make Sale",
    icon: <FaMoneyBillAlt size='28' />,
    component: Sale,
    layout: "/admin",
  },  
  {
    path: "/show_sales",
    name: "Show Sales",
    icon: <RiSlideshowLine size='28' />,
    component: ShowSales,
    layout: "/admin",
  },
  {
    path: "/changes",
    name: "Track Changes",
    icon: <RiBookReadFill size='28'/>,
    component: Changes,
    layout: "/admin",
  },

  {
    path: "/profile",
    name: "Profile",
    icon: <FiUser size='28'/>,
    component: Profile,
    layout: "/admin",
  },
];
export default routes;
