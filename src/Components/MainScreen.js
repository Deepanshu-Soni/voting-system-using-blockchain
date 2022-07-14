import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Spinner,
  Image,
} from "react-bootstrap";
import ElectionCard from "./ElectionCard";
import web3 from "../web3.js";
import SpinnerBar from "./CustomSpinner.js";

const factoryAddress = "0x16B11ED70143a7a2706b32F86b346e3b2d06f8fE";
const compiledFactory = require("../ethereum/build/ElectionFactory.json");

const Elections = (props) => {
  const [err, setErr] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [electionsData, setElectionsData] = useState([]);
  const [create, setCreate] = useState(false);
  const [elecName, setElecName] = useState("");
  const [managerName, setManagerName] = useState("");

  const [startLoading, setStartLoading] = useState(false);

  useEffect(async () => {
    setStartLoading(true);
    try {
      const factory = new web3.eth.Contract(
        JSON.parse(JSON.stringify(compiledFactory.abi)),
        factoryAddress
      );
      let elections = await factory.methods.getElections().call();
      elections = elections.slice().reverse();
      setElectionsData(elections);
    } catch (err) {
      props.history.push("/notfound");
    } finally {
      setStartLoading(false);
    }
  }, []);

  const createElectionHandler = (e) => {
    e.preventDefault();
    setErr(null);
    setMessage(null);
    create ? setCreate(false) : setCreate(true);
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();
    setErr(null);
    setMessage(null);
    setLoading(true);
    try {
      const factory = new web3.eth.Contract(
        JSON.parse(JSON.stringify(compiledFactory.abi)),
        factoryAddress
      );

      await window.ethereum.send("eth_requestAccounts");
      const accounts = await web3.eth.getAccounts();

      await factory.methods
        .createElection(elecName, managerName, new Date().getTime())
        .send({
          from: accounts[0],
          gas: "3000000",
        });

      let elections = await factory.methods.getElections().call();
      elections = elections.slice().reverse();
      setElectionsData(elections);
      setMessage("Election Created Successfully!!");
      setElecName("");
      setManagerName("");
    } catch (err) {
      // console.log(err);
      setErr(err.message);
    }
    setLoading(false);
  };

  const createForm = (
    <Container >
      <Row>
        <Col></Col>
        <Col className="border rounded py-3 px-4 bg-white">
          <Form onSubmit={submitFormHandler}>
            <Form.Group className="mx-3 mt-2 mb-3" controlId="formBasicEmail">
              <Form.Label className="text-black">
                <b>Election Name</b>
              </Form.Label>
              <Row>
                <Col>
                  {" "}
                  <Form.Control
                    className="text-black"
                    required
                    type="electionName"
                    placeholder="Enter Name of the Election"
                    value={elecName}
                    onChange={(e) => {
                      setElecName(e.target.value);
                    }}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mx-3" controlId="formBasicPassword">
              <Form.Label className="text-black">
                <b>Manager Name</b>
              </Form.Label>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    className="text-black"
                    required
                    type="managerName"
                    placeholder="Enter Name of the Manager"
                    value={managerName}
                    onChange={(e) => {
                      setManagerName(e.target.value);
                    }}
                  />
                </Col>
              </Row>
            </Form.Group>
            {err ? <p style={{ color: "red" }}>{err}</p> : null}
            {message ? <p style={{ color: "#76ff03" }}>{message}</p> : null}
            <Button
              className="m-2"
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Create"
              )}
            </Button>
          </Form>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );

  return (
    <div
      className="pt-3"
      style={{
        minHeight: "100vh",
        backgroundColor: create ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0)",
        backdropFilter: "blur(15px)",
      }}
    >
      {startLoading ? (
        <SpinnerBar />
      ) : (
        <div>
          <Row>
            <Col></Col>
            <Col md="6">
              <h1 className="text-center">
                {create ? "Create A New Election" : "Ongoing Elections"}
              </h1>
            </Col>
            <Col md="3">
              <Button
                variant="danger"
                onClick={(e) => createElectionHandler(e)}
                disabled={loading}
              >
                {create ? "Cancel" : "Create Election"}
              </Button>
            </Col>
          </Row>
          <br />
          {create ? (
            createForm
          ) : (
            <Container>
              {electionsData && electionsData.length == 0 ? (
                <Image
                  className="rounded"
                  style={{ width: "50%" }}
                  src="https://assets.materialup.com/uploads/805362d3-e9d6-4aa7-b314-ed9dde22558b/preview.gif"
                />
              ) : null}
              {electionsData &&
                electionsData.map((d) => (
                  <ElectionCard data={d} key={d.name} />
                ))}
            </Container>
          )}
        </div>
      )}
    </div>
  );
};

export default Elections;
