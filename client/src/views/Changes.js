import React, {useState,useEffect} from "react";
import axios from 'axios';
import { changes } from '../data/api';
import { FaTrashAlt } from 'react-icons/fa';
import dateFormat from 'dateformat';
import parse from 'html-react-parser';
import Notifications from "components/Notification/Notification";



// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  CardText,
  Input, 
  FormGroup
} from "reactstrap";

function Changes() {
  const [change, setChange] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});

  const [notificationStatus, setNotificationStatus] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState({msg:"",type:""});

  useEffect(
		() => {
      //{params:{store}} for get request
			async function fetchChanges() {
				await axios.get(changes.showChanges).then((response)=>{
					if(response.data.status===true){
            if(response.data.data.length>0){
              setChange((response.data.data[0].data).sort((a, b) => new Date(b.date) - new Date(a.date)))
            }; 
          }
          else{
            setNotificationDetails({msg:"Error Loading Changes, Please Referesh The Page", type:"danger"});
            setNotificationStatus(true);
          }
				})
			}
			fetchChanges();
		},
  []);

  const loading = true ;


  // function selectProduct (id) {
  //   setCurrentProduct((change.filter(item => item._id === id))[0]);
  //   setLoading(false);
	// }
   

  return (
   
    <>
      {notificationStatus === true ? <Notifications details={notificationDetails}  />:null}
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Track Changes</CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive style={{overflow:"unset"}}>
                  <thead className="text-primary">
                    <tr>
                      <th>Change</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {change.map((changeItem,key) => 
                        <tr key={key}>
                          <td>
                            Date: {parse(dateFormat(changeItem.date, " h:MM:ss TT, dddd, mmmm dS, yyyy").bold())}
                            <br />
                            {parse(changeItem.message)}
                          </td>
                          <td>{changeItem.type}</td>
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
                      <div className="author">
                        <div className="block block-one" />
                        <div className="block block-two" />
                        <div className="block block-three" />
                        <div className="block block-four" />
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          <img
                            alt="..."
                            className="avatar"
                            src={require("assets/img/product.png").default}
                          />
                          <Row>
                            <Col className="pr-md-1" md="6">
                              <FormGroup>
                                <label>Product Name</label>
                                <Input
                                  placeholder="Tecno Camon CX"
                                  type="text"
                                  value={currentProduct.product_name}
                                  onChange={(e) => setCurrentProduct({...currentProduct, product_name:e.target.value})}
                                />
                              </FormGroup>
                            </Col>
                            <Col className="pl-md-1" md="6">
                              <FormGroup>
                                <label>Brand</label>
                                <Input
                                  placeholder="Tecno"
                                  type="text"
                                  value={currentProduct.brand}
                                  onChange={(e) => setCurrentProduct({...currentProduct, brand:e.target.value})}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label>Description</label>
                                <Input
                                  cols="80"
                                  placeholder="This production is a ..."
                                  rows="4"
                                  type="textarea"
                                  value={currentProduct.product_desc}
                                  onChange={(e) => setCurrentProduct({...currentProduct, product_desc:e.target.value})}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </a>
                      </div>
                      <div className="card-description">
      
                        <Table className="tablesorter" responsive>
                          <thead className="text-primary">
                            <tr>
                              <th>Variations</th>
                              <th className="text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentProduct.variations.map((variationItem,key)=>(
                            <tr key={key}>
                              <td>
                              <Row>
                                  <Col className="pr-md-1" md="6">
                                    <FormGroup>
                                      <label>Variation</label>
                                      <Input
                                        placeholder="Black 64GB"
                                        type="text"
                                        value={variationItem.variation}
                                        
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col className="pl-md-1" md="6">
                                    <FormGroup>
                                      <label>Model</label>
                                      <Input
                                        placeholder="1234"
                                        type="text"
                                        value={variationItem.model}
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>                         
                                <Row>
                                  <Col className="pr-md-1" md="6">
                                    <FormGroup>
                                      <label>Buying Price</label>
                                      <Input
                                        placeholder="10,000"
                                        type="number"
                                        value={variationItem.buying_price}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col className="pl-md-1" md="6">
                                    <FormGroup>
                                      <label>Selling Price</label>
                                      <Input
                                        placeholder="10,000"
                                        type="number"
                                        value={variationItem.selling_price}
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </td>
                              <td style={{cursor:"pointer"}} className="text-center">
                                <FaTrashAlt  color='red' />
                              </td>
                            </tr>
                            ))}
                          
                          </tbody>
                        </Table>
                  
                      </div>
                      <Button  className="btn-fill" color="primary" type="submit">
                        Update Product
                      </Button>
      
                    </CardBody>
                  )
                : ""
              }
            </Card>
        
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Changes;
