import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import compiledElection from "./../ethereum/build/Election.json";
import web3 from "./../web3";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getDatabase, ref, child, get } from "firebase/database";

const Login = (props) => {
  const [aadhaar, setaadhaar] = useState("");
  const [otp, setotp] = useState("");
  const [partyData, setPartyData] = useState(null);
  const [err, setErr] = useState(null);
  const [message, setMessage] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const address = props.match.params.address;
  const index = props.match.params.id;

  useEffect(async () => {
    window.scroll(0, 0); 
    try {
      const election = new web3.eth.Contract(
        JSON.parse(JSON.stringify(compiledElection.abi)),
        address
      );

      const party = await election.methods.getPartyDetails(index).call();
      setPartyData(party);
    } catch (err) {
      setErr(err);
    }
  }, []);

  const submitFormHandler = async (e) => {
    e.preventDefault();
    setErr(null);
    setMessage(null);
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (result) => {
        const user = result.user;
        try {
          const election = new web3.eth.Contract(
            JSON.parse(JSON.stringify(compiledElection.abi)),
            address
          );

          await window.ethereum.send("eth_requestAccounts");

          const accounts = await web3.eth.getAccounts();
          await election.methods.castVote(aadhaar, index).send({
            from: accounts[0],
            gas: "3000000",
          });
          setLoading(false);
          setMessage("You have Successfully Casted your Vote");
          setIsDisable(false);
          setTimeout(() => {
            setMessage(null);
            props.history.push(`/${address}`);
          }, 5000);
        } catch (err) {
          setErr(
            "We Faced Some Error While Processing Your Request!!! Maybe You have already casted the vote!!!"
          );
          setLoading(false);
        }
      })
      .catch((err) => {
        setErr(err.message);
        setLoading(false);
      });
  };

  const [rendered, setRendered] = useState(false);
  const sendOtpHandler = async (e) => {
    e.preventDefault();
    setErr(null);
    setMessage(null);
    setIsDisable(false);
    try {
      const database = getDatabase();
      const dbRef = ref(database);
      get(child(dbRef, `${aadhaar}/number`)).then((snapshot) => {
        if (snapshot.exists()) {
          const auth = getAuth();
          window.recaptchaVerifier = new RecaptchaVerifier(
            "send-otp-btn",
            {
              size: "invisible",
              callback: (response) => {
                setRendered(true);
                const appVerifier = window.recaptchaVerifier;

                signInWithPhoneNumber(auth, snapshot.val(), appVerifier)
                  .then((confirmationResult) => {
                    window.confirmationResult = confirmationResult;
                    setMessage("OTP Sent Successfully!!!");
                    setIsDisable(true);
                    setTimeout(() => {
                      setMessage(null);
                    }, 5000);
                  })
                  .catch((err) => {
                    setErr(err.message);
                  });
              },
              "expired-callback": () => {
                setErr("Session Expired");
              },
            },
            auth
          );
          try {
            if (!rendered) {
              window.recaptchaVerifier
                .verify()
                .then((widgetId) => {
                  window.recaptchaWidgetId = widgetId;
                })
                .catch((err) => {
                  setErr(err.message);
                });
            } else {
              const appVerifier = window.recaptchaVerifier;

              signInWithPhoneNumber(auth, snapshot.val(), appVerifier)
                .then((confirmationResult) => {
                  window.confirmationResult = confirmationResult;
                  setMessage("OTP Sent Successfully!!!");
                  setIsDisable(true);
                  setTimeout(() => {
                    setMessage(null);
                  }, 5000);
                })
                .catch((err) => {
                  setErr("Please Reload before requestion another OTP!!!");
                });
            }
          } catch (err) {
            setErr(err.message);
          }
        } else {
          setErr("Invalid Aadhar Number");
        }
      });
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Row className="mt-3">
        <Col
          xs={12}
          md={4}
          className="border-right my-2 col d-flex justify-content-center"
        >
          {partyData ? (
            <div>
              <br />
              <Card style={{ width: "18rem" }}>
                <Card.Img
                  style={{ width: "17rem", height: "17rem", margin: "auto" }}
                  variant="top"
                  src={partyData.image}
                  className="p-2"
                />
                <Card.Body>
                  <Card.Title>{partyData.name}</Card.Title>
                  <Card.Text>
                    Lead By{" "}
                    <b style={{ color: "#e0e0e0" }}> {partyData.leaderName}</b>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ) : null}
        </Col>
        <Col xs={12} md={8}>
          <Container className="bg-white rounded pb-5 pt-2" style={{maxHeight:"29rem"}}>
            <br />
            <br />
            <h2 className="text-center mb-4 text-black">Enter Credentials</h2>
            <Form>
              <Form.Group className="mx-5 mb-1" controlId="formBasicEmail">
                <Row>
                  <Col md={7}>
                    <Form.Label className="text-black">
                      Aadhaar Number
                    </Form.Label>
                    <Form.Control
                      className="text-black"
                      type="aadhaar"
                      required
                      placeholder="Enter Aadhaar Number (eg. 012345678901)"
                      value={aadhaar}
                      onChange={(e) => {
                        setaadhaar(e.target.value);
                      }}
                    />
                  </Col>

                  <Col md={5} className="mt-3">
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={(e) => sendOtpHandler(e)}
                      disabled={aadhaar.length == 12 ? false : true}
                    >
                      Send OTP
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mx-5" controlId="formBasicPassword">
                <Row>
                  <Col md={7}>
                    <Form.Label className="text-black">OTP</Form.Label>
                    <Form.Control
                      className="text-black"
                      type="otp"
                      required
                      placeholder="Enter OTP"
                      value={otp}
                      id="send-otp-btn"
                      onChange={(e) => {
                        setotp(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md={5} className="mt-2">
                    <Button
                      className="mt-2"
                      variant="primary"
                      type="submit"
                      onClick={(e) => {
                        submitFormHandler(e);
                      }}
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
                        "Cast Vote"
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
              <br />
              {err ? (
                <Row>
                  <p style={{ color: "red" }}>{err}</p>
                </Row>
              ) : (
                <Row><p></p></Row>
              )}

              {message ? (
                <Row>
                  <p style={{ color: "#76ff03" }}>{message}</p>
                </Row>
              ) : (
                <Row><p></p></Row>
              )}
            </Form>
          </Container>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
