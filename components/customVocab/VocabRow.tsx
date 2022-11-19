import { ErrorMessage, useFormik } from "formik";
import React, { useEffect } from "react";
import { Card, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { Vocab } from "../../types/vocabType";
import { validateEditVocab } from "../../utils/validation";

const VocabRow = ({ num, customVocabs, setCustomVocabs, setEnableSave }) => {
  const vocab: Vocab = customVocabs[num - 1];
  const formik = useFormik({
    initialValues: {
      en: vocab.en,
      noun: vocab.noun,
      tverb: vocab.tverb,
      itverb: vocab.itverb,
      adj: vocab.adj,
      adv: vocab.adv,
      prep: vocab.prep,
      conn: vocab.conn,
      sentence: vocab.sentence,
    },
    validate: validateEditVocab,
    onSubmit: (values) => {
      console.log(JSON.stringify(values));
    },
  });

  useEffect(() => {
    if (formik.errors) {
      setEnableSave(false);
    }
  }, [formik.errors]);

  //e: React.ChangeEvent<any>
  const handleChange = (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    //i- changed so enable save func if not already
    setEnableSave(true);

    //i- replace the data for this vocab　(num starts at 1)
    setCustomVocabs(
      customVocabs.map((a: Vocab, i: number) => {
        if (i === num - 1) a[e.target.getAttribute("name")] = e.target.value;
        return a;
      })
    );

    //change state value
    formik.handleChange(e);
  };

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
        {(customVocabs.length > 1 || num !== 1) && (
          <Col className="d-flex justify-content-end">
            <i
              onClick={handleDelete}
              className="fa fa-trash-o"
              aria-hidden="true"
            />
          </Col>
        )}
      </Row>
      <Row>
        <Col md="6" className="mb-1">
          <Card>
            <form className="ms-2" onSubmit={formik.handleSubmit}>
              <FormGroup>
                <Label htmlFor="en" md="2">
                  英語
                </Label>
                <Col md="10">
                  <Input
                    id="en"
                    name="en"
                    value={formik.values.en}
                    placeholder="English..."
                    className="form-control"
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.en && formik.errors && (
                    <p className="text-danger">{formik.errors.en}</p>
                  )}
                </Col>
              </FormGroup>
            </form>
          </Card>
        </Col>
        <Col md="6">
          <Card>
            <form className="ms-2">
              <Label htmlFor="noun" md="10">
                日本語(当てはまる物だけ)
              </Label>
              {formik.touched.noun && formik.errors.noun && (
                <p className="text-danger">{formik.errors.noun}</p>
              )}
              {/* !!!! floading not working! */}
              <FormGroup floating>
                <Col md="10">
                  <Input
                    id="noun"
                    name="noun"
                    value={formik.values.noun}
                    placeholder="名詞..."
                    className="form-control"
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Col>

                <Col md="10">
                  <Input
                    id="tverb"
                    name="tverb"
                    value={formik.values.tverb}
                    placeholder="他動詞..."
                    className="form-control"
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Col>
                <Col md="10">
                  <Input
                    id="itverb"
                    name="itverb"
                    value={formik.values.itverb}
                    placeholder="自動詞..."
                    className="form-control"
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Col>
                <Col md="10">
                  <Input
                    id="adj"
                    name="adj"
                    value={formik.values.adj}
                    placeholder="形容詞..."
                    className="form-control"
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Col>
                <Col md="10">
                  <Input
                    id="adv"
                    name="adv"
                    value={formik.values.adv}
                    placeholder="副詞..."
                    className="form-control"
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Col>
                <Col md="10">
                  <Input
                    id="prep"
                    name="prep"
                    value={formik.values.prep}
                    placeholder="前置詞..."
                    className="form-control"
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Col>
                <Col md="10">
                  <Input
                    id="conn"
                    name="conn"
                    value={formik.values.conn}
                    placeholder="接続詞..."
                    className="form-control"
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Col>
                {/* <Col md="10">
                  <Input
                    id="other"
                    name="other"
                    value={formik.values.adv}
                    placeholder="その他..."
                    className="form-control"
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Col> */}
              </FormGroup>
            </form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default VocabRow;
