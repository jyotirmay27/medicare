import React from 'react';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import image from '../jj.jpg';
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Row from "react-bootstrap/Row";
import ImageTest from "../jj.jpg";
import { CardDeck, CardGroup } from "react-bootstrap";
import DocPatients from './docPatients';
import DocPrescription from './docPrescription';

import { Link } from 'react-router-dom';



const DocProfile = () => {
   
    return (  
        <div
            style={{
                marginLeft: "2rem",
                marginRight: "1rem",
                marginTop: "1rem",
            }}
        >
            <Row  md={12} sm={0}>
                <Col
                    sm={3}
                    style={{
                        borderRight: "1px solid rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <Card style={{ width: "100%" }}>
                        <Image
                            variant="top"
                            src={ImageTest}
                            style={{
                                height: "20vw",
                                width: "20vw",
                                marginLeft: "auto",
                                marginTop: "0.5rem",
                                marginRight: "auto",
                            }}
                            roundedCircle
                        />
                        <Card.Body>
                            <Card.Title>Doc Name</Card.Title>
                            <Card.Text>All Important Information</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={9}
                 style={{
                    borderRight: "1px solid rgba(0, 0, 0, 0.5)",
                }}>
                    <Tabs
                        defaultActiveKey="home"
                        id="uncontrolled-tab-example"
                    >
                        <Tab eventKey="home" title="Prescriptions">
                            
                            <div>
                                <DocPrescription />
                            </div>
                            
                        </Tab>
                        <Tab eventKey="profile" title="Patients">
                        <div>
                                <DocPatients />
                            </div>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </div>
    );
};

export default DocProfile;