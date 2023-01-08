import { Container, Row, Col, Button } from "react-bootstrap"
import { Link } from 'react-router-dom'
import band from '../Images/band.webp'
import { useEffect, useState } from "react";

function HomePage(props) {

    useEffect(() => {
        props.switchHomeStatus(true, "/", "/");
    }, []);

    return (
        <Container className="Homepage">
            <Row >
                <h2>The best way to find musicians for your gig!</h2>
            </Row>
            <Row>
                <Col>
                    <img className="BandImage" src={band} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <i><p className="ChooseText">Start looking for musicians!</p></i>
                </Col>
            </Row>
            <Row>
                <Button style={{ border: "2px solid black" }} variant="outline-dark" size="lg" href="/user" component={Link}><b>Search musicians</b></Button>
            </Row>
        </Container >
    );
}

export default HomePage;