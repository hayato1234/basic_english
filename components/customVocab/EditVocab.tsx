import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import {
  Alert,
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Toast,
  ToastBody,
  ToastHeader,
} from "reactstrap";
import Fab from "@mui/material/Fab";
import { CustomUnit, Vocab } from "../../types/vocabType";
import { db } from "../../utils/initAuth";
import { DB_USER_VOCAB } from "../../utils/staticValues";
import VocabRow from "./VocabRow";
import { useRouter } from "next/router";

const EditVocab = ({ unitData, currUser }, props) => {
  const [userVocabData] = useDocument(doc(db, DB_USER_VOCAB, currUser.uid), {});
  const [stopSave, setStopSave] = useState(false);
  const [rows, setRows] = useState<JSX.Element[]>([]);
  const [customUnit, setCustomUnit] = useState<CustomUnit>();
  const [customVocabs, setCustomVocabs] = useState<Vocab[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [unitTitle, setTitle] = useState("私の新しいタイトル");
  const [enableSave, setEnableSave] = useState(false);
  const [goBackAlert, setGoBackAlert] = useState(false);
  const router = useRouter();

  //i-set the initial empty vocab
  useEffect(() => {
    if (!unitData) {
      setCustomVocabs([
        {
          id: 0,
          unit: unitTitle,
          num: 1,
          parts: "",
          en: "",
          noun: "",
          tverb: "",
          itverb: "",
          adj: "",
          adv: "",
          prep: "",
          conn: "",
          sentence: "",
        },
      ]);
    }
  }, []);

  //i- set the unit if vocab changes
  useEffect(() => {
    setCustomUnit({
      id: 0,
      title: unitTitle,
      vocabs: customVocabs,
    });
  }, [customVocabs, unitTitle]);

  //i- add new vocab when customVocabs changed ( + button clicked or initial add)
  useEffect(() => {
    customVocabs.length > 0 &&
      setRows(
        customVocabs
          .map((cv) => {
            return (
              <VocabRow
                key={cv.id}
                num={cv.num}
                customVocabs={customVocabs}
                setCustomVocabs={setCustomVocabs}
                setEnableSave={setEnableSave}
                enableSave={enableSave}
              />
            );
          })
          .reverse()
      );
  }, [customVocabs.length]);

  //i- set a listener for browser go back or closing tab
  useEffect(() => {
    //i- when closing the tab and unit has changes, ask the user to confirm delete the changes
    const preventClose = (e: BeforeUnloadEvent) => {
      if (!enableSave) return;
      e.preventDefault();
      e.returnValue = "closing";
      return e;
    };

    if (window) {
      // router.beforePopState(onBackButtonEvent);
      window.addEventListener("beforeunload", preventClose);
    }

    const handelRouteChange = () => {
      if (enableSave) {
        if (confirm("You have unsaved changes! 保存せずに移動しますか？")) {
          //i- get here if the user click "ok" and go back
          setEnableSave(false);
          return true;
        } else {
          //i- get here if the user click "cancel" and stop going back
          try {
            throw "Abort route change by user's confirmation. Ignore this message";
          } catch {
            console.log("user canceled route");
          }
        }
      } else {
        //i- get here if no changes made, so going back without confirmation
        return true;
      }
    };

    router.events.on("routeChangeStart", handelRouteChange);

    return () => {
      if (window) {
        // window.onbeforeunload = null;
        window.removeEventListener("beforeunload", preventClose);
      }
      router.events.off("routeChangeStart", handelRouteChange);
      // router.beforePopState(() => true);
    };
  }, [enableSave]);

  const fabStyle = {
    margin: 0,
    top: 100,
    bottom: "auto",
    right: "4%",
    left: "auto",
    position: "fixed",
  };

  const toggleToast = () => {
    setShowToast(!showToast);
  };

  const toggleGoBackAlert = () => setGoBackAlert(!goBackAlert);

  const saveUnit = async () => {
    enableSave && setEnableSave(false);
    console.log(customUnit);
    if (stopSave) {
      console.log("no submission");
    } else {
      const user = getAuth().currentUser;
      if (user) {
        try {
          await updateDoc(doc(db, DB_USER_VOCAB, user.uid), {
            [unitTitle]: { ...customUnit },
          });
          toggleToast();
        } catch {
          console.log("error");
        }
      } else {
        console.log("user need to login");
      }
    }
  };

  const changeUnitName = (e: React.ChangeEvent<any>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    //i- change title in each vocab
    setCustomVocabs(
      customVocabs.map((v) => {
        // console.log(v);
        v.unit = newTitle;
        return v;
      })
    );
    enableSave && setEnableSave(true);
  };

  const addNewVocab = () => {
    !enableSave && setEnableSave(true);
    setCustomVocabs([
      ...customVocabs,
      {
        id: customVocabs.length,
        unit: unitTitle,
        num: customVocabs.length + 1,
        parts: "",
        en: "",
        noun: "",
        tverb: "",
        itverb: "",
        adj: "",
        adv: "",
        prep: "",
        conn: "",
        sentence: "",
      },
    ]);
  };

  const checkValue = () => {
    console.log(enableSave);
    history.back();
  };

  //adding a new vocab
  return (
    <Container className="mt-3">
      <Alert isOpen={goBackAlert} toggle={toggleGoBackAlert}>
        Go back?
      </Alert>
      <Row>
        <Col xs="10" md="8" lg="5" className="me-auto">
          <InputGroup size="lg">
            <InputGroupText>Title:</InputGroupText>
            <Input onChange={changeUnitName} placeholder="私の新しいタイトル" />
          </InputGroup>
        </Col>
        {/* <Col xs="2" className="d-flex justify-content-end">
          <Button color="primary" onClick={checkValue}>
            check
          </Button>
        </Col> */}
      </Row>
      <Row className="mt-5">
        <Col className="d-flex justify-content-end">
          <Toast isOpen={showToast}>
            <ToastHeader toggle={toggleToast}>Saved</ToastHeader>
            <ToastBody>保存されました</ToastBody>
          </Toast>
        </Col>
      </Row>
      {/*i- add button row*/}
      <Row className="justify-content-center">
        <Col xs="1" className="d-flex justify-content-center">
          {/* <a href="/" onClick={addNewVocab}>
            
          </a> */}
          <Button onClick={addNewVocab}>
            <i className="fa fa-plus-square-o" aria-hidden="true" />
          </Button>
        </Col>
      </Row>
      {rows}
      <Fab
        color={enableSave ? "secondary" : "primary"}
        onClick={saveUnit}
        sx={fabStyle}
        disabled={!enableSave}
      >
        Save
      </Fab>
    </Container>
  );
};

export default EditVocab;
