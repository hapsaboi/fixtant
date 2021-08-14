import React, {useState,useEffect} from "react";
import axios from 'axios';
import { sale } from '../data/api';
import dateFormat from 'dateformat';
import parse from 'html-react-parser';
import Notifications from "components/Notification/Notification";


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

  useEffect(
		() => {
			async function fetchSales() {
				await axios.get(sale.showSales).then((response)=>{
					if(response.data.status===true){
            if(response.data.data.length>0){
                setSales((response.data.data).sort((a, b) => new Date(b.date) - new Date(a.date)))
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
          row[column]
            .toString()
            .toLowerCase()
            .indexOf(q.toLowerCase()) > -1,
      ),
    );
  }
  const result = sales.map(({_id,buyer_name,phone,payment_method,date,items}) => ({_id,buyer_name,phone,payment_method,date,items}));
  const columns = result[0] && Object.keys(result[0]);

  return (
    <>
      {notificationStatus === true ? <Notifications details={notificationDetails}  />:null}
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Sales Record</CardTitle>
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
                    {search(result).map((saleItem,key) => 
                        <tr key={key}>
                          <td>
                            Date: {parse(dateFormat(saleItem.date, " h:MM:ss TT, dddd, mmmm dS, yyyy").bold())}
                            <br />
                            Buyer: {saleItem.buyer_name}
                            <br/>
                            {
                            saleItem.items.map((item,key) => 
                              <>
                              {item.product_name} - {item.variation}
                                    <br />
                              </>
                            )
                            }
                          </td>
                          <td>
                            {(saleItem.items).reduce((accumulator,current) => accumulator + current.price, 0)}
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
                                  <CardTitle tag="h4"> Buyer Name: {currentSale.buyer_name}</CardTitle>
                                  <CardTitle tag="h4"> Phone: {currentSale.phone}</CardTitle>
                                  Address: {currentSale.address} <br />
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
                              <th className="text-center">Price</th>
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
                              <td className="text-center">
                                {item.price}
                              </td>
                            </tr>
                            ))}
                          
                          </tbody>
                        </Table>
                        <div style={{textAlign:"left:"}}>
                              Payment Method: {currentSale.payment_method}<br />
                              Total: {(currentSale.items).reduce((accumulator,current) => accumulator + current.price, 0)}
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

export default ShowSales;