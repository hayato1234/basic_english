import React from "react";
import { Button, Col, Row } from "reactstrap";

const QuizFooter = ({ currentId, showNext, goNext, finish, numOfQs }) => {
  return (
    <Row className="justify-content-between mx-1">
      <Col xs="2">{showNext && <Button onClick={goNext}>Next</Button>}</Col>
      <Col xs="2" className="d-flex justify-content-end">
        {currentId !== 0 ? (
          <Button onClick={finish}>
            {currentId < numOfQs - 1 ? "Quit" : "See Result"}
          </Button>
        ) : null}
      </Col>
    </Row>
  );
};

export default QuizFooter;
