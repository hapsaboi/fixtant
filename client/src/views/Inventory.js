import React, {useState,useEffect} from "react";
import axios from 'axios';
import Notifications from "components/Notification/Notification";
import { product } from '../data/api';
import { FiArrowLeft } from "react-icons/fi";
import empty from '../assets/img/inventory-empty.svg';

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
  FormGroup,
  ButtonGroup
} from "reactstrap";

function Inventory() {
  //let symbol = "₦";
  const lowQuantity = 10;
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});
  const [temp, setTemp] = useState([]);
  const [dataload, setDataLoad] = useState(true);

  const [notificationStatus, setNotificationStatus] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState({msg:"",type:""});
  
  useEffect(
		() => {
			async function fetchProducts() {
				await axios.get(product.showStoreProducts).then((response)=>{
					if(response.data.status===true){
            setProducts(response.data.data);
            setDataLoad(false);
          }
          else{
            setNotificationDetails({msg:"Error Loading Inventory, Please Referesh The Page", type:"danger"});
            setNotificationStatus(true);
            setDataLoad(false);
          }
				})
			}
			fetchProducts();
		},
  []);

  async function updateInventory () {
    var new_variation=[]; 
    async function start(){
      new_variation = JSON.parse(JSON.stringify(temp));
      new_variation.forEach((variationItem,index)=>{   
        console.log(variationItem.quantity+" "+index);  
        variationItem.quantity+=currentProduct.variations[index].quantity;
      });
      
      setCurrentProduct({...currentProduct, variations:new_variation});

      return ({...currentProduct, variations:new_variation});
    }
    start().then((response)=>{

      axios.patch(product.updateInventory,response).then((res)=>{
        if(res.data.status){
          setNotificationDetails({msg:"Product Restocked Successfully", type:"success", change:res.data.change});
        }
        else{
          setNotificationDetails({msg:"Error Restocking Product", type:"danger"});
        }
        setNotificationStatus(true);
      })
    });
   
	}
  const [loading, setLoading] = useState(true);


  function selectProduct (id,key) {
    async function select(){
      setCurrentProduct((products.filter(item => item._id === id))[0]);
      return (products[key].variations);
    }
    select().then((response)=>{
      var new_variation=[]; 
      new_variation = JSON.parse(JSON.stringify(response));

      new_variation.forEach((tempItem)=>{
        tempItem.quantity = 0;
      });    
      setTemp(new_variation); 
    })


    setLoading(false);
	}

  function changeVariationData (id,value,type) {
    var new_variation=[]; 
    new_variation = JSON.parse(JSON.stringify(temp));
    switch(type) {
      case "quantity":
        new_variation[id].quantity = Number(value);
        break;
      default:
        // code block
    }
    setTemp(new_variation);
	}

  const [q, setQ] = useState('');
  const [searchColumns, setSearchColumns] = useState([
    'product_name',
    'brand',
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

  const result = products.map(({_id,product_name,brand,variations}) => ({_id,product_name,brand,variations}));
  const columns = result[0] && Object.keys(result[0]);
  return (
   
    <>
      {notificationStatus?<Notifications details={notificationDetails} />:null}
      <div className="content">
        <Row>
          <Col md="12">
            {loading === true ?
            <Card>
              <CardHeader>
                <CardTitle  className='pull-left' tag="h4">Inventory</CardTitle>
                <FormGroup style={{width:"100%"}} className='pull-right'>
                  <Input
                    placeholder="Search based on checked items"
                    type='text'
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </FormGroup>
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
                
              {dataload===false?
                <>
                {products.length > 0?
                <CardBody>
                  <Table className="tablesorter" responsive style={{overflow:"unset"}}>
                    <thead className="text-primary">
                      <tr>
                        <th>Product Name</th>
                        <th>Variations - Quantity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {search(result).map((productItem,key) => 
                          <tr key={key}>
                            <td>{productItem.product_name}</td>
                            <td> 
                              {productItem.variations.map((variation,key)=>(
                                <div key={key}>{variation.variation}: {variation.quantity} 
                                  <div style={{float:"right", backgroundColor: variation.quantity>lowQuantity ? "green" : "red", width:"20px", height:"15px"}}></div>
                                </div>
                              ))}
                            
                            </td>
                            <td>
                              <div>
                                <Button onClick={()=> selectProduct(productItem._id,key)} className="btn-fill" style={{marginBottom:"5px"}} color="primary" type="submit">
                                  Show Inventory
                                </Button>
                              </div>
                            </td>
                          </tr>
                      )}
                    </tbody>
                  </Table>
                </CardBody>
                :
                <div style={{textAlign: "center",padding:"20px"}}> 
                  <img src={empty} style={{marginBottom:"30px"}} height="250px"  alt="Nothing to show yet"/><br />
                  <CardTitle tag="h4"> Nothing To Show Yet... Add some products to the system in order to manage invenotry</CardTitle>
                </div>  
                }
                </>
              :
              "Loading"
              }
            </Card>
            :
              <Button style={{width:"100%",marginBottom:'15px'}} onClick={()=>setLoading(!loading)} className="btn-fill" color="primary">
                <FiArrowLeft size={20} /> <font style={{paddingLeft:"30px"}}>Back To Inventory </font>
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
      
                        <Table className="tablesorter" responsive>
                          <thead className="text-primary">
                            <tr>
                              <th>Item</th>
                              <th>Detail</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Product Name</td>
                              <td><h5 className="title"> {currentProduct.product_name} </h5></td>
                            </tr>
                           <tr>
                              <td>Brand Name</td>
                              <td><h5 className="title"> {currentProduct.brand} </h5></td>
                            </tr>
                            <tr>
                              <td>Product Description</td>
                              <td><h5 className="title"> {currentProduct.product_desc} </h5></td>
                            </tr>
                          
                          </tbody>
                        </Table>
                        <hr />
                        <Table className="tablesorter" responsive>
                          <thead className="text-primary">
                            <tr>
                              <th>Variations</th>
                              <th>Quantity</th>
                              <th>Restock</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentProduct.variations.map((variationItem,key)=>(
                            <tr key={key}>
                              <td>
                                <Col className="pr-md-1" md="12">
                                  <FormGroup>
                                    Variation : {variationItem.variation} <br/>
                                    Model: {variationItem.model} <br/>
                                    Buying Price: {variationItem.buying_price.toLocaleString()} <br/>
                                    Selling Price: {variationItem.selling_price.toLocaleString()}
                                  </FormGroup>
                                </Col>
                              </td>
                                
                              <td>
                                <Col md="12">
                                  <label>Quantity</label>
                                  <Input
                                    placeholder="1234"
                                    type="text"
                                    disabled
                                    value={variationItem.quantity}
                                  />
                                </Col>                   
                              </td>
                              <td>
                                <Col md="12">
                                  <label>Addition</label>
                                  <Input
                                    placeholder="5"
                                    type="number"
                                    defaultValue={0}
                                    onChange={(e) => changeVariationData(key,e.target.value,'quantity')}
                                  />
                                </Col>
                              </td>
                            </tr>
                            ))}
                          
                          </tbody>
                        </Table>
                  
                      </div>
                      <Button onClick={()=>updateInventory()} className="btn-fill" color="primary" type="submit">
                        Update Inventory
                      </Button>
      
                    </CardBody>
                  )
                : "------------------------"
              }
            </Card>
        
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Inventory;
