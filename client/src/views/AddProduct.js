import React,{useState} from "react";
import Axios from "axios";
import Notifications from "components/Notification/Notification";
import { product } from '../data/api';
import { FaTrashAlt } from 'react-icons/fa';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Table
} from "reactstrap";

function UserProfile() {
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [desc, setDesc] = useState('');
  const [model, setModel] = useState('');
  const [variation, setVariation] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  const [notificationStatus, setNotificationStatus] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState({msg:"",type:""});

  const [variationList, setVariationList] = useState([]);

  async function addVariation(e) {
		e.preventDefault();
    if(model==='' || variation==='' || buyingPrice==='' || sellingPrice===''){
      setNotificationDetails({msg:"Some Variation Fields are Empty", type:"danger"});
      setNotificationStatus(true);
    }else{
      const variationItem = {'variation':variation, 'model':model, 'buying_price':buyingPrice, 'selling_price':sellingPrice};
      setVariationList(variationList.concat(variationItem));
      setVariation(''); setModel(''); setBuyingPrice(''); setSellingPrice('');
      setNotificationDetails({msg:"Variation added successfully, add product to create product", type:"success"});
      setNotificationStatus(true);
    }
	}
  async function addProduct () {
    if(productName==='' || desc==='' || brandName===''){
      setNotificationDetails({msg:"Some Product Fields are Empty", type:"danger"});
      setNotificationStatus(true);
    }else{
      const productData = { 
        "product_name":productName, 
        "product_desc":desc,
        "brand":brandName,
        "variations":variationList,
      };
      await Axios.post(product.addProduct, productData).then((res)=>{
        console.log(res);
        if(res.data.status){
          setNotificationDetails({msg:"Product Created Successfully", type:"success"});
        }
        else{
          setNotificationDetails({msg:"Error Creating Product, make sure all fields are filled or try refresshing page.", type:"danger"});
        }
      });
    }
	}

  const handleRemoveItem = (e) => {
    setVariationList(variationList.filter(item => item.variation !== e));
    setNotificationDetails({msg:"Variation Removed Successfully", type:"success"});
    setNotificationStatus(true);
  };
  
  return (
    <>
      {notificationStatus?<Notifications details={notificationDetails} />:null}
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Add Product </h5>
              </CardHeader>
              <CardBody>
                <Form onSubmit={addVariation}>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>Product Name</label>
                        <Input
                          placeholder="Tecno Camon CX"
                          type="text"
                          onChange={(e) => setProductName(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label>Brand</label>
                        <Input
                          placeholder="Tecno"
                          type="text"
                          onChange={(e) => setBrandName(e.target.value)}
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
                          onChange={(e) => setDesc(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    
                  </Row>

                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>Variation</label>
                        <Input
                          placeholder="Red - 64GB"
                          type="text"
                          value={variation}
                          onChange={(e) => setVariation(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label>Model No</label>
                        <Input 
                          placeholder="12345678"
                          type="text"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
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
                          value={buyingPrice}
                          onChange={(e) => setBuyingPrice(e.target.value)}
                        />
                      </FormGroup>
                    </Col> 
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label>Selling Price</label>
                        <Input 
                          placeholder="10,000"
                          type="number"
                          value={sellingPrice}
                          onChange={(e) => setSellingPrice(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Button className="btn-fill" color="primary" type="submit">
                    Add Variation
                  </Button>
                </Form>
              </CardBody>
            </Card>
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
                      src={require("assets/img/product.png").default}
                    />
                    <h5 className="title">Product Name: {productName} </h5>
                    <h5 className="title">Brand Name: {brandName} </h5>
                  </a>
                </div>
                <div className="card-description">
                  Description: {desc}

                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Variation</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variationList.map((variationItem,key)=>(
                      <tr key={key}>
                        <td>
                          <p>Variation: {variationItem.variation}</p>
                          <p>Model: {variationItem.model}</p>
                          <p>Buying Price: {variationItem.buying_price}</p>
                          <p>Selling Price: {variationItem.selling_price}</p>
                        </td>
                        <td style={{cursor:"pointer"}} className="text-center">
                          <FaTrashAlt onClick={()=>handleRemoveItem(variationItem.variation)}  color='red' />
                        </td>
                      </tr>
                      ))}
                    
                    </tbody>
                  </Table>
            
                </div>
                <Button onClick={()=> addProduct()} className="btn-fill" color="primary" type="submit">
                  Add Product
                </Button>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UserProfile;
