import { Field, Form, Formik } from "formik";
import React from "react";
import {
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Label,
  Col,
  Button,
} from "reactstrap";

const ReportIssue = ({ isModalOpen, toggleModal, data }) => {
  const initialValues = {
    data: data,
    comment: "",
  };
  const handleSubmit = (values, { resetForm }) => {
    console.log("in JSON format", JSON.stringify(values));
    resetForm();
  };
  return (
    <Modal isOpen={isModalOpen} toggleModal={toggleModal}>
      <ModalHeader toggle={toggleModal}>間違えを報告</ModalHeader>
      <ModalBody>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <Form>
            <FormGroup row>
              <Label>説明</Label>
              <Col md="12">
                <Field
                  name="comment"
                  as="textarea"
                  rows="12"
                  className="form-control"
                ></Field>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md={{ size: 10 }}>
                <Button type="submit" color="primary">
                  送信
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </Formik>
      </ModalBody>
    </Modal>
  );
};

export default ReportIssue;
