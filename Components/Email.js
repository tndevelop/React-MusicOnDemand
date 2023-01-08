import React, { useRef, useState } from 'react';
import { Button, Modal, Container, Row, Alert } from "react-bootstrap";
import '../App.css';



import emailjs from '@emailjs/browser';

function ContactUs(props) {
    const [sent, setSent] = useState(false)
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();
        setSent(true);
        /*emailjs.sendForm('gmail', 'template_2', form.current, 'user_U')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });*/
        
        
    };

    const closeModal = (e) => {
        e.preventDefault();
        /*emailjs.sendForm('gmail', 'template_2', form.current, 'user_U')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });*/
        
        handleCloseEmail();
        setSent(false);

    };

    const handleCloseEmail = () => props.setShowEmailForm(false);

    return (
        <Modal centered show={props.showEmailForm} onHide={handleCloseEmail}>
            <Modal.Header closeButton>
                <Modal.Title>Send an Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form ref={form} onSubmit={sent ? closeModal : sendEmail}>
                    <Container>
                        <Row>

                            <label>Your Name</label>
                            <input type="text" name="name" />
                        </Row>
                        <Row>
                            <label>Your Email</label>
                            <input type="text" name="email" />
                        </Row>
                        <Row>
                            <label>Message</label>
                            <textarea type="text" name="message" />
                        </Row>
                        <Row>
                            {sent ? 
                            <>
                                
                                <Alert variant="success"> email sent correctly</Alert>
                                <input style={{ background: "#808080", color: "white", padding: "14px 20px", margin: "8px 0", border: "none" }} type="submit" value="Close" />
                            </>
                            :
                            <input style={{ background: "#4CAF50", color: "white", padding: "14px 20px", margin: "8px 0", border: "none" }} type="submit" value="Send" />
                            }
                        </Row>
                        

                    </Container>
                </form>
            </Modal.Body>
        </Modal >
    );
};

{/* <Modal show={props.showEmailForm} onHide={() => props.setShowEmailForm(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Send an Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" name="name" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Email:  </Form.Label>
                        <Form.Control type="email" placeholder="Enter email" name="email" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Text</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Email message"
                            name="message"
                            style={{ height: '100px' }}
                        />

                    </Form.Group>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.setShowEmailForm(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={sendEmail}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>*/}

export default ContactUs;