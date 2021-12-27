import React, {useEffect,useContext, useState} from 'react';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Rating from "react-rating";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Image from "react-bootstrap/Image";
import ImageTest from "../../jj.jpg";
import Badge from "react-bootstrap/Badge";
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/util/AuthContext';
import "../../css/PresDisplay.css";
import { InputGroup } from 'react-bootstrap';
import DoctorReview from './doctorReview';

export const DoctorProfile = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    
    const [ loadeddoc, setLoadedDoc] = useState();
    const [ loadedreview, setLoadedReview] = useState();
    //const userId= auth.userId;
    const docID=useParams().docID;

      //   useEffect(() => {
  //     const fetchUsers = async () => {
   
  //       try {
  //         const responseData = await sendRequest('http://localhost:5000/api/doctors/rating');
  
  
  //         setLoadedRating(responseData.doctors);
  //       } catch (err) {
  // console.log(err);
  //       }
  //     };
  //     fetchUsers();
  //   }, [sendRequest]);
    useEffect(()=> {
      const fetchPlaces = async() =>{
        try{
          const responseData = await sendRequest(
          `https://localhost:5000/api/places/users/doctorprofile/${docID}`
          );
          setLoadedDoc(responseData.doctor);
        }
        catch(err)
        {}
      };
        fetchPlaces();
      
    }, [sendRequest, docID]);
    
    
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (<div className="center">  <LoadingSpinner  /></div>)}
            {!isLoading &&loadeddoc &&
            <div className="BGGradProfile">
            <div
                style={{
                    marginLeft: "2rem",
                    marginRight: "1rem",
                    marginTop: "1rem",
                    minHeight: "80vh",
                }}
            >
            <Row  md={12} sm={0}>
                <Col
                    sm={3}
                    style={{
                        borderRight: "1px solid rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <Card className="ProfileCard">
                       
                           <br />
                            <br />
                            <font className="ProfiledCardText">
                                <i class="fas fa-user fa-9x"> </i>{" "}
                            </font>

                            <br />
                            <br />
                        <Card.Body>
                            
                            <Card.Text className="ProfileCardTextInfo">{loadeddoc.docID}</Card.Text>
                            <Card.Text className="ProfileCardTextInfo">
                            <Rating
                                        initialRating={loadeddoc.rating}
                                             readonly
                                            />
                            </Card.Text>
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
                        style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: "600",
                            color: "red",
                        }}
                    >
                        <Tab eventKey="home" title="Reviews">
                            
                            <div>
                                <DoctorReview doc={docID} />
                            </div>
                            
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </div>{" "}
        </div>
        // <div className="PresShowBG">
        //     <Row className="TopMargin"></Row>
        //     <Row style={{ maxWidth: "98%", marginLeft: "1%" }}>
        //         <Col sm={5}>
        //             <Card
        //                 style={{
        //                     width: "100%",
        //                     height: "100%",

        //                 }}
        //             >
        //                 <Card.Body>
        //                 <br />
        //                         <br />
        //                         <font className="ProfilingCardTextUser">
        //                             <i className="fas fa-user fa-9x"></i>
        //                         </font>
        //                         {/* <Image
        //                             src={ImageTest}
        //                             className="CardImage"
        //                             roundedCircle
        //                         /> */}
        //                         <br />
        //                         <br />
        //                         <br />
        //                         <font className="ProfilingCardText">
        //                             <i class="fas fa-user-injured fa-2x"> </i>{" "}
        //                         </font>
        //                         &nbsp;&nbsp;
                               
        //                     <br />
        //                     <br />
        //                     <p
        //                             style={{ fontSize: "20px" }}
        //                             className="ProfilingCardText"
        //                         >
        //                             <b>
        //                                 {" "}
        //                                 <i className="fas fa-hashtag"></i> Rating :
        //                             </b>{" "}
                                    //  <Rating
                                    //     initialRating={loadeddoc.rating}
                                    //          readonly
                                    //         />
        //                         <br />
        //                         <b>
        //                                 {" "}
        //                                 <i className="fas fa-user-md"></i>{" "}
        //                                 Doctor :
        //                             </b>{" "}
        //                         {loadeddoc.docID}
        //                         <br />
                               
        //                     </p>
        //                 </Card.Body>
        //             </Card>
        //         </Col>
        //         <Col sm={7}>
        //         <Card
        //                     style={{
        //                         width: "100%",
        //                         height: "100%",
        //                         padding: "10px",
        //                     }}
        //                     className="ProfilingCard"
        //                 >
        //                     <font className="ProfilingCardText">
        //                         <i class="fas fa-prescription fa-7x"></i>
        //                     </font>
        //                     <br />
        //                     <Row>
        //                         <Col sm={1}></Col>
        //                         <Col sm={11} className="PrescriptionText">
        //                 {loadeddoc.meds[0]} : {loadeddoc.doze[0]}
        //                 <br />
        //                 {loadeddoc.meds[1]} : {loadeddoc.doze[1]}
        //                 <br />
        //                 {loadeddoc.meds[2]} : {loadeddoc.doze[2]}
        //                 <br />
        //                 {loadeddoc.meds[3]} : {loadeddoc.doze[3]}
        //                 <br />
        //                 <br />
        //                 </Col>
        //                     </Row>  
        //             </Card>
        //         </Col>
        //     </Row>
        // </div>
    }
        </React.Fragment>
    );
};