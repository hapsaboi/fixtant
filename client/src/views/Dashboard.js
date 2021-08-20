import React, {useState,useEffect} from "react";

import {sale} from '../data/api';
import axios from 'axios';
import Notifications from "components/Notification/Notification";
import moment from "moment";

import DailySalesChart from "components/DashboardComponents/DailySalesChart";
import salesicon from '../assets/img/sales.svg';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

function Dashboard() {
  const [notificationStatus, setNotificationStatus] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState({msg:"",type:""});

  const [sales, setSales] = useState({});
  const [today, setToday] = useState([]);
  const [dataload, setDataLoad] = useState(true);

  useEffect(
    () => {
      async function fetchSales() {
				await axios.get(sale.showSales,{params:{duration:'daily'}}).then((response)=>{
					if(response.data.status===true){
            if(response.data.data.length>0){
                let data = response.data.data;
                setSales({daily:data});
                setToday(data.filter(obj => moment().isSame(obj.date, 'day')));
                
            }; 
            setDataLoad(false);
          }
          else{
            setNotificationDetails({msg:"Error Loading Products, Please Referesh The Page", type:"danger"});
            setNotificationStatus(true);
          }
        })
      }
			fetchSales();
    },
  []);
  // {date:{$gte:ISODate("2021-01-01"),$lt:ISODate("2020-05-01"}}
  return (
    <>
      {notificationStatus === true ? <Notifications details={notificationDetails}  />:null}
      <div className="content">
        <Row>
          <Col xs="12">        
            {dataload===false?
              <>
              {Object.keys(sales).length>0?
                <DailySalesChart sales={sales} setSales={setSales} />
              :
                <Card className="card">
                  <div style={{textAlign: "center",padding:"20px"}}> 
                  <img  style={{marginBottom:"20px"}} src={salesicon} height="250px"  alt="Nothing to show yet"/><br />
                  <CardTitle tag="h4">Nothing To Show Yet... Make Some Sales to See Graphs</CardTitle>
                  </div>
                </Card>
              }
              </>
            :
              "Loading"
            }
          </Col>
        </Row>
        <Row>
          <Col lg="6" md="12">
            <Card className="card-tasks">
              <CardHeader>
                <h6 className="title d-inline">Sales</h6>
                <p className="card-category d-inline"> today</p>

              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive">
                {!Object.keys(today).length === 0? 
                  <Table>
                    <tbody>
                      {today.map((saleItem,key) => 
                      <>
                        <tr key={key}>
                          <td>
                            <p className="title">
                              {saleItem.items.map((item,key) => 
                                <><span key={key}>{item.product_name} - {item.variation}</span><br /></>
                              )}
                            </p>
                            <p className="text-muted">
                              Buyer: {saleItem.buyer_name}
                            </p>
                          </td>
                          <td className="td-actions text-right">
                            <span style={{color:"#32CD32"}}>{((saleItem.items).reduce((accumulator,current) => accumulator + current.price, 0)).toLocaleString()} </span>
                          </td>
                        </tr>
                        </>
                    )}
                    </tbody>
                  </Table>
                :
                <div style={{color: "#39B54A", textAlign: "center",padding:"20px"}}> 
                  {/* <RiCreativeCommonsZeroFill size={200} /><br /> */}
                  <CardTitle tag="h4">Nothing To Show Yet... Make Some Sales to See Data</CardTitle>
                  
                </div>  
                }
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Top Sales This Month</CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                   
                    {/* <tr>
                      <td>Dakota Rice</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                      <td className="text-center">$36,738</td>
                    </tr>*/}
                  </tbody>  
                  
                </Table>Coming Soon
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;