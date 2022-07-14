import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Carousel,
  Badge,
  Spinner,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import web3 from "../web3.js";
import moment from "moment";

const compiledElection = require("../ethereum/build/Election.json");

const ElectionCard = (props) => {
  const [parties, setParties] = useState([]);

  const [created, setCreated] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const partiesCrousel =
    parties.length == 0 ? (
      <Carousel.Item className="mb-3">
        <h5 style={{ color: "#e0e0e0" }}>No Parties Are Added Yet</h5>
      </Carousel.Item>
    ) : (
      parties.map((p) => {
        return (
          <Carousel.Item className="mb-3" key={p[0]}>
            <h5 style={{ color: "#e0e0e0" }}>{p[0]}</h5>
          </Carousel.Item>
        );
      })
    );

  useEffect(async () => {
    try {
      const address = props.data[0];

      const contract = new web3.eth.Contract(
        JSON.parse(JSON.stringify(compiledElection.abi)),
        address
      );

      const partiesData = await contract.methods.getParties().call();
      setParties(partiesData);

      setIsStarted(await contract.methods.isStarted().call());
      setIsCompleted(await contract.methods.isCompleted().call());

      setCreated(+(await contract.methods.createdAt().call()));
      setStart(+(await contract.methods.startedAt().call()));
      setEnd(+(await contract.methods.endAt().call()));
    } catch (err) {
      props.history.push("/notfound");
    }
  }, []);

  return (
    <Container>
      <Row className="border rounded py-2 my-4 bg-card">
        <Col></Col>
        <Col md="6">
          <Row>
            <h2
              style={{
                WebkitTextFillColor: "#fcb045",
                MoxTextFillColor: "#fcb045",
              }}
            >
              {props.data.name}
            </h2>
          </Row>

          <Row className="my-2">{<Carousel>{partiesCrousel}</Carousel>}</Row>
          <Row>
            {isStarted ? (
              isCompleted ? (
                <p>
                  Ended On:{" "}
                  <b>{moment(new Date(end)).format("MMMM Do YYYY, h:mm A")}</b>{" "}
                </p>
              ) : (
                <p>
                  Started On:{" "}
                  <b>
                    {moment(new Date(start)).format("MMMM Do YYYY, h:mm A")}
                  </b>
                  <br />
                  Will End On:{" "}
                  <b>{moment(new Date(end)).format("MMMM Do YYYY, h:mm A")}</b>
                </p>
              )
            ) : (
              <p>
                Created On:{" "}
                <b>
                  {moment(new Date(created)).format("MMMM Do YYYY, h:mm A")}
                </b>
              </p>
            )}
          </Row>
          <Row>
            <p>
              Managed By: <b>{props.data.manager}</b>
            </p>
          </Row>
        </Col>
        <Col md="3">
          <NavLink to={`/${props.data.add}`} style={{ textDecoration: "none" }}>
            <Button
              variant="light"
              type="submit"
              style={{ margin: "80px 0px" }}
            >
              Explore
            </Button>
          </NavLink>
        </Col>
        <Col className="mt-1">
          {isStarted ? (
            isCompleted ? (
              <span
                style={{
                  width: "6.5rem",
                  height: "3rem",
                  fontSize: "14px",
                  background: "#009688",
                  borderRadius: "1rem",
                  padding: "10px 15px",
                }}
              >
                <b>Completed</b>
              </span>
            ) : (
              <span
                style={{
                  width: "6.5rem",
                  height: "3rem",
                  fontSize: "14px",
                  background: "#006db3",
                  borderRadius: "1rem",
                  padding: "10px 20px",
                }}
              >
                <b>Running</b>
                &nbsp; &nbsp;
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </span>
            )
          ) : null}
        </Col>
      </Row>
    </Container>
  );
};

export default ElectionCard;
