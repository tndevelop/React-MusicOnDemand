import { Button, Row, Col } from "react-bootstrap";
import {Link} from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { ArrowLeft, PersonFill, Lightbulb, TrophyFill } from 'react-bootstrap-icons';

function BackButton(props) {
  
  const redirectAddress = props.previousPage ? props.previousPage : "/";
  
  
  return (
    <Row>
      <Col>
        <Link to={redirectAddress}>
          <ArrowLeft className="Arrow" size="25"/>
        </Link>
      </Col>
      
      </Row>
  );
}


export { BackButton };
