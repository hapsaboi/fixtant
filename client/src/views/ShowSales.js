import React, {useState,useEffect} from "react";
import axios from 'axios';
import { sale } from '../data/api';
import dateFormat from 'dateformat';
import parse from 'html-react-parser';
import Notifications from "components/Notification/Notification";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "contexts/AuthContext";
import DateRange from "components/DateRange/DateRange";

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

function ShowSales() {
  const [sales, setSales] = useState([]);
  const [currentSale, setCurrentSale] = useState({});
  const [notificationStatus, setNotificationStatus] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState({msg:"",type:""});
  const { userDetail } = useAuth();

  useEffect(
		() => {
			async function fetchSales() {
        let data = {params:{}};
        let id;
        if (userDetail.type === 'staff') { 
          id = userDetail.store;
          data = {params:{staffid:userDetail._id }};
        } else {
          id = userDetail._id;
        }
        
        data.params.type='sale';
        
				await axios.get(sale.showSales+'/'+id,data).then((response)=>{
					if(response.data.status===true){
            if(response.data.data.length>0){
                setSales((response.data.data));
            }; 
          }
          else{
            setNotificationDetails({msg:"Error Loading Products, Please Referesh The Page", type:"danger"});
            setNotificationStatus(true);
          }
        })
      }
			fetchSales();
		},
        // eslint-disable-next-line 
  []);

  const [loading, setLoading] = useState(true);


  function selectSale (id) {
    setCurrentSale((sales.filter(item => item._id === id))[0]);
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
        (" " + row[column])
            .toString()
            .toLowerCase()
            .indexOf(q.toLowerCase()) > -1,
      ),
    );
  }
  const result = sales.map(({_id,buyer_name,phone,payment_method,date,items,sold_by}) => ({_id,buyer_name,phone,payment_method,date,items,sold_by}));
  const columns = result[0] && Object.keys(result[0]);

  return (
    <>
      {notificationStatus === true ? <Notifications details={notificationDetails}  />:null}
      <div className="content">
        <Row>
          <Col md="12">
            {loading === true ?
            <Card>
              <CardHeader >
                <CardTitle tag="h4">Sales Record</CardTitle>
                {/* <DateRange /> */}
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
                        key={key}
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
                    {search(result).map((saleItem,key) => 
                        <tr key={key}>
                          <td>
                            Date: {parse(dateFormat(saleItem.date, " h:MM:ss TT, dddd, mmmm dS, yyyy").bold())}
                            <br />
                            <div>{saleItem.buyer_name ? "Buyer: " + saleItem.buyer_name: null }</div>
                            {
                            saleItem.items.map((item,key) => 
                            <div key={key}>
                              {item.product_name ? item.product_name : null }  {item.variation ? "-" + item.variation: null }
                            </div>
                            )
                            
                            }
                            Paid -  {(saleItem.payment_method)}<br />
                            {saleItem.sold_by.name?"Sold By -  "+saleItem.sold_by.name:null}
                          </td>
                          <td>
                            {((saleItem.items).reduce((accumulator,current) => accumulator + (current.price*current.quantity), 0)).toLocaleString()} 
                          </td>
                          <td>
                            <Button onClick={()=> selectSale(saleItem._id)} className="btn-fill" style={{marginBottom:"5px"}} color="primary" type="submit">
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
              <FiArrowLeft size={20} /> <font style={{paddingLeft:"30px"}}>Back To Sales </font>
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
                                <CardTitle tag="h4">{currentSale.buyer_name ? "Buyer Name: "+currentSale.buyer_name:null }</CardTitle>                                  
                                  <CardTitle tag="h4">{currentSale.phone ? "Phone: "+currentSale.phone:null }</CardTitle>
                                  {currentSale.address ? "Address: "+currentSale.address:null } <br />
                                  Date: {parse(dateFormat(currentSale.date, " h:MM:ss TT, dddd, mmmm dS, yyyy").bold())}
                                </div>
                              </CardHeader>
                               
                            </Col>
                           
                          </Row>
                        </div>
                        <Table className="tablesorter" responsive>
                          <thead className="text-primary">
                            <tr>
                              <th>Products</th>
                              <th className="text-center">Quantity</th>
                              <th className="text-center">Unit Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentSale.items.map((item,key)=>(
                            <tr key={key}>
                              <td>
                              <Row>
                                  <Col className="pr-md-12" md="6">
                                    {item.product_name} - {item.variation} 
                                    <br />
                                  </Col>
                                  
                                </Row>
                              </td>
                              <td style={{textAlign:'center'}}>
                                {item.quantity}
                              </td>
                              <td className="text-center">
                                {(item.price).toLocaleString()}
                              </td>
                            </tr>
                            ))}
                          
                          </tbody>
                        </Table>
                        <div style={{textAlign:"left:"}}>
                              Payment Method: {currentSale.payment_method}<br />
                              {/* Quantity Sold: {currentSale.}<br /> */}
                              Total: {(currentSale.items).reduce((accumulator,current) => accumulator + (current.price*current.quantity), 0)}<br />
                              {currentSale.sold_by.name?"Sold By -  "+currentSale.sold_by.name:null}
                        </div>
                  
                      </div>
                      <Button disabled className="btn-fill" color="primary" type="submit">
                        Initiate Item Return
                      </Button>
      
                    </CardBody>
                  )
                : null
              }
            </Card>
        
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ShowSales;