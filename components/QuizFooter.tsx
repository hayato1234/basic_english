import React from "react";
import { Button, Col, Row } from "reactstrap";

const QuizFooter = ({
  currentId,
  showNext,
  goNext,
  finish,
  numOfQs,
  showAnswer,
}) => {
  return (
    <Row className="justify-content-between mx-1">
      <Col xs="2">
        {showNext && currentId + 1 < numOfQs && (
          <Button onClick={goNext}>Next</Button>
        )}
      </Col>
      <Col xs="2" className="d-flex justify-content-end">
        {currentId !== 0 ? (
          currentId < numOfQs - 1 ? (
            <Button onClick={finish}>Quit</Button>
          ) : (
            <>
              {showAnswer ? (
                <Button color="warning" onClick={finish}>
                  See Result
                </Button>
              ) : (
                <Button onClick={finish}>Quit</Button>
              )}
            </>
          )
        ) : null}
      </Col>
    </Row>
  );
};

export default QuizFooter;
