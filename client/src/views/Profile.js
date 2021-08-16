import React,{useState,useEffect} from "react";
import { authenticate,user } from '../data/api';
import Notifications from "components/Notification/Notification";
import axios from 'axios';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function Profile() {

  
  const [userDetails, setUserDetails] = useState({});
  const [notificationStatus, setNotificationStatus] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState({msg:"",type:""});

    useEffect(
      () => {
        async function fetchProfile() {
          await axios.get(authenticate.getUserData).then((response)=>{
            if(response.data){ 
              setUserDetails(response.data);
            }
            else{
              setNotificationDetails({msg:"Error Fetching Store Details", type:"Danger"}); 
              setNotificationStatus(true);
            }
           
          })
        }
        fetchProfile();
      },
    []);
  
  async function editProfile () {
    await axios.patch(user.editProfile, userDetails).then((res)=>{
      if(res.data.status){
        setNotificationDetails({msg:"Profile Updated Successfully", type:"success", change:res.data.change});
      }
      else{
        setNotificationDetails({msg:"Error Updating Profile", type:"Danger"});
      }
      setNotificationStatus(true);
    });
  }

  return (
    <>
      <div className="content">
        {Object.keys(userDetails).length>0 ?
        <Row>
          <Col md="8">
          {notificationStatus?<Notifications details={notificationDetails} />:null}
            <Card>
              <CardHeader>
                <h5 className="title">Edit Profile</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>Store (disabled)</label>
                        <Input
                          defaultValue={userDetails.store}
                          disabled
                          placeholder="Store"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <Input disabled  defaultValue={userDetails.email} placeholder="mike@email.com" type="email" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>Name</label>
                        <Input
                          defaultValue={userDetails.name}
                          placeholder="John Doe"
                          type="text"
                          onChange={(e)=>{userDetails.name=e.target.value}}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label>Phone</label>
                        <Input
                          defaultValue={userDetails.phone}
                          placeholder="090********"
                          type="text"
                          onChange={(e)=>{userDetails.phone=e.target.value}}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Address</label>
                        <Input
                          defaultValue={userDetails.address}
                          placeholder="Location Address"
                          type="text"
                          onChange={(e)=>{userDetails.address=e.target.value}}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>City</label>
                        <Input
                          defaultValue={userDetails.city}
                          placeholder="City"
                          type="text"
                          onChange={(e)=>{userDetails.city=e.target.value}}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label>State</label>
                        <Input
                          defaultValue={userDetails.state}
                          placeholder="state"
                          type="text"
                          onChange={(e)=>{userDetails.state=e.target.value}}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>About Business</label>
                        <Input
                          cols="80"
                          defaultValue={userDetails.about}
                          placeholder="Here can be your description"
                          rows="4"
                          type="textarea"
                          onChange={(e)=>{userDetails.about=e.target.value}}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button onClick={editProfile} className="btn-fill" color="primary" type="submit">
                  Save
                </Button>
              </CardFooter>
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
                    <h5 className="title">{userDetails.name}</h5>
                  </a>
                  <p className="description">Owner</p>
                </div>
                <div className="card-description">
                  {userDetails.about}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        : null}
      </div>
    </>
  );
}

export default Profile;
