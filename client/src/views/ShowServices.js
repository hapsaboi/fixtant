import React, {useState,useEffect} from "react";
import axios from 'axios';
import { sale } from '../data/api';
import dateFormat from 'dateformat';
import parse from 'html-react-parser';
import Notifications from "components/Notification/Notification";
import { FiArrowLeft } from "react-icons/fi";

// reactstrap components
import {
  Input,ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  CardText
} from "reactstrap";

function ShowServices() {
  const [services, setServices] = useState([]);
  const [currentService, setCurrentService] = useState({});
  const [notificationStatus, setNotificationStatus] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState({msg:"",type:""});

  useEffect(
		() => {
			async function fetchServices() {
				await axios.get(sale.showSales, {params:{type:'service'}}).then((response)=>{
		      if(response.data.status===true){
            if(response.data.data.length>0){
                setServices((response.data.data));
            }; 
          }
          else{
            setNotificationDetails({msg:"Error Loading Products, Please Referesh The Page", type:"danger"});
            setNotificationStatus(true);
          }
        })
      }
			fetchServices();
		},
  []);

  const [loading, setLoading] = useState(true);


  function selectService (id) {
    setCurrentService((services.filter(item => item._id === id))[0]);
    setLoading(false);
	}
   
   
  const [q, setQ] = useState('');
  const [searchColumns, setSearchColumns] = useState([
    'buyer_name',
    'phone',
  ]);

  function search(rows) {
    return rows.filter((row) =>
      searchColumns.some(
        (column) =>
          row[column]
            .toString()
            .toLowerCase()
            .indexOf(q.toLowerCase()) > -1,
      ),
    );
  }
  const result = services.map(({_id,buyer_name,phone,payment_method,date,items}) => ({_id,buyer_name,phone,payment_method,date,items}));
  const columns = result[0] && Object.keys(result[0]);

  return (
    <>
      {notificationStatus === true ? <Notifications details={notificationDetails}  />:null}
      <div className="content">
        <Row>
          <Col md="12">
            {loading === true ?
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Services Record</CardTitle>
                <Input
                  placeholder="Search based on checked items"
                  type='text'
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </CardHeader>

              <Col sm="12" style={{overflowX:"auto"}}>
                <ButtonGroup
                  className="btn-group-toggle float-right"
                  data-toggle="buttons"
                >
                  {columns &&
                    columns.map((column,key) => (
                      <Button 
                        tag="label"
                        className="btn-simple"
                        color="info"
                        id={key}
                        size="sm"
                        onClick={() => {
                          const checked = searchColumns.includes(column);
                          setSearchColumns((prev) =>
                            checked
                              ? prev.filter((sc) => sc !== column)
                              : [...prev, column],
                          );
                        }} 
                        active={searchColumns.includes(column)}>{column}
                      </Button>
    
                  ))}
                </ButtonGroup>
              </Col>

              <CardBody>
                <Table className="tablesorter" responsive style={{overflow:"unset"}}>
                  <thead className="text-primary">
                    <tr>
                      <th>Details</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {search(result).map((serviceItem,key) => 
                      <tr key={key}>
                        <td>
                          Date: {parse(dateFormat(serviceItem.date, " h:MM:ss TT, dddd, mmmm dS, yyyy").bold())}
                          <br />
                          <div>{serviceItem.buyer_name ? "Buyer: " + serviceItem.buyer_name: null }</div>
                          {
                          serviceItem.items.map((item,key) => 
                            <div key={key}>
                              {item.product_name ? item.product_name : null }  {item.variation ? "-" + item.variation: null }
                            </div>
                          )
                          
                          }
                          <br />
                          Paid -  {(serviceItem.payment_method)}
                        </td>
                        <td>
                          {((serviceItem.items).reduce((accumulator,current) => accumulator + current.price, 0)).toLocaleString()} 
                        </td>
                        <td>
                          <Button onClick={()=> selectService(serviceItem._id)} className="btn-fill" style={{marginBottom:"5px"}} color="primary" type="submit">
                            Show 
                          </Button>
                          
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
            :
            <Button style={{width:"100%",marginBottom:'15px'}} onClick={()=>setLoading(!loading)} className="btn-fill" color="primary">
              <FiArrowLeft size={20} /> <font style={{paddingLeft:"30px"}}>Back To Services </font>
            </Button>
          }
          </Col>
          <Col md="12">
            <Card className="card-user">
              {loading === false
                ? 
                  (  
                    <CardBody>
                      <CardText />
                      <div className="card-description">
                        <div>
                          <Row>
                            <Col className="pr-md-1" md="12">
                              <CardHeader>
                                
                                <div style={{textAlign:"center"}}>
                                  <CardTitle tag="h4">{currentService.buyer_name ? "Buyer Name: "+currentService.buyer_name:null }</CardTitle>                                  
                                  <CardTitle tag="h4">{currentService.phone ? "Phone: "+currentService.phone:null }</CardTitle>
                                  {currentService.address ? "Address: "+currentService.address:null } <br />
                                  Date: {parse(dateFormat(currentService.date, " h:MM:ss TT, dddd, mmmm dS, yyyy").bold())}
                                </div>
                              </CardHeader>
                               
                            </Col>
                           
                          </Row>
                        </div>
                        <Table className="tablesorter" responsive>
                          <thead className="text-primary">
                            <tr>
                              <th>Products</th>
                              <th className="text-center">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentService.items.map((item,key)=>(
                            <tr key={key}>
                              <td>
                              <Row>
                                  <Col className="pr-md-12" md="6">
                                    {item.product_name} {item.variation ? " - "+item.variation:null }
                                    <br />
                                  </Col>
                                </Row>
                              </td>
                              <td className="text-center">
                                {item.price}
                              </td>
                            </tr>
                            ))}
                          
                          </tbody>
                        </Table>
                        <div style={{textAlign:"left:"}}>
                              Payment Method: {currentService.payment_method}<br />
                              Total: {(currentService.items).reduce((accumulator,current) => accumulator + current.price, 0)}
                        </div>
                  
                      </div>
                      <Button disabled className="btn-fill" color="primary" type="submit">
                        Initiate Item Return
                      </Button>
      
                    </CardBody>
                  )
                : "Loading"
              }
            </Card>
        
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ShowServices;