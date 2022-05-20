import Dashboard from "views/Dashboard.js";
//import Map from "views/Map.js";
//import Rtl from "views/Rtl.js"
import Profile from "views/staff/Profile.js";
import Inventory from "views/Inventory";
import Sale from "views/Sale.js";
import SaleService from "views/SaleService";
import ShowServices from "views/ShowServices";
import ShowSales from "views/ShowSales.js";


import {FiUser} from 'react-icons/fi';
import {RiDashboardFill,RiSlideshowLine} from 'react-icons/ri';
import {AiTwotoneReconciliation} from 'react-icons/ai';
import {FaMoneyBillAlt} from 'react-icons/fa';


var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <RiDashboardFill size='28' />,
    component: Dashboard,
    layout: "/staff",
  },
  {
    path: "/sales",
    name: "Make Sale",
    icon: <FaMoneyBillAlt size='28' />,
    component: Sale,
    layout: "/staff",
  }, 
  {
    path: "/sales_service",
    name: "Provide Service",
    icon: <FaMoneyBillAlt size='28' />,
    component: SaleService,
    layout: "/staff",
  },    
  {
    path: "/inventory",
    name: "Inventory",
    icon: <AiTwotoneReconciliation size='28'/>,
    component: Inventory,
    layout: "/staff",
  }, 
  {
    path: "/show_sales",
    name: "Show Sales",
    icon: <RiSlideshowLine size='28' />,
    component: ShowSales,
    layout: "/staff",
  },
  {
    path: "/show_services",
    name: "Show Services",
    icon: <RiSlideshowLine size='28' />,
    component: ShowServices,
    layout: "/staff",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: <FiUser size='28'/>,
    component: Profile,
    layout: "/staff",
  },
];
export default routes;
