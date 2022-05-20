import React, { useState, useEffect } from "react";
import { service, sale } from '../data/api';
import axios from 'axios';
import Notifications from "components/Notification/Notification";
import 'boxicons';
import { FiArrowLeft } from "react-icons/fi";
import LoadingOverlay from 'react-loading-overlay';
import { useAuth } from "contexts/AuthContext";


// reactstrap components
import {
  Button,
  Card,
  CardHeader, CardTitle,
  CardBody,
  CardFooter,
  CardText,
  Row,
  Col,
  Table,
  Input, FormGroup, ButtonGroup
} from "reactstrap";

function SaleService() {
  let symbol = "₦";
  const [services, setServices] = useState([]);
  const [currentService, setCurrentService] = useState({});
  const [price, setPrice] = useState(0);
  const [sellDetailsMode, setSellDetailsMode] = useState(false);
  const [buyerDetail, setBuyerDetail] = useState({ buyer_name: "", phone: "", payment_method: "Cash", address: "" });
  const { userDetail } = useAuth();

  const [cart, setCart] = useState([]);
  const [notificationStatus, setNotificationStatus] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState({ msg: "", type: "" });

  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(
    () => {
      async function fetchServices() {
        let id;
        if (userDetail.type === 'staff') { id = userDetail.store } else {
          id = userDetail._id;
        }
        await axios.get(service.showStoreServices + "/" + id).then((response) => {
          if (response.data.status === true) { setServices(response.data.data); }
          else {
            setNotificationDetails({ msg: "Error Loading Services, Please Referesh The Page", type: "danger" });
            setNotificationStatus(true);
          }
        })
      }
      fetchServices();
    },
    // eslint-disable-next-line 
    []);

  function selectService(id) {
    setLoading(true);
    let sP = (services.filter(item => item._id === id))[0];
    setCurrentService({ ...sP });
    setLoading(false);
  }

  function addToCart() {

    let temp = currentService;
    let toBuy = temp.toBuy ? temp.toBuy : 1;

    let cartItem = {
      product_id: temp._id,
      product_name: temp.service_name,
      quantity: toBuy,
      price: price > 0 ? price : temp.price
    };
    const found = (cart.findIndex(x => x.product_id === cartItem.product_id));

    //checking if item already exist in cart
    if (found > -1) {
      let newCart = [...cart];
      newCart[found].quantity = cartItem.quantity;
      newCart[found].price = cartItem.price;
      setCart(newCart);

      setNotificationDetails({ msg: "Item already already exist in cart, updated with new quantity", type: "info" });
      setNotificationStatus(true);
    } else {
      setCart([...cart, cartItem]);
      setCurrentService({ ...currentService, toBuy: 1 });

      setNotificationDetails({ msg: "Item Added to Cart Successfully", type: "success" });
      setNotificationStatus(true);
    }

    setPrice(0);
  }


  const handleRemoveItem = (id) => {
    setCart(cart.filter(item => !(id === item.product_id)));

    setNotificationDetails({ msg: "Item Removed From Cart Successfully", type: "success" });
    setNotificationStatus(true);
  };


  async function addSale({ details }) {
    setRequestLoading(true);
    let id;
    if (userDetail.type === 'staff') { id = userDetail.store } else {
      id = userDetail._id;
    }
    let sold_by = {id:userDetail._id,name:userDetail.name};

    if (cart.length > 0) {
      if ((buyerDetail.buyer_name === "" || buyerDetail.phone === "" || buyerDetail.buyer_address === "" || buyerDetail.payment_method === "") && details === true) {
        setNotificationDetails({ msg: "Some Buyer Fields are Empty", type: "danger" });
        setNotificationStatus(true);
      } else {
        const saleData = { ...{ ...buyerDetail, items: cart, type: "service" } };
        await axios.post(sale.addSale+"/"+id, {...saleData, sold_by}).then((res) => {
          if (res.data.status) {
            setNotificationDetails({ msg: "Sale Successful", type: "success" });
            setCart([]);
          }
          else {
            setNotificationDetails({ msg: "Sale Unsuccessful, Please Refresh and Try Again!", type: "Danger" });
          }
          setNotificationStatus(true);
        }).catch(function (error) {
          if (error.response) {
            // Request made and server responded
            setNotificationDetails({ msg: error.response.data.message, type: "danger" });
          }
        });
      }
    }
    else {
      setNotificationDetails({ msg: "Sale Unsuccessful, Cart is Empty!", type: "danger" });
      setNotificationStatus(true);
    }
    setRequestLoading(false);
  }


  const [q, setQ] = useState('');
  const [searchColumns, setSearchColumns] = useState([
    'service_name',
    'price',
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
  const result = services.map(({ _id, service_name, price }) => ({ _id, service_name, price }));
  const columns = result[0] && Object.keys(result[0]);

  return (
    <>
      {notificationStatus === true ? <Notifications details={notificationDetails} /> : null}
      <div className="content">
        <Row>
          {loading === true ?
            <Col md="8">
              <LoadingOverlay active={requestLoading} spinner text='Loading your request...'>
                {!sellDetailsMode ?
                  <Card>
                    <CardHeader>
                      <CardTitle className='pull-left' tag="h4">Services</CardTitle>
                      <FormGroup style={{ width: "100%" }} className='pull-right'>
                        <Input
                          placeholder="Search based on checked items"
                          type='text'
                          value={q}
                          onChange={(e) => setQ(e.target.value)}
                        />
                      </FormGroup>
                    </CardHeader>
                    <Col sm="12" style={{ overflowX: "auto" }}>
                      <ButtonGroup
                        className="btn-group-toggle float-right"
                        data-toggle="buttons"
                      >
                        {columns &&
                          columns.map((column, key) => (
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
                            <th>Service</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {search(result).map((serviceItem, key) =>
                            <tr key={key}>
                              <td>{serviceItem.service_name}</td>
                              <td>
                                <div>
                                  <Button onClick={() => selectService(serviceItem._id)} className="btn-fill" style={{ marginBottom: "5px", width: "100%" }} color="primary" type="submit">
                                    {symbol}{serviceItem.price.toLocaleString()}
                                  </Button>
                                </div>

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
                              onChange={(e) => setBuyerDetail({ ...buyerDetail, buyer_name: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col className="pl-md-1" md="6">
                          <FormGroup>
                            <label>Phone Number</label>
                            <Input
                              placeholder="090********"
                              type="text"
                              onChange={(e) => setBuyerDetail({ ...buyerDetail, phone: e.target.value })}
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
                              onChange={(e) => setBuyerDetail({ ...buyerDetail, payment_method: e.target.value })}
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
                              onChange={(e) => setBuyerDetail({ ...buyerDetail, address: e.target.value })}
                            />
                          </FormGroup>
                        </Col>

                      </Row>

                      <Row style={{ paddingLeft: "15px" }}>
                        <Button onClick={() => addSale({ details: true })} className="btn-fill " color="primary" type="submit">
                          Finalize Sale
                        </Button>
                        <Button onClick={() => addSale({ details: false })} className="btn-fill" color="primary" type="submit">
                          Finalize Without Buyer Details
                        </Button>
                      </Row>
                    </CardBody>
                  </Card>
                }
              </LoadingOverlay>
            </Col>
            :
            <Button style={{ width: "100%", marginBottom: '15px' }} onClick={() => { setLoading(!loading); setSellDetailsMode(false) }} className="btn-fill" color="primary">
              <FiArrowLeft size={20} /> <font style={{ paddingLeft: "30px" }}>Back To Services </font>
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
                    <h5 className="title"><box-icon style={{ verticalAlign: "middle" }} color="white" name="cart-alt" /> Cart Items </h5>
                  </a>
                </div>
                <div className="card-description">
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Service</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((cartItem, key) =>
                        <tr key={key}>
                          <td>{cartItem.product_name}</td>
                          <td className="text-center">{cartItem.quantity}</td>
                          <td className="text-center">{cartItem.price}</td>
                          <td className="text-center">
                            <font color="red" size="+2" onClick={() => handleRemoveItem(cartItem.product_id)} style={{ verticalAlign: "middle", cursor: "pointer" }}>x</font>
                          </td>
                        </tr>
                      )
                      }
                    </tbody>
                  </Table>
                </div>
              </CardBody>
              <CardFooter>
                <Button onClick={() => { setSellDetailsMode(!sellDetailsMode); setLoading(true) }} className="btn-fill" style={{ width: "100%" }} color="primary" type="submit">
                  {!sellDetailsMode ? "Proceed" : "Show Services"}
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="8">
            <Card className="card-user">
              {loading === false ?
                (
                  [currentService].map((cS, key) =>
                    <CardBody key={key}>
                      <CardText />
                      <div className="row">
                        <div className="pull-left col-6">
                          <Button onClick={() => addToCart()} className="btn-fill" style={{ width: "100%", marginTop: "15px" }} color="primary" type="submit">
                            Add To Cart
                          </Button><hr />
                        </div>
                        <div className="pull-right col-6">
                          <h6 className="title">Sell for a different Price: </h6>
                          <Input
                            placeholder="5"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
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
                              <td>Service Name</td>
                              <td><h5 className="title"> {currentService.service_name} </h5></td>
                            </tr>
                            <tr>
                              <td>Service Price</td>
                              <td><h5 className="title"> {currentService.price} </h5></td>
                            </tr>
                            <tr>
                              <td>Service Description</td>
                              <td><h5 className="title"> {currentService.service_desc} </h5></td>
                            </tr>

                          </tbody>
                        </Table>
                        <hr />
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

export default SaleService;
