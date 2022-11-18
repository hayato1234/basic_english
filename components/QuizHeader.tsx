import Link from "next/link";
import React, { useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import ReportIssue from "./ReportIssue";

const QuizSettings = ({ isOpen, toggleModal, numOfQs, setNumOfQs }) => {
  const [dropdownNumQ, setDropdownOpen] = useState(false);
  const toggleNumQ = () => setDropdownOpen(!dropdownNumQ);
  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>設定</ModalHeader>
      <ModalBody>
        <Row>
          <Col xs="6" className="align-items-center">
            <p>問題数：</p>
          </Col>
          <Col className="d-flex justify-content-end">
            <Dropdown isOpen={dropdownNumQ} toggle={toggleNumQ}>
              <DropdownToggle caret>{numOfQs}</DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => setNumOfQs(25)}>25</DropdownItem>
                <DropdownItem onClick={() => setNumOfQs(50)}>50</DropdownItem>
                <DropdownItem onClick={() => setNumOfQs(75)}>75</DropdownItem>
                <DropdownItem onClick={() => setNumOfQs(100)}>100</DropdownItem>
                <DropdownItem onClick={() => setNumOfQs(200)}>200</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button onClick={toggleModal} color="primary">
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const QuizHeader = ({
  linkHref,
  linkAs,
  title,
  currentId,
  numOfQs,
  setNumOfQs,
}) => {
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const toggleReport = () => {
    setReportModalOpen(!isReportModalOpen);
  };
  const toggleSettings = () => {
    setSettingsModalOpen(!isSettingsModalOpen);
  };
  return (
    <>
      <h1>
        <Link href={linkHref} as={linkAs}>
          <i className="fa fa-arrow-left" aria-hidden="true" />
        </Link>{" "}
        {title}
      </h1>
      <hr />
      <Row>
        <Col xs="4" className="me-auto">
          <p>{`Q : ${currentId + 1} / ${numOfQs}`}</p>
        </Col>
        <Col xs="4" className="d-flex justify-content-end">
          <Button
            id="report"
            size="sm"
            className="mx-1"
            color="success"
            onClick={toggleReport}
          >
            <i className="fa fa-exclamation-circle" aria-hidden="true" />
          </Button>
          <Button
            size="sm"
            className="mx-1"
            color="secondary"
            onClick={toggleSettings}
          >
            <i className="fa fa-cog" aria-hidden="true" />
          </Button>
        </Col>
      </Row>
      <ReportIssue
        isModalOpen={isReportModalOpen}
        toggleModal={toggleReport}
        data={{ component: title }}
      />
      <QuizSettings
        isOpen={isSettingsModalOpen}
        toggleModal={toggleSettings}
        numOfQs={numOfQs}
        setNumOfQs={setNumOfQs}
      />
    </>
  );
};

export default QuizHeader;
