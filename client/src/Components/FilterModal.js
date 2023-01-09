import { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row, Dropdown, DropdownButton, Container, Table} from "react-bootstrap";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import API from '../API.js';
import BootstrapSelect from 'react-bootstrap-select-dropdown';
import { MdRemoveDone, MdRemoveCircleOutline } from 'react-icons/md'
import { FcClearFilters } from 'react-icons/fc'
import { RiFilterOffFill } from 'react-icons/ri'


import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

dayjs.extend(isSameOrAfter);

const peopleInGroup = [{

  "labelKey": "optionItem1",
    "value": "1",
    "isSelected" : false,
},
{
    "labelKey": "optionItem2",
    "value": "2",
    "isSelected" : false,
},{
    "labelKey": "optionItem3",
    "value": "3",
    "isSelected" : false,
},{
    "labelKey": "optionItem4",
    "value": "4",
    "isSelected" : false,
},{
    "labelKey": "optionItem5",
    "value": "5+",
    "isSelected" : false,
},{ 
    "labelKey": "optionItem6",
    "value": "Any",
    "isSelected" : true,
}]


function MultipleSelectNative(props) {
  //const [props.selectedItems, props.setSelectedItems] = React.useState([]);
  const cleanSelection = () => {
    const tmp = props.selectedItems;
    tmp.splice(0, tmp.length);
    props.setSelectedItems([...tmp]);
  }
  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = props.selectedItems;
    let count = 0;
    for (let i = 0, l = options.length; i < l; i += 1) {
        if (options[i].selected) {
            count++;
        }
    }
    //if more then one is selected than it's just an onFocus event
    if(count <= 1)
        //select/deselect item
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                const idx = value.indexOf(options[i].value) ;
                idx == -1 ? value.push(options[i].value) : value.splice(idx, 1);
            }
        }
  
    props.setSelectedItems([...value]);    
    
  };
 
  return (
    
        
      <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
          <Row>
      <Col>
        <InputLabel shrink htmlFor="select-multiple-native">
          {props.title}
        </InputLabel>
        <Select
          multiple
          native
          value={props.selectedItems}
          // @ts-ignore Typings are not considering `native`
          onChange={handleChangeMultiple}
          label={props.title}
          inputProps={{
            id: 'select-multiple-native',
          }}
        >
          {props.items.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
       </Col>
       <Col xs={4}>
            <Button variant="dark" onClick={() => {cleanSelection()}} className="mt-4">Deselect all <RiFilterOffFill size="20"/></Button>
       </Col>
       </Row>
      </FormControl>
    
  );
}


