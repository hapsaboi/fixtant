import React, { useState, useEffect } from "react";
import axios from 'axios';
import { product } from '../data/api';
import { FaTrashAlt } from 'react-icons/fa';
import Notifications from "components/Notification/Notification";
import { FiArrowLeft } from "react-icons/fi";
import empty from '../assets/img/product.svg';
import { Link } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
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

function Products() {
  //let symbol = "₦";
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});

  const [notificationStatus, setNotificationStatus] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState({ msg: "", type: "" });
  const [dataload, setDataLoad] = useState(true);

  const { userDetail } = useAuth();

  useEffect(
    () => {
      async function fetchProducts() {
        await axios.get(product.showStoreProducts + "/" + userDetail._id).then((response) => {
          if (response.data.status === true) {
            setProducts(response.data.data);
            setDataLoad(false);
          }
          else {
            setNotificationDetails({ msg: "Error Loading Products, Please Referesh The Page", type: "danger" });
            setNotificationStatus(true);
            setDataLoad(false);
          }
        })
      }
      fetchProducts();
    },
        // eslint-disable-next-line 
    []);

  const handleRemoveItem = (e) => {
    let new_variation = [];

    new_variation = (currentProduct.variations.filter((item, key) => key !== e));
    setCurrentProduct({ ...currentProduct, variations: new_variation });
    setNotificationDetails({ msg: "Variation removed temporarily, click on 'update product' to finalize update", type: "success" });
    setNotificationStatus(true);
  };

  async function updateProduct() {
    await axios.patch(product.updateProduct, currentProduct).then((res) => {
      if (res.data.status) {
        setNotificationDetails({ msg: "Product Updated Successfully", type: "success", change: res.data.change });
      }
      else {
        setNotificationDetails({ msg: "Error Updating Product", type: "danger" });
      }
      setNotificationStatus(true);
    })
  }

  const [loading, setLoading] = useState(true);


  function selectProduct(id) {
    setCurrentProduct((products.filter(item => item._id === id))[0]);
    setLoading(false);
  }

  function changeVariationData(id, value, type) {
    let new_variation = currentProduct.variations;
    new_variation[id][type] = value;

    setCurrentProduct({ ...currentProduct, variations: new_variation });
  }

  // handle click event of the Add button
  const handleAddClick = () => {
    let new_var = { variation: "" }
    let new_variation = currentProduct.variations;
    new_variation.push(new_var);
    setCurrentProduct({ ...currentProduct, variations: new_variation });
  };

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

  const result = products.map(({ _id, product_name, brand }) => ({ _id, product_name, brand }));
  const columns = result[0] && Object.keys(result[0]);

  return (
    <>
      {notificationStatus ? <Notifications details={notificationDetails} /> : null}
      <div className="content">
        <Row>
          <Col md="12">
            {loading === true ?
              <Card>
                <CardHeader>
                  <CardTitle className='pull-left' tag="h4">Products</CardTitle>
                  <div className="pull-right" style={{ marginBottom: '20px' }}>
                    <Link to="/admin/addproduct">
                      <Button className="btn-fill" style={{ width: "100%" }} color="primary" type="submit">
                        Add Product
                      </Button>
                    </Link>
                  </div>
                  <FormGroup style={{ width: "100%" }} className='pull-right'>
                    <Input
                      placeholder="Search based on checked items"
                      type='text'
                      value={q}
                      onChange={(e) => setQ(e.target.value)}

                    />
                  </FormGroup>
                </CardHeader>

                <Col sm="12">
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
                {dataload === false ?
                  <>
                    {products.length > 0 ?
                      <CardBody>
                        <Table className="tablesorter" responsive style={{ overflow: "unset" }}>
                          <thead className="text-primary">
                            <tr>
                              <th>Product Name</th>
                              <th>Brand</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {search(result).map((row, key) => (
                              <tr key={key}>
                                {columns.map((column, key) => (
                                  <>{key > 0 ? <td key={key}>{row[column]} </td> : null}</>
                                ))}
                                <td>
                                  <div>
                                    <Button onClick={() => selectProduct(row._id)} className="btn-fill" style={{ marginBottom: "5px" }} color="primary" type="submit">
                                      Show
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </CardBody>
                      :
                      <div style={{ color: "#39B54A", textAlign: "center", padding: "20px" }}>
                        <img src={empty} style={{ marginBottom: "30px" }} height="250px" alt="Nothing to show yet" /><br />
                        <CardTitle tag="h4">Nothing To Show Yet... Add Some Products to The System</CardTitle>
                      </div>
                    }
                  </>
                  :
                  "Loading"
                }
              </Card>
              :
              <Button style={{ width: "100%", marginBottom: '15px' }} onClick={() => setLoading(!loading)} className="btn-fill" color="primary">
                <FiArrowLeft size={20} /> <font style={{ paddingLeft: "30px" }}>Back To Products </font>
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
                                onChange={(e) => setCurrentProduct({ ...currentProduct, product_name: e.target.value })}
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
                                onChange={(e) => setCurrentProduct({ ...currentProduct, brand: e.target.value })}
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
                                onChange={(e) => setCurrentProduct({ ...currentProduct, product_desc: e.target.value })}
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
                          {currentProduct.variations.map((variationItem, key) => (
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
                                        onChange={(e) => changeVariationData(key, e.target.value, 'variation')}
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
                                        onChange={(e) => changeVariationData(key, e.target.value, 'model')}
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
                                        onChange={(e) => changeVariationData(key, e.target.value, 'buying_price')}
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
                                        onChange={(e) => changeVariationData(key, e.target.value, 'selling_price')}
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </td>
                              <td style={{ cursor: "pointer" }} className="text-center">
                                <FaTrashAlt onClick={() => handleRemoveItem(key)} color='red' />
                              </td>
                            </tr>
                          ))}

                        </tbody>
                      </Table>

                    </div>
                    <Row>
                      <Col md="6">
                        <Button onClick={() => handleAddClick()} className="btn-fill" style={{ width: "100%" }} color="primary" type="submit">
                          Add Product Variation
                        </Button>
                      </Col>
                      <Col md="6">
                        <Button onClick={() => updateProduct()} className="btn-fill" style={{ width: "100%" }} color="primary" type="submit">
                          Update Product
                        </Button>
                      </Col>
                    </Row>

                  </CardBody>
                )
                : "--------------------------------"
              }
            </Card>

          </Col>
        </Row>
      </div>
    </>
  );
}

export default Products;
