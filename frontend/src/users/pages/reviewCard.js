import React from "react";
import Card from "react-bootstrap/Card";
import Akira from "../../jj.jpg";
import { Link } from "react-router-dom";
import "../../css/DoctorListCard.css";

const ReviewCard = (props) => {
    return (
        <div>
            
                <Card border="info" className="DoctorListCards">
                    <br />
                    <font className="DoctorIcon">
                        <i className="fas fa-user-md fa-9x"></i>
                    </font>
                    <Card.Body>
                        <Card.Title
                            style={{ fontSize: "2rem", color: "#195a65" }}
                        >
                            {props.date}
                        </Card.Title>
                        <Card.Text>
                            Doctor: {props.doctor}
                            <br></br>
                            Review:{props.review}
                            
                        </Card.Text>
                    </Card.Body>
                </Card>
            
        </div>
    );
};

export default ReviewCard;