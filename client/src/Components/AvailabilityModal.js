import { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row, Alert, Popover, OverlayTrigger } from "react-bootstrap";
import { QuestionCircleFill } from "react-bootstrap-icons";
import dayjs from "dayjs";
import API from '../API.js';
import { AiOutlinePlus, AiOutlineCloseCircle } from 'react-icons/ai'
import { BiTrash } from 'react-icons/bi'
import Calendar from "react-calendar";
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
dayjs.extend(isSameOrAfter)



function AvailabilityModal(props) {
  //Task paramaters
  const [datesFrom, setDatesFrom] = useState(props.availableDatesFROMToShowInAM);
  const [datesTo, setDatesTo] = useState(props.availableDatesTOToShowInAM);
  const [dow, setDow] = useState([{ name: "Mon", selected: props.recurrentAvaialabilities.includes("Mon") ? true : false, numDay: 1 },
  { name: "Tue", selected: props.recurrentAvaialabilities.includes("Tue") ? true : false, numDay: 2 },
  { name: "Wed", selected: props.recurrentAvaialabilities.includes("Wed") ? true : false, numDay: 3 },
  { name: "Thu", selected: props.recurrentAvaialabilities.includes("Thu") ? true : false, numDay: 4 },
  { name: "Fri", selected: props.recurrentAvaialabilities.includes("Fri") ? true : false, numDay: 5 },
  { name: "Sat", selected: props.recurrentAvaialabilities.includes("Sat") ? true : false, numDay: 6 },
  { name: "Sun", selected: props.recurrentAvaialabilities.includes("Sun") ? true : false, numDay: 0 }]);

  const [unavailableDates, setUnavailableDates] = useState(props.unavailableDates);
  const [period, setPeriod] = useState([]);
  const [messageAlert, setMessageAlert] = useState("");
  const [noPeriods, setNoPeriods] = useState(datesFrom.length === 0 ? true : false);

  const addPeriod = () => {
    setDatesFrom((previous) => [...previous, ""])
    setDatesTo((previous) => [...previous, ""])
  }

  useEffect(() => {
    var periods = []
    for (var i = 0; i < datesTo.length; i++) {
      if (datesTo[i] !== "NULL")
        periods.push(i);
    }
    setPeriod(periods)
  }, [datesTo]);

  const deletePeriod = (index) => {
    const newFrom = datesFrom;
    const newTo = datesTo;
    newFrom.splice(index, 1);
    newTo.splice(index, 1);
    setDatesFrom([...newFrom]);
    setDatesTo([...newTo]);
  }

  const changeDays = (index) => {
    const newDays = dow.map((d) => d.name == dow[index].name ? { name: d.name, selected: !d.selected, numDay: d.numDay } : d);
    setDow(newDays);
  }

  const setDates = (event, index, fromOrTo) => {
    const newDates = fromOrTo === "from" ? datesFrom : datesTo;
    let newDate;
    newDate = event.target.value ? dayjs(event.target.value) : "";
    newDates[index] = newDate;
    fromOrTo === "from" ? setDatesFrom([...newDates]) : setDatesTo([...newDates]);
  }

  const setUnavailability = (date) => {
    var found = false;
    let dateUnavailable;
    let dateIn = dayjs(dayjs(date).format("YYYY-MM-DD").toString());

    for (var i = 0; i < unavailableDates.length; i++) {
      dateUnavailable = dayjs(unavailableDates[i].format("YYYY-MM-DD").toString());
      if (dateIn.format("YYYY-MM-DD").toString() === dateUnavailable.format("YYYY-MM-DD").toString()) {
        found = true;
        break;
      }
    }

    if (found === true) {
      setUnavailableDates((previous) => {
        return previous.filter(elem => elem.format("YYYY-MM-DD").toString() !== dateIn.format("YYYY-MM-DD").toString())
      })
    }
    else {
      console.log("ENTRato")
      setUnavailableDates((previous) => [...previous, dayjs(date)]);
    }
  };

  const validateDates = (event, index, fromOrTo) => {

    //a period must not be past
    if (dayjs(event.target.value).isBefore(dayjs())) {
      setMessageAlert("You cannot select a past date!")
      return false;
    }
    //dateTo must not be before dateFrom
    if (fromOrTo === "to") {
      if (dayjs(event.target.value).isSameOrBefore(datesFrom[index])) {
        setMessageAlert("The end date must be after the start date!")
        return false
      }
    }
    //different periods must not overlap
    if (index !== 0) {
      for (var i = index - 1; i >= 0; i--) {
        let date = dayjs(event.target.value);
        let dateFrom = datesFrom[i] !== "NULL" ? dayjs(datesFrom[i].format("YYYY-MM-DD").toString()) : ""
        let dateTo = (datesTo[i] !== "NULL" && datesTo[i] !== undefined) ? dayjs(datesTo[i].format("YYYY-MM-DD").toString()) : ""

        if (dateFrom !== "" && dateTo !== "") {
          if (date.isSameOrAfter(dateFrom) && date.isSameOrBefore(dateTo)) {
            setMessageAlert("You selected two overlapping availability periods!")
            return false
          }
        }
        else if (dateTo === "" && dateFrom !== "") {
          if (date.isSame(dateFrom)) {
            setMessageAlert("You selected two overlapping availability periods!")
            return false
          }
        }
      }
    }
    return true
  };

  const validateUnavailability = (date) => {
    let d = dayjs(dayjs(date).format("YYYY-MM-DD").toString());

    //cannot select a past date
    if (d.isBefore(dayjs())) {
      setMessageAlert("You cannot select a past date!")
      return false
    }

    //unavailability date must not overlap with the selected available periods  
    for (var i = datesFrom.length - 1; i >= 0; i--) {
      let dateFrom = datesFrom[i] !== "NULL" ? dayjs(datesFrom[i].format("YYYY-MM-DD").toString()) : ""
      let dateTo = (datesTo[i] !== "NULL" && datesTo[i] !== undefined) ? dayjs(datesTo[i].format("YYYY-MM-DD").toString()) : ""

      if (dateFrom !== "" && dateTo !== "") {
        if (d.isSameOrAfter(dateFrom) && d.isSameOrBefore(dateTo)) {
          setMessageAlert("You said you are available on that day! Pay attention")
          return false
        }
      }
      else if (dateTo === "" && dateFrom !== "") {
        if (d.isSame(dateFrom)) {
          setMessageAlert("You said you are available on that day! Pay attention")
          return false
        }
      }

    }
    return true
  };

  const popoverPeriods = (
    <Popover style={{ width: "260px" }} id="popover-basic-default">
      <Popover.Body style={{ fontFamily: "verdana" }}>
        <Row className="block-example border-bottom border-dark">
          <Col style={{ textAlign: "center", paddingBottom: "0.5rem" }}>In this section you can choose the availability periods in which event organizers can contact you</Col>
        </Row>
        <Row>
          <Col style={{ paddingTop: "0.5rem", textAlign: "center" }}>To select single dates, just fill the "From" field</Col>
        </Row>
      </Popover.Body>
    </Popover>
  );

  const popoverRecurrent = (
    <Popover style={{ width: "260px" }} id="popover-basic-default">
      <Popover.Body style={{ fontFamily: "verdana" }}>
        <Row>
          <Col style={{ textAlign: "center", paddingBottom: "0.5rem" }}>In this section you can choose periodic dates in which you are available (e.g. all Sundays)</Col>
        </Row>
      </Popover.Body>
    </Popover>
  );

  const popoverExcluding = (
    <Popover style={{ width: "260px" }} id="popover-basic-default">
      <Popover.Body style={{ fontFamily: "verdana" }}>
        <Row>
          <Col style={{ textAlign: "center", paddingBottom: "0.5rem" }}>Select in the below calendar the dates of unavailability among the chosen recurrent ones</Col>
        </Row>
      </Popover.Body>
    </Popover>
  );


  /**
   * Submit changes to backend
   * @param {*} event
   */
  const submitChanges = async (event) => {
    event.preventDefault();

    const postAvailablePeriod = async () => {

      //post available period
      var availablePeriods = [];
      for (var i = 0; i < datesFrom.length; i++) {
        let start = ""
        if (datesFrom[i] !== "" && datesFrom[i] !== undefined && datesFrom[i] !== "NULL") {
          start = datesFrom[i].format("YYYY-MM-DD").toString()
          let end = "NULL"
          if (datesTo[i] !== "" && datesTo[i] !== undefined && datesTo[i] !== "NULL")
            end = datesTo[i].format("YYYY-MM-DD").toString()

          availablePeriods.push({ idMusician: props.idMusician, startDate: start, endDate: end })
        }
        else {
          setMessageAlert("Empty Date From")
          return false
        }
      }

      await deleteAvail();
      for (var i = 0; i < availablePeriods.length; i++)
        await API.addAvailablePeriod(availablePeriods[i])

      return true;

    }

    const recurrentAvailability = async () => {
      //post recurrent availability
      for (var i = 0; i < dow.length; i++) {
        if (dow[i].selected) {
          await API.addRecurrentAvailability({ idMusician: props.idMusician, dayOfWeek: dow[i].name })
        }
      }
    }

    const postUnavailability = async () => {
      //post unavailability
      for (var i = 0; i < unavailableDates.length; i++) {
        const date = unavailableDates[i].format("YYYY-MM-DD").toString()
        await API.addUnavailability({ idMusician: props.idMusician, singleDate: date })
      }

      props.setHideForm(true);
    };

    const deleteAvail = async () => {
      await API.deleteAvailability(props.idMusician)
    }

    var x = await postAvailablePeriod();
    if (x) {
      recurrentAvailability();
      postUnavailability();
    }
    props.setForTrigger((prev)=> (!prev))

  }

  return (
    <>
      <Modal
        animation={false}
        show={!props.hideForm}
        onHide={() => props.setHideForm(true)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Availability</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row style={{ textAlign: "center" }}>
              <Form.Label style={{ marginBottom: "1rem", fontSize: "20px" }}><b>Availability periods</b>
                <OverlayTrigger trigger={["hover", "hover"]} placement="right" overlay={popoverPeriods}>
                  <QuestionCircleFill className="Default" size="13px" style={{ marginLeft: "0.5rem" }} />
                </OverlayTrigger>
              </Form.Label>

              <Form.Group controlId="selectedDate">

                {datesFrom.map((_, index) =>
                  <Row>
                    <Col xs={5} className="pr-0">
                      {noPeriods ? "" :
                        <>
                          <div style={{ paddingBottom: "0.5rem" }}>From:</div>
                          <Form.Control key={index} htmlSize="20px"
                            type="date"
                            value={(datesFrom[index] !== "NULL" && datesFrom[index] !== undefined && datesFrom[index] !== null && datesFrom[index] !== "") ? datesFrom[index].format("YYYY-MM-DD") : ""}
                            onChange={(event) => {
                              if (validateDates(event, index, "from")) {
                                setDates(event, index, "from")
                              }
                            }}
                          />
                        </>
                      }
                    </Col>

                    <Col xs={5}>
                      {period.includes(index) ?
                        <>
                          To :
                          <Button onClick={() => {
                            setPeriod((prev) => prev.splice(prev.indexOf(index), 1))
                            setDatesTo((prev) => {
                              const newState = [...prev]
                              newState[prev.indexOf(datesTo[index])] = "NULL"
                              return newState
                            }
                            )
                          }}
                            style={{ paddingTop: "0rem" }}
                            variant="bg-light"><AiOutlineCloseCircle style={{ color: "red" }}/></Button>
                          <Form.Control key={100 - index}
                            type="date"
                            value={
                              (datesTo[index] !== "NULL" && datesTo[index] !== null && datesTo[index] !== "" && datesTo[index] !== undefined) ?
                                (datesTo[index].format("YYYY-MM-DD")) : (
                                  (datesTo[index] === undefined) ? undefined : "")}
                            onChange={(event) => {
                              if (validateDates(event, index, "to")) {
                                setDates(event, index, "to")
                              }
                            }}
                          />
                          <Form.Control.Feedback>
                            Date must be today or after
                          </Form.Control.Feedback>
                        </>
                        : ((noPeriods || datesFrom[index] === "NULL") ? "" : <Button onClick={() => { setPeriod((prev) => [...prev, index]); }} style={{ paddingTop: "1.5rem" }} variant="bg-light"><AiOutlinePlus /></Button>)
                      }
                    </Col>


                    <Col xs={1} className="pl-0 ml-0"><Button className="mt-4 ml-0 pl-0" variant="bg-light" onClick={() => deletePeriod(index)}><BiTrash size={25}/></Button></Col>
                  </Row>
                )}
                {messageAlert !== "" ? <Alert variant="danger" onClose={() => setMessageAlert("")} style={{ marginTop: "2rem" }} dismissible>
                  <Alert.Heading>Error!</Alert.Heading>
                  <p>
                    {messageAlert}
                  </p>
                </Alert> : ""}
                <Button variant="primary" onClick={() => { setNoPeriods(false); setDatesFrom((prev) => [...prev, "NULL"]); }} style={{ marginTop: "2rem", marginRight: "1rem", marginBottom: "2rem" }}>Add available period</Button>



              </Form.Group>
            </Row>

            <Row className="border-top border-dark" style={{ textAlign: "center" }}>
              <Form.Group controlId="formBasicCheckbox">
                <Col>
                  <Form.Label style={{ marginTop: "1.5rem", marginBottom: "1rem", fontSize: "20px" }}><b>Recurrent availabilities</b></Form.Label>
                  <OverlayTrigger trigger={["hover", "hover"]} placement="right" overlay={popoverRecurrent}>
                    <QuestionCircleFill className="Default" size="13px" style={{ marginLeft: "0.5rem" }} />
                  </OverlayTrigger>
                </Col>
                <Col>
                  {dow.map((d, index) =>
                    <Form.Check
                      inline
                      type="checkbox"
                      checked={dow[index].selected}
                      label={dow[index].name}
                      id={index}
                      onChange={(event) => changeDays(index)}
                    />
                  )
                  }</Col>
              </Form.Group>
            </Row>

            <Row >
              <Form.Group controlId="unavailableDates">
                <Form.Label style={{ marginTop: "1.5rem", fontSize: "17px" }}><b>Excluding</b>
                  <OverlayTrigger trigger={["hover", "hover"]} placement="right" overlay={popoverExcluding}>
                    <QuestionCircleFill className="Default" size="13px" style={{ marginLeft: "0.5rem" }} />
                  </OverlayTrigger>
                </Form.Label>
                <Calendar
                  //enable only day of weeks chosen by the user
                  tileDisabled={({ date }) => {
                    const day = date.getDay()
                    const found = dow.find(el => el.numDay === day)
                    return found.selected === false
                  }}
                  //mark selected unavailable days in the calendar
                  tileClassName={({ date }) => {
                    var mark = []
                    var mark2 = []
                    for (var i = 0; i < props.availableDates.length; i++) {
                      mark.push(props.availableDates[i].format("DD-MM-YYYY").toString())
                    }

                    var day = -1;
                    var found = false;
                    for (var i = 0; i < props.recurrentAvaialabilities.length; i++) {

                      switch (props.recurrentAvaialabilities[i]) {
                        case "Sun":
                          day = 0;
                          break;
                        case "Mon":
                          day = 1;
                          break;
                        case "Tue":
                          day = 2;
                          break;
                        case "Wed":
                          day = 3;
                          break;
                        case "Thu":
                          day = 4;
                          break;
                        case "Fri":
                          day = 5;
                          break;
                        case "Sat":
                          day = 6;
                          break;
                      }
                      let myDate = new Date(date);
                      if (myDate.getDay() === day)
                        found = true;
                    }

                    for (var i = 0; i < props.unavailableDates.length; i++) {
                      mark2.push(props.unavailableDates[i].format("DD-MM-YYYY").toString())
                    }
                    //console.log(mark2)

                    if ((mark.find(x => x === dayjs(date).format("DD-MM-YYYY")) || found === true) && (mark2.find(x => x === dayjs(date).format("DD-MM-YYYY")) === undefined)){
                      if (!dayjs(date).isBefore(dayjs())) {
                        return 'highlightUnavailability'
                      }
                      else{
                        if (!dayjs(date).isBefore(dayjs())) {
                          return 'highlightUnavailability2'
                        }
                      }
                    }
                  }}
                  //set unavailable days
                  onChange={(date) => {
                    if (validateUnavailability(date)) {
                      setUnavailability(date)
                      
                    }
                  }}
                />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => { console.log("UD: ", unavailableDates); props.setHideForm(true) }} variant="secondary">Close</Button>
          <Button onClick={submitChanges} variant="primary">Save changes</Button>
        </Modal.Footer>

      </Modal>
    </>
  );
}

export default AvailabilityModal;
