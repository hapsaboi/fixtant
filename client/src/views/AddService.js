import React,{useState} from "react";
import Axios from "axios";
import Notifications from "components/Notification/Notification";
import { service } from '../data/api';
import LoadingOverlay from 'react-loading-overlay';

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
} from "reactstrap";

function AddService() {
  const [serviceName, setServiceName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');

  const [notificationStatus, setNotificationStatus] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState({msg:"",type:""});
  
  const [requestLoading, setRequestLoading] = useState(false);


  async function addService () {
    setRequestLoading(true);
    if(serviceName==='' || desc==='' || price===''){
      setNotificationDetails({msg:"Some Service Fields are Empty", type:"danger"});
      setNotificationStatus(true);
    }else{
      const serviceData = { 
        "service_name":serviceName, 
        "service_desc":desc,
        "price":price,
      };
      await Axios.post(service.addService, serviceData).then((res)=>{
        console.log(res)
        if(res.data.status){
          setNotificationDetails({msg:"Service Created Successfully", type:"success"});
        }
        else{
          setNotificationDetails({msg:"Error Creating Service, make sure all fields are filled or try refreshing page.", type:"danger"});
        }
        setNotificationStatus(true);
      });
    }
    setRequestLoading(true);
	}

  return (
    <>
      {notificationStatus?<Notifications details={notificationDetails} />:null}
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Add Service </h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>Service Name</label>
                        <Input
                          placeholder="Screen Repairs"
                          type="text"
                          onChange={(e) => setServiceName(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label>Price</label>
                        <Input
                          placeholder="10,000"
                          type="number"
                          onChange={(e) => setPrice(e.target.value)}
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
                          placeholder="This service is a ..."
                          rows="4"
                          type="textarea"
                          onChange={(e) => setDesc(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    
                  </Row>

                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <LoadingOverlay active={requestLoading} spinner text='Loading your request...'>
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
                      <h5 className="title">Service Name: {serviceName} </h5>
                      <h5 className="title">Price: {price} </h5>
                    </a>
                  </div>
                  <div className="card-description">
                    Description: {desc}
                  </div>
                  <Button onClick={()=> addService()} className="btn-fill" color="primary" type="submit">
                    Add Service
                  </Button>

                </CardBody>
              </Card>
            </LoadingOverlay>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AddService;
