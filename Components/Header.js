import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, Row, Col, Table, Dropdown, Popover, OverlayTrigger, Button, Modal } from "react-bootstrap";
import { PersonFill, TrophyFill, ArrowLeft } from 'react-bootstrap-icons';
import { BackButton } from "./BackButton";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import API from '../API';


{/* <Form.Select className="AccountSelect" onChange={(event) => {
    setAccount(event.target.value);
}}>
    <option value="Guest">Prototype: select account view</option>
    <option value="Guest">Guest</option>
    <option value="Musician">Musician</option>
    <option value="Organiser">Event Organiser</option>
</Form.Select> */}

function Header(props) {

    return (
        props.page === "/profile/1" && props.account === "Maneskin" ?
            <MusicianHeader previousPage={props.previousPage} home={props.home} setAccount={props.setAccount} setEditMode={props.setEditMode} editMode={props.editMode} trophies={props.trophies} idTrophy={props.idTrophy} />
            : <BasicHeader previousPage={props.previousPage} home={props.home} setAccount={props.setAccount} setEditMode={props.setEditMode} />
    );
}

function BasicHeader(props) {
    return (
        <Navbar bg="dark" variant="dark" className="Header NavBar" style={{ paddingRight: 0, paddingLeft: 0 }}>
            <Container>
                <Nav className="justify-content-start">
                    {props.home ? <></> : <BackButton previousPage={props.previousPage} />}
                </Nav>
                <Navbar.Brand>
                    {'  '}MusicOnDemand
                    {/*<AccountDropdown setAccount={props.setAccount} setEditMode={props.setEditMode} />*/}
                </Navbar.Brand>
                <Nav className="justify-content-end">
                    <Link to="/profile/1" onClick={() => { props.setAccount("Maneskin"); }}>
                        <PersonFill className="User" size="25" />
                    </Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

function MusicianHeader(props) {

    const [isShown, setIsShown] = useState(false); //in order to make appear suggestions
    const [suggestions, setSuggestions] = useState([]);


    // Retrieve all Suggestions details
    useEffect(() => {
        const allSuggestions = async () => {
            await API.getSuggestions().then(s => {
                setSuggestions(s);
            }).catch(err => {
                console.error(err);
            });
        }
        allSuggestions();
    }, []);

    const popoverSuggestions = (
        <Popover style={{ width: "300px" }} id="popover-basic">
            <Popover.Header as="h3">Suggestions</Popover.Header>
            <Popover.Body>
                {suggestions.map(s =>

                    <Row className="block-example border-bottom border-dark">
                        <Col xs={12} md={8}>
                            {s.suggestionText}
                        </Col>
                        <Col xs={6} md={4} style={{ justifyContent: 'right' }}>
                            {"+"}{s.numberTrophies}{" "}<TrophyFill />
                        </Col>
                    </Row>
                )}
            </Popover.Body>
        </Popover>
    );

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //console.log(props.previousPage);
    //console.log(props.editMode);

    return (
        <Navbar bg="dark" variant="dark" className="fixed-top NavBar" style={{ maxHeight: '60px', paddingRight: 0, paddingLeft: 0 }}>
            <Container>
                <Nav className="justify-content-start">
                    {props.home ? <></> : (
                        (props.editMode ? (
                            <>
                                <ArrowLeft className="Arrow" size="25" onClick={handleShow} />

                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Are you sure?</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Are you sure you want to exit without saving?</Modal.Body>
                                    <Modal.Footer>

                                        <Button variant="success" onClick={handleClose}>No</Button>
                                        <Link to={props.previousPage}>
                                            <Button variant="danger">Yes
                                            </Button>
                                        </Link>

                                    </Modal.Footer>
                                </Modal>

                            </>
                        ) :
                            (<BackButton previousPage={props.previousPage} />))
                    )}
                </Nav>
                <Navbar.Brand style={{ margin: 0, padding: '0px' }}>
                    {'  '}MusicOnDemand
                    {/*<AccountDropdown setAccount={props.setAccount} setEditMode={props.setEditMode} />*/}
                </Navbar.Brand>
                <Nav className="justify-content-end">
                    <Table borderless>
                        <tbody style={{ padding: '0px' }}>
                            <tr style={{ padding: '0px' }}>
                                <td colSpan={2} style={{ textAlign: 'center', padding: '0px', paddingTop: '14px' }}>
                                    <Link to="/profile/1" onClick={() => { props.setAccount("Maneskin"); }}>
                                        <PersonFill className="User" size="25" />
                                    </Link>
                                </td>
                            </tr>
                            <tr style={{ padding: '0px' }}>
                                <td style={{ padding: '0px', paddingRight: '2px' }}>
                                    <OverlayTrigger trigger={["hover", "hover"]} placement="bottom" overlay={popoverSuggestions}>
                                        <TrophyFill size='12' style={{ color: 'white' }} />
                                    </OverlayTrigger>
                                </td>
                                <td style={{ color: 'white', padding: '0px' }}>
                                    {props.trophies.numTrophies}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Nav>
            </Container>
        </Navbar>
    );
}

function AccountDropdown(props) {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic" size="lg">
                {'  '}MusicOnDemand
            </Dropdown.Toggle>

            <Dropdown.Menu >
                <Dropdown.Item as="button" onClick={() => { props.setAccount("Guest"); props.setEditMode(false); }}>Guest</Dropdown.Item>
                <Dropdown.Item as="button" onClick={() => props.setAccount("Musician")}>Musician</Dropdown.Item>
                <Dropdown.Item as="button" onClick={() => { props.setAccount("Organiser"); props.setEditMode(false); }}>Event Organiser</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default Header;