import React,{useState, useEffect} from "react";
import { sale,product } from '../data/api';
import axios from 'axios';
import Notifications from "components/Notification/Notification";
import 'boxicons';

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
    const [buyerDetail, setBuyerDetail] = useState({});
    
    const [cart, setCart] = useState([]);
    const [notificationStatus, setNotificationStatus] = useState(false)
    const [notificationDetails, setNotificationDetails] = useState({msg:"",type:""});
    
    const [loading, setLoading] = useState(true);

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
      console.log(currentProduct);
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
        setCart([...cart,cartItem]);
        setCurrentProduct({...currentProduct,toBuy:1});
        setSellingPrice(0);
      
        setNotificationDetails({msg:"Item Added to Cart Successfully", type:"success"});
        setNotificationStatus(true);
      }else{
        setNotificationDetails({msg:"Not Enough Items on Stock", type:"danger"});
        setNotificationStatus(true);
      }
    }

    const handleRemoveItem = (e) => {
      setCart(cart.filter(item => item.product_id !==  e));
      setNotificationDetails({msg:"Item Removed From Cart Successfully", type:"success"});
      setNotificationStatus(true);
    };

    async function addSale () {
      const saleData = {...{...buyerDetail, items:cart}};
      await axios.post(sale.addSale, saleData).then((res)=>{
        if(res.data.status){
          setNotificationDetails({msg:"Sale Successful", type:"success"});
        }
        else{
          setNotificationDetails({msg:"Sale Unsuccessful, Please Refresh and Try Again!", type:"Danger"});
        }
        setNotificationStatus(true);
      });
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
          <Col md="8">
            {!sellDetailsMode ? 
              <Card>
              <CardHeader>
                <CardTitle  className='pull-left' tag="h4">Products</CardTitle>
                <FormGroup className='pull-right'>
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
                                {variation.variation} - {symbol}{variation.selling_price}
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
                        placeholder="POS"
                        type="text"
                        onChange={(e) => setBuyerDetail({...buyerDetail,payment_method:e.target.value})}
                      />
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

                <Button onClick={()=>addSale()} className="btn-fill" color="primary" type="submit">
                  Finalize Sale
                </Button>
              </CardBody>
            </Card>
            }
          </Col>
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
                      src={require("assets/img/salti.png").default}
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
                            <font color="red" size="+2" onClick={()=>handleRemoveItem(cartItem.product_id)} style={{verticalAlign:"middle", cursor:"pointer"}}>x</font>  
                          </td>
                        </tr>
                        )
                      }
                    </tbody>
                  </Table>
                </div>
              </CardBody>
              <CardFooter>
                <Button onClick={()=>setSellDetailsMode(!sellDetailsMode)} className="btn-fill" style={{width:"100%"}} color="primary" type="submit">
                  {!sellDetailsMode?"Proceed":"Show Products"}
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="12">
            <Card className="card-user">
              {loading === false
                ? 
                (
                  [currentProduct.variations[currentProduct.key]].map((cP,key) => 
                    <CardBody key={key}>
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
                                    Selling Price: {currentProduct.variations[currentProduct.key].selling_price}
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
                            <tr>
                              <td>
                                Sell for a different Price: 
                                <Input
                                  placeholder="5"
                                  type="number"
                                  value={selling_price}
                                  onChange={(e) => setSellingPrice(e.target.value)}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                  
                      </div>
                      <Button onClick={()=>addToCart()} className="btn-fill" color="primary" type="submit">
                        Add To Cart
                      </Button>
      
                    </CardBody>
                ))
                : "Loading"
              }
            </Card>
        
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Sale;
