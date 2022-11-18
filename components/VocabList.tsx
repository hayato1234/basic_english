import React, { createRef, RefObject, useState } from "react";
import { Vocab } from "../types/vocabType";
import Link from "next/link";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button, Col, FormGroup } from "reactstrap";
import { validateSearchForm } from "../utils/validation";

const styles = require("../styles/Vocab.module.css");

const VocabList = ({ vocabs, unitId }) => {
  const [searchErrMsg, setSearchErrMsg] = useState("");
  if (!vocabs) {
    return (
      <>
        <h1>Error</h1>
        <Link href="/">
          <button>Reload</button>
        </Link>
      </>
    );
  }
  // const vocabs: Vocab[] = unitData.data().list;
  const initialValues = { key: "" };
  interface valuesType {
    key: string;
  }

  const refs = vocabs.reduce((acc, cur) => {
    acc[cur.num] = createRef();
    return acc;
  }, {});

  const searchVocab = (values: valuesType) => {
    if (searchErrMsg) setSearchErrMsg("");
    if (vocabs) {
      const result = vocabs.filter(
        (v: Vocab) => v.num === +values.key || v.en === values.key.trim()
      )[0];
      if (result) {
        const resultRef: RefObject<HTMLElement> = refs[result.num];

        resultRef.current &&
          resultRef.current.scrollIntoView({
            behavior: "smooth",
          });
        // resultRef.current.
        console.log(refs[result.num]);
      } else {
        setSearchErrMsg(
          `"${values.key}" was not found. Unit内の単語または単語番号を入れてください。`
        );
      }
      // console.log("not found", result);
    } else {
      console.log("vocab data undefined");
    }
  };

  return (
    <div className={styles.list}>
      <Formik
        initialValues={initialValues}
        onSubmit={searchVocab}
        validate={validateSearchForm}
      >
        <Form className="mt-4">
          <FormGroup row className="m-1">
            <Col xs="8">
              <Field name="key" className="form-control" />
              <ErrorMessage name="key">
                {(msg) => <p className="text-danger">{msg}</p>}
              </ErrorMessage>
            </Col>
            <Col>
              <Button type="submit">Search</Button>
            </Col>
          </FormGroup>
          <FormGroup row className="m-1">
            <Col>
              {searchErrMsg ? (
                <p className="text-danger">{searchErrMsg}</p>
              ) : null}
            </Col>
          </FormGroup>
        </Form>
      </Formik>

      {vocabs.map((vocab) => {
        return (
          <Link
            href={{
              pathname: "/vocabulary/[unit]/[number]",
            }}
            as={`/vocabulary/${unitId}/${vocab.num}`}
            key={vocab.num}
          >
            <div
              id={`listId${vocab.num}`}
              role="button"
              ref={refs[vocab.num]}
              className={styles.container}
            >
              <h5>
                {`${vocab.num} : ${vocab.en} `}
                <span>{vocab.parts}</span>
              </h5>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default VocabList;