function FilterModal(props) {
  //Task paramaters
  const [dateFrom, setDateFrom] = useState(props.selFrom);
  const [dateTo, setDateTo] = useState(props.selTo);
  const [selectedInstruments, setSelectedInstruments] = React.useState([...props.instruments.filter((i, index) => props.selInstruments.includes(index))]);
  const [selectedGenres, setSelectedGenres] = React.useState([...props.genres.filter((g, index) => props.selGenres.includes(index))]);
  const [numberInGroup, setNumberInGroup] = useState(props.selN);
  const [selectRange, setSelectRange] = useState(props.selRange ? true : false); 
  /**
   * Check if description is not empty (only whitespaces not allowed)
   * @returns {boolean}
   */
   
  const validDeadline = () => {
    return (invalidDate(dateTo) && dateFrom) || (invalidDate(dateTo) && invalidDate(dateFrom)) || (dateTo &&  dateTo.isSameOrAfter(dateFrom, "day") )
  };
  const notPast = () => {
    return (invalidDate(dateFrom) || dateFrom.isSameOrAfter(dayjs().subtract(1, 'day')))
  }
  
  const invalidDate = (date) => {
    return date == undefined || !date.isValid()
  }
  const assignPeopleInGroup = (selectedOptions) => { 
      setNumberInGroup(selectedOptions.selectedValue[0])
    }


  const submitChanges = (event) => {
    event.preventDefault();
    if (!validDeadline()) return;
    props.updateSearchFilters(dateFrom, dateTo, numberInGroup, selectedGenres, selectedInstruments, selectRange);
    props.setHideForm(true);
  };

  return (
    <>
      <Modal
        animation={false}
        show={!props.hideForm}
        onHide={() => props.setHideForm(true)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter your search</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
                      
            <Form.Group controlId="selectedDate">
              {selectRange? 
              <>             
                <Row className='mb-2 mt-2'>
                  <Col xs={4} className='mt-2'>
                    Date from: 
                  </Col>
                  <Col xs={8}>
                    <Form.Control
                      isInvalid={!validDeadline() || !notPast()}
                      type="date"
                      value={dateFrom ? dateFrom.format("YYYY-MM-DD") : ""}
                      onChange={(event) =>
                          setDateFrom(dayjs(event.target.value))
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {notPast() ? "Date from must be before date to" : "Date can't be in the past" }
                    </Form.Control.Feedback>
                  </Col>
                  </Row>
                  <Row>
                  <Col xs={4} className='mt-2'>
                    Date to: 
                  </Col>
                  <Col xs={8}>
                    <Form.Control 
                      isInvalid={!validDeadline()}
                      type="date"
                      value={dateTo ? dateTo.format("YYYY-MM-DD") : ""}
                      onChange={(event) =>
                          setDateTo(dayjs(event.target.value))
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      To date must be after from date.
                    </Form.Control.Feedback>
                  </Col>
                </Row>
              </>
              : 
              <Row className='mt-2'>
                <Col xs={2} className='mt-2'>
                  Date: 
                </Col>
                <Col xs={10}>
                  <Form.Control
                    isInvalid={!validDeadline() || !notPast()}
                    type="date"
                    value={dateFrom ? dateFrom.format("YYYY-MM-DD") : ""}
                    onChange={(event) =>
                        setDateFrom(dayjs(event.target.value))
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                  {notPast() ? "Date from must be before date to" : "Date can't be in the past" }
                  </Form.Control.Feedback>
                </Col>
              </Row>}

              <Form.Check className="mt-2" checked={selectRange} type="checkbox" label="Select a range of dates" onChange={(event) => setSelectRange(event.target.checked)} />    
              
            </Form.Group>

            <Row className='mt-4'>
              <Form.Group>  
                <Row>
                  <Col xs={6} className='mt-2'>
                    <Form.Label>Members in group:</Form.Label>
                  </Col>
                  <Col xs={6}>
                  <Form.Select value ={numberInGroup} onChange={(event) => setNumberInGroup(event.target.value)} aria-label="Any">
                    <option>Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </Form.Select>
                  </Col>
                  {/*<BootstrapSelect onChange={assignPeopleInGroup} placeholder="Not selected" options={props.selN == undefined ? peopleInGroup : peopleInGroup.map(i => {i.isSelected = false; return i; }).map(i => {if(i.value == props.selN) i.isSelected = true; return i; })} />*/}
                </Row>
                
               </Form.Group>
            </Row>
            <Row className='mt-4'>
              <Form.Group>       
                <MultipleSelectNative selectedItems={selectedGenres} setSelectedItems={setSelectedGenres} items={props.genres} title="Genres"></MultipleSelectNative>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group>        
                  <MultipleSelectNative selectedItems={selectedInstruments} setSelectedItems={setSelectedInstruments} items={props.instruments} title="Instruments"></MultipleSelectNative>
              </Form.Group>
            </Row>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => props.setHideForm(true)} variant="secondary">
            Close
          </Button>
          <Button onClick={submitChanges} variant="primary">
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function CategoriesModal(props) {
  //Task paramaters
  const [musician, setMusician] = useState(props.musician);

  const loadInstruments = () => {
    var insts = [];
    var index = 0;
    for (let i =0; i<props.musician.instrumentsList.length; i++) {
      if (props.instruments[props.musician.instrumentsList[i]] != undefined) {
        insts[index]=props.instruments[props.musician.instrumentsList[i]];
        index = index + 1;
      }
        
    }  
    return insts;
  }

  const loadGenres = () => {
    var gen = [];
    var index = 0;
    for (let i =0; i<props.musician.genresList.length; i++) {
      if (props.genres[props.musician.genresList[i]] != undefined) {
        gen[index]=props.genres[props.musician.genresList[i]];
        index = index + 1;
      }
        
    }  
    return gen;
  }

  const [selectedInstruments, setSelectedInstruments] = React.useState(loadInstruments());//)
  const [selectedGenres, setSelectedGenres] = React.useState(loadGenres());//Array.from(props.musician.genresList).map(g => {props.genres[g]} )

  const submitChanges = (event) => {
    event.preventDefault();
    const genresIdxs = selectedGenres.map(g => props.genres.indexOf(g)).toString();
    const instrumentsIdxs = selectedInstruments.map(i => props.instruments.indexOf(i));
    setMusician( oldMusician => ({...oldMusician, genresList: genresIdxs, instrumentsList: instrumentsIdxs}));
    props.setMusician(oldMusician => ({...oldMusician, numberMember: musician.numberMember, genresList: genresIdxs, instrumentsList: instrumentsIdxs}));
    props.setHideForm(true);
  };

  return (
    <>
      <Modal
        animation={false}
        show={!props.hideForm}
        onHide={() => props.setHideForm(true)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Choose your filter categories</Modal.Title>
        </Modal.Header>

        <Modal.Body >
          <Container className="align-items-center">   
          <Form >
            <Row >
                <Col xs={8}>
                  <Form.Label column>
                  Number of group members:
                  </Form.Label> 
              </Col>
              <Col xs={3}>
              <Form.Control onChange={(event) => {
                        setMusician( oldMusician => ({...oldMusician, numberMember: event.target.value}));
                        }} value={musician.numberMember? musician.numberMember: 0} type="number" />
              </Col>
            </Row>
            <Row>
            <Form.Group> 
                <Row>
                    <Col>
                        <MultipleSelectNative selectedItems={selectedGenres} setSelectedItems={setSelectedGenres} items={props.genres} title="Genres"></MultipleSelectNative>
                    </Col>       
                    
                </Row>
            </Form.Group>
            </Row>
            <Row>
            <Form.Group>        
                <MultipleSelectNative selectedItems={selectedInstruments} setSelectedItems={setSelectedInstruments} items={props.instruments} title="Instruments"></MultipleSelectNative>
            </Form.Group>
            </Row>

          </Form>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => props.setHideForm(true)} variant="secondary">
            Close
          </Button>
          <Button onClick={submitChanges} variant="primary">
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const Filters = {FilterModal, CategoriesModal}
export default Filters;
