import React,{useState, useEffect} from "react";
import { sale,product } from '../data/api';
import axios from 'axios';
import Notifications from "components/Notification/Notification";
import 'boxicons';
import { FiArrowLeft } from "react-icons/fi";
import LoadingOverlay from 'react-loading-overlay';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,CardTitle,
  CardBody,
  CardFooter,
  CardText,
  Row,
  Col,
  Table,
  Input,FormGroup,ButtonGroup
} from "reactstrap";

function Sale() {
    let symbol = "₦";
    const [products, setProducts ] = useState([]);      
    const [currentProduct, setCurrentProduct] = useState({});
    const [selling_price, setSellingPrice] = useState(0);
    const [sellDetailsMode, setSellDetailsMode] = useState(false);
    const [buyerDetail, setBuyerDetail] = useState({buyer_name:"",phone:"",payment_method:"Cash",address:""});
    
    const [cart, setCart] = useState([]);
    const [notificationStatus, setNotificationStatus] = useState(false)
    const [notificationDetails, setNotificationDetails] = useState({msg:"",type:""});
    
    const [loading, setLoading] = useState(true);
    const [requestLoading, setRequestLoading] = useState(false);

    useEffect(
      () => {
        async function fetchProducts() {
          await axios.get(product.showStoreProducts).then((response)=>{
            if(response.data.status===true){setProducts(response.data.data);}
            else{
              setNotificationDetails({msg:"Error Loading Products, Please Referesh The Page", type:"danger"});
              setNotificationStatus(true);
            }
          })
        }
        fetchProducts();
      },
    []);
    
    function selectProduct (id,key) {
      setLoading(true);
      let sP = (products.filter(item => item._id === id))[0];
      sP.key = key;
      setCurrentProduct({...sP, selling_price:0});
      setLoading(false);
    }    

    function addToCart () {

      let temp = currentProduct;
      let toBuy = temp.toBuy ? temp.toBuy : 1;

      if(toBuy <= temp.variations[temp.key].quantity){  
        let cartItem = {
          product_id:temp._id,
          product_name:temp.product_name,
          quantity:toBuy,
          variation: temp.variations[temp.key].variation,
          price: selling_price > 0 ? selling_price: temp.variations[temp.key].selling_price
        };
        const found = (cart.findIndex(x => x.variation ===cartItem.variation && x.product_id===cartItem.product_id));
        
        //checking if item already exist in cart
        if(found>-1){
          let newCart = [...cart]; 
          newCart[found].quantity = cartItem.quantity;
          newCart[found].price = cartItem.price;
          setCart(newCart);

          setNotificationDetails({msg:"Item already already exist in cart, updated with new quantity", type:"info"});
          setNotificationStatus(true);
        }else{
          setCart([...cart,cartItem]);
          setCurrentProduct({...currentProduct,toBuy:1});

          setNotificationDetails({msg:"Item Added to Cart Successfully", type:"success"});
          setNotificationStatus(true);
        }
        
        setSellingPrice(0);
      }else{
        setNotificationDetails({msg:"Not Enough Items on Stock", type:"danger"});
        setNotificationStatus(true);
      }

    }

    const handleRemoveItem = (id,variation) => {
      setCart(cart.filter(item =>  !variartionCheck(item,variation,id)));

      setNotificationDetails({msg:"Item Removed From Cart Successfully", type:"success"});
      setNotificationStatus(true);
    };

    const variartionCheck = (item, variation,id) =>{
      if(id === item.product_id){
        console.log((item.variation === variation));
        return (item.variation === variation);
      }       
      else{
        return false;
      } 
    }

    async function addSale ({details}) {
      setRequestLoading(true);
      console.log(buyerDetail.buyer_name);
      if(cart.length>0){
        if((buyerDetail.buyer_name==="" || buyerDetail.phone==="" || buyerDetail.buyer_address==="" || buyerDetail.payment_method==="") && details===true){
          setNotificationDetails({msg:"Some Buyer Fields are Empty", type:"danger"});
          setNotificationStatus(true);
        }else{
          let saleData;
          if(details===true){
            saleData = {...{...buyerDetail, items:cart}, type:"sale"};
          }else{
            saleData = {...{items:cart, payment_method:`${buyerDetail.payment_method}`}, type:"sale"};
          }
          await axios.post(sale.addSale, saleData).then((res)=>{
            if(res.data.status){
              setNotificationDetails({msg:"Sale Successful", type:"success"});
              setCart([]);
            }
            else{
              setNotificationDetails({msg:"Sale Unsuccessful, Please Refresh and Try Again!", type:"danger"});
            }
            setNotificationStatus(true);
          }).catch(function (error) {
            if (error.response) {
              // Request made and server responded
              setNotificationDetails({msg:error.response.data.message, type:"danger"});
            }
          });
        }
      }else{
        setNotificationDetails({msg:"Sale Unsuccessful, Cart is Empty!", type:"danger"});
        setNotificationStatus(true);
      }
      setRequestLoading(false);
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
      {notificationStatus === true ? <Notifications details={notificationDetails}  />:null}
      <div className="content">
        <Row>
          {loading === true ?
          <Col md="8">
            <LoadingOverlay active={requestLoading} spinner text='Loading your request...'>
            {!sellDetailsMode ? 
            <Card>
              <CardHeader>
                <CardTitle  className='pull-left' tag="h4">Products</CardTitle>
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
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Product</th>
                      <th>Brand</th>
                      <th>Variation - Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {search(result).map((productItem,key) => 
                        <tr key={key}>
                          <td>{productItem.product_name}</td>
                          <td>{productItem.brand}</td>
                          <td>
                          {(productItem.variations).map((variation,key) => 
                            <div key={key}>
                              <Button onClick={()=> selectProduct(productItem._id,key)} className="btn-fill" disabled={variation.quantity>0 ? false: true} style={{marginBottom:"5px", width:"100%"}} color="primary" type="submit">
                                {variation.variation} - {symbol}{variation.selling_price.toLocaleString()}
                              </Button>
                            </div>
                          )}
                          </td>
                        </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
            :
            // inserting user data
            <Card>
              <CardHeader>
                <h5 className="title">Customer Details</h5>
              </CardHeader>
              <CardBody>
              <Row>
                  <Col className="pr-md-1" md="6">
                    <FormGroup>
                      <label>Buyer Name</label>
                      <Input
                        placeholder="Umar Joseph"
                        type="text"
                        onChange={(e) => setBuyerDetail({...buyerDetail,buyer_name:e.target.value})}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pl-md-1" md="6">
                    <FormGroup>
                      <label>Phone Number</label>
                      <Input
                        placeholder="090********"
                        type="text"
                        onChange={(e) => setBuyerDetail({...buyerDetail,phone:e.target.value})}
                      />
                    </FormGroup>
                  </Col>

                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Payment Method</label>
                      <Input
                        type="select"
                        defaultValue="Cash"
                        onChange={(e) => setBuyerDetail({...buyerDetail,payment_method:e.target.value})}
                      >
                        <option>Cash</option>
                        <option>POS</option>
                        <option>Bank Transfer</option>
                        <option>Others</option>
                      </Input>
                    </FormGroup>
                  </Col> 
                </Row>

                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Address</label>
                      <Input
                        cols="80"
                        placeholder="No X Jimeta Yola, Adamawa State"
                        rows="4"
                        type="textarea"
                        onChange={(e) => setBuyerDetail({...buyerDetail,address:e.target.value})}
                      />
                    </FormGroup>
                  </Col>
                  
                </Row>
                <Row style={{paddingLeft:"15px"}}>
                  <Button onClick={()=>addSale({details:true})} className="btn-fill " color="primary" type="submit">
                    Finalize Sale
                  </Button>
                  <Button onClick={()=>addSale({details:false})} className="btn-fill" color="primary" type="submit">
                    Finalize Without Buyer Details
                  </Button>
                </Row>
              </CardBody>
            </Card>
            
            }</LoadingOverlay>
          </Col>
          :
          <Button style={{width:"100%",marginBottom:'15px'}} onClick={()=>{setLoading(!loading); setSellDetailsMode(false)}} className="btn-fill" color="primary">
            <FiArrowLeft size={20} /> <font style={{paddingLeft:"30px"}}>Back To Products </font>
          </Button>
          }
          <Col md="4">
            <Card className="card-user">
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
                    <h5 className="title"><box-icon style={{verticalAlign:"middle"}} color="white" name="cart-alt" /> Cart Items </h5>
                  </a>
                </div>
                <div className="card-description">
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((cartItem,key) => 
                        <tr key={key}>
                          <td>{cartItem.product_name}</td>
                          <td className="text-center">{cartItem.quantity}</td>
                          <td className="text-center">{cartItem.price}</td>
                          <td className="text-center">
                            <font color="red" size="+2" onClick={()=>handleRemoveItem(cartItem.product_id,cartItem.variation)} style={{verticalAlign:"middle", cursor:"pointer"}}>x</font>  
                          </td>
                        </tr>
                        )
                      }
                    </tbody>
                  </Table>
                </div>
              </CardBody>
              <CardFooter>
                <Button onClick={()=>{setSellDetailsMode(!sellDetailsMode); setLoading(true)}} className="btn-fill" style={{width:"100%"}} color="primary" type="submit">
                  {!sellDetailsMode?"Proceed":"Show Products"}
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="8">
            <Card className="card-user">
              {loading === false? 
                (
                  [currentProduct.variations[currentProduct.key]].map((cP,key) => 
                    <CardBody key={key}>
                      <CardText />
                      <div className="row">
                        <div className="pull-left col-6"> 
                          <Button onClick={()=>addToCart()} className="btn-fill" style={{width:"100%",marginTop:"15px"}} color="primary" type="submit">
                            Add To Cart
                          </Button><hr />
                        </div>
                        <div className="pull-right col-6"> 
                          <h6 className="title">Sell for a different Price: </h6>
                          <Input
                            placeholder="5"
                            type="number"
                            value={selling_price}
                            onChange={(e) => setSellingPrice(e.target.value)}
                          />
                        </div>
                      </div>
                      
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
                              <th>Variation</th>
                              <th>Quantity</th>
                              <th>Sell</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <Col className="pr-md-1" md="12">
                                  <FormGroup>
                                    Variation : {currentProduct.variations[currentProduct.key].variation} <br/>
                                    Model: {currentProduct.variations[currentProduct.key].model} <br/>
                                    Selling Price: {currentProduct.variations[currentProduct.key].selling_price.toLocaleString()}
                                  </FormGroup>
                                </Col>
                              </td>
                                
                              <td>
                                  Available Quantity: {currentProduct.variations[currentProduct.key].quantity}
                
                              </td>
                              <td>
                                <Col md="12">
                                  <label>Quantity to Sell: </label>
                                  <Input
                                    placeholder="5"
                                    type="number"
                                    value={currentProduct.toBuy ? currentProduct.toBuy:1}
                                    onChange={(e) => setCurrentProduct({...currentProduct,toBuy:e.target.value})}
                                  />
                                </Col>
                              </td>
                            </tr>
                           
                          </tbody>
                        </Table>
                  
                      </div>
      
                    </CardBody>
                ))
                : ""
              }
            </Card>
        
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Sale;
