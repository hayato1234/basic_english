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
  ModalFooter,
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
    <Modal isOpen={isModalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>問題を報告</ModalHeader>
      <ModalBody>
        <p>
          送信ボタンを押すだけでもデーターは送られますが、「エラーがでた」、「クイズの答えが間違っている」など説明を書いてくれると助かります。
        </p>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <Form>
            <FormGroup row>
              <Label>説明（任意）</Label>
              <Col md="12">
                <Field
                  name="comment"
                  as="textarea"
                  rows="12"
                  className="form-control"
                />
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
      <ModalFooter>
        <Button color="secondary" onClick={toggleModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ReportIssue;
