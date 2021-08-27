import React, {useState,useEffect} from "react";
import axios from 'axios';
import { service } from '../data/api';
import Notifications from "components/Notification/Notification";
import { FiArrowLeft } from "react-icons/fi";
import empty from '../assets/img/service.svg';
import { Link } from "react-router-dom";
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

function Service() {
  //let symbol = "₦";
  const [services, setServices] = useState([]);
  const [currentService, setCurrentService] = useState({});

  const [notificationStatus, setNotificationStatus] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState({msg:"",type:""});
  const [dataload, setDataLoad] = useState(true);

  useEffect(
    () => {
        async function fetchServices() {
            await axios.get(service.showStoreServices).then((response)=>{
                if(response.data.status===true){
                    setServices(response.data.data);
                    setDataLoad(false);
                }
                else{
                    setNotificationDetails({msg:"Error Loading Services, Please Referesh The Page", type:"danger"});
                    setNotificationStatus(true);
                    setDataLoad(false);
                }
            })
        }
        fetchServices();
    },
    []);
  
  async function updateService () {
    await axios.patch(service.updateService,currentService).then((res)=>{
      if(res.data.status){
        setNotificationDetails({msg:"Service Updated Successfully", type:"success", change:res.data.change});
      }
      else{
        setNotificationDetails({msg:"Error Updating Service", type:"danger"});
      }
      setNotificationStatus(true);
    })
  }


  const [loading, setLoading] = useState(true);


  function selectService (id) {
    setCurrentService((services.filter(item => item._id === id))[0]);
    setLoading(false);
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

  const result = services.map(({_id,service_name,price}) => ({_id,service_name,price}));
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
                <CardTitle  className='pull-left' tag="h4">Services</CardTitle>
                <div className="pull-right" style={{marginBottom:'20px'}}> 
                    <Link to="/admin/addservice">
                        <Button  className="btn-fill" style={{width:"100%"}} color="primary" type="submit">
                            Add Service
                        </Button>
                    </Link>
                </div> 
                <FormGroup style={{width:"100%"}} className='pull-right'>
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
                    columns.map((column,key) => (
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
              {dataload===false?
                <>
                {services.length > 0? 
                  <CardBody>
                    <Table className="tablesorter" responsive style={{overflow:"unset"}}>
                      <thead className="text-primary">
                        <tr>
                          <th>Service Name</th>
                          <th>Price</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {search(result).map((row,key) => (
                          <tr key={key}>
                            {columns.map((column,key) => (
                              <>{key>0?<td key={key}>{row[column]} </td>:null}</>
                            ))}
                            <td>
                                <Button  onClick={()=> selectService(row._id)} className="btn-fill" style={{width:"100%"}} color="primary" type="submit">
                                    Show
                                </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                :
                  <div style={{color: "#39B54A", textAlign: "center",padding:"20px"}}> 
                    <img src={empty} style={{marginBottom:"30px"}} height="250px"  alt="Nothing to show yet"/><br />
                    <CardTitle tag="h4">Nothing To Show Yet... Add Some Services to The System</CardTitle>
                  </div>  
                } 
                </>
              :
                "Loading"
              }
            </Card>
            :
              <Button style={{width:"100%",marginBottom:'15px'}} onClick={()=>setLoading(!loading)} className="btn-fill" color="primary">
                <FiArrowLeft size={20} /> <font style={{paddingLeft:"30px"}}>Back To Services </font>
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
                                <label>Service Name</label>
                                <Input
                                  placeholder="Tecno Camon CX"
                                  type="text"
                                  value={currentService.service_name}
                                  onChange={(e) => setCurrentService({...currentService, service_name:e.target.value})}
                                />
                              </FormGroup>
                            </Col>
                            <Col className="pl-md-1" md="6">
                              <FormGroup>
                                <label>Price</label>
                                <Input
                                  placeholder="Tecno"
                                  type="text"
                                  value={currentService.price}
                                  onChange={(e) => setCurrentService({...currentService, price:e.target.value})}
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
                                  value={currentService.service_desc}
                                  onChange={(e) => setCurrentService({...currentService, service_desc:e.target.value})}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </a>
                      </div>
                      <Row>
                        <Col md="6">
                        <Button onClick={()=>updateService()} className="btn-fill" style={{width:"100%"}} color="primary" type="submit">
                          Update Service
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

export default Service;
