import Dashboard from "views/Dashboard.js";
//import Map from "views/Map.js";
//import Rtl from "views/Rtl.js"
import Profile from "views/Profile.js";
import AddProduct from "views/AddProduct.js";
import AddStaff from "views/AddStaff.js";
import AddService from "views/AddService";
import Products from "views/Products";
import Staff from "views/Staff";
import Services from "views/Service";
import Inventory from "views/Inventory";
import Sale from "views/Sale.js";
import SaleService from "views/SaleService";
import ShowSales from "views/ShowSales.js";
import ShowServices from "views/ShowServices";
import Changes from "views/Changes.js";

import { HiUsers } from "react-icons/hi";
import {FiPackage,FiUser} from 'react-icons/fi';
import {RiDashboardFill,RiAddBoxFill,RiSlideshowLine,RiBookReadFill} from 'react-icons/ri';
import {AiTwotoneReconciliation} from 'react-icons/ai';
import {FaMoneyBillAlt,FaScrewdriver} from 'react-icons/fa';


var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <RiDashboardFill size='28' />,
    component: Dashboard,
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
    path: "/sales_service",
    name: "Provide Service",
    icon: <FaMoneyBillAlt size='28' />,
    component: SaleService,
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
    path: "/services",
    name: "Services",
    icon: <FaScrewdriver size='28'/>,
    component: Services,
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
    path: "/staff",
    name: "Staff",
    icon: <HiUsers size='28'/>,
    component: Staff,
    layout: "/admin",
  },
  {
    path: "/addstaff",
    name: "Add Staff",
    icon: <RiAddBoxFill size='28' />,
    component: AddStaff,
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
    path: "/addservice",
    name: "Add Service",
    icon: <RiAddBoxFill size='28' />,
    component: AddService,
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
    path: "/show_services",
    name: "Show Services",
    icon: <RiSlideshowLine size='28' />,
    component: ShowServices,
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
