import { Field, Form, Formik } from "formik";
import React from "react";
import { Card, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { Vocab } from "../../types/vocabType";

const VocabRow = ({
  num,
  customVocabs,
  setCustomVocabs,
  enableSave,
  setEnableSave,
}) => {
  const initValEn = {
    en: "",
  };
  const initValJp = {
    noun: "",
    tverb: "",
    itverb: "a",
    adj: "",
    adv: "",
    prep: "",
    conn: "",
    sentence: "",
  };
  const handleSubmit = (values) => {
    console.log(JSON.stringify(values));
  };
  const handleEnChange = (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    //i- changed so enable save func if not already
    setEnableSave(true);
    //i- replace the data for this vocab　(num starts at 1)
    setCustomVocabs(
      customVocabs.map((a: Vocab, i: number) => {
        if (i === num - 1) a.en = e.target.value;
        return a;
      })
    );
    // console.log(customVocabs);
  };

  const handleJpChange = (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    //i- changed so enable save func if not already
    setEnableSave(true);

    //i- replace the data for this vocab　(num starts at 1)
    //i- field name gotten from getAttribute
    setCustomVocabs(
      customVocabs.map((a: Vocab, i: number) => {
        if (i === num - 1) {
          a[e.target.getAttribute("name")] = e.target.value;
        }
        return a;
      })
    );
    // console.log(customVocabs);
  };

  //!!!!! delete not working as intended
  const handleDelete = () => {
    console.log(customVocabs);

    //i- deleted so enable save func if not already
    setEnableSave(true);

    let numCount = 1;
    setCustomVocabs(
      customVocabs.reduce((acc: Vocab[], c: Vocab) => {
        if (c.num !== num) {
          c.num = numCount++;
          acc.push(c);
        }
        return acc;
      }, [])
    );
  };

  return (
    <>
      <hr />
      <Row>
        <Col>{num} :</Col>
        <Col className="d-flex justify-content-end">
          <i
            onClick={handleDelete}
            className="fa fa-trash-o"
            aria-hidden="true"
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-1">
          <Card>
            <Formik initialValues={initValEn} onSubmit={handleSubmit}>
              <Form className="ms-2">
                <FormGroup>
                  <Label htmlFor="en" md="2">
                    英語
                  </Label>
                  <Col md="10">
                    <Input
                      id="en"
                      name="en"
                      placeholder="English..."
                      className="form-control"
                      onChange={handleEnChange}
                    />
                  </Col>
                </FormGroup>
              </Form>
            </Formik>
          </Card>
        </Col>
        <Col md="6">
          <Card>
            <Formik initialValues={initValJp} onSubmit={handleSubmit}>
              <Form className="ms-2">
                <FormGroup>
                  <Label htmlFor="noun" md="10">
                    日本語(当てはまる物だけ)
                  </Label>
                  <Col md="10">
                    <Input
                      id="noun"
                      name="noun"
                      placeholder="名詞..."
                      className="form-control"
                      onChange={handleJpChange}
                    />
                  </Col>
                  <Col md="10">
                    <Input
                      id="tverb"
                      name="tverb"
                      placeholder="他動詞..."
                      className="form-control"
                      onChange={handleJpChange}
                    />
                  </Col>
                  <Col md="10">
                    <Input
                      id="itverb"
                      name="itverb"
                      placeholder="自動詞..."
                      className="form-control"
                      onChange={handleJpChange}
                    />
                  </Col>
                  <Col md="10">
                    <Input
                      id="adj"
                      name="adj"
                      placeholder="形容詞..."
                      className="form-control"
                      onChange={handleJpChange}
                    />
                  </Col>
                  <Col md="10">
                    <Input
                      id="adv"
                      name="adv"
                      placeholder="副詞..."
                      className="form-control"
                      onChange={handleJpChange}
                    />
                  </Col>
                </FormGroup>
              </Form>
            </Formik>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default VocabRow;
