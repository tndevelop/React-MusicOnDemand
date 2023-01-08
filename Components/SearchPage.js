import { Container, Row, Col, Button, ListGroup, Form, FormControl, Spinner } from "react-bootstrap"
import { Link } from 'react-router-dom'
import band from '../Images/band.webp'
import { BiArrowBack, BiSearch } from "react-icons/bi"
import { AiFillPlayCircle, AiFillStar, AiTwotoneFilter } from "react-icons/ai"
import { BackButton } from "./BackButton"
import { useEffect, useState } from "react";
import Filters from "./FilterModal"
import API from "../API.js";
import { Howl, Howler } from 'howler';
import { PlayCircleFill, PauseBtn } from 'react-bootstrap-icons';
import { CustomPlaceholder } from 'react-placeholder-image';

//let musicians = [{name: "name1", genre : "genre1"}, {name: "name2", genre : "genre2"}]
const variantColor = "bg-light";
const firstColor = "bg-white";


function SearchPage(props) {
    const [musicians, setMusicians] = useState([]);
    const [changes, setChanges] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [hideForm, setHideForm] = useState(true);
    const [defaultAudios, setDefaultAudios] = useState([]);
    const [from, setFrom] = useState();
    const [to, setTo] = useState();
    const [nPeople, setNPeople] = useState("Any");
    const [genres, setGenres] = useState([]);
    const [instruments, setInstruments] = useState([]);
    const [range, setRange] = useState(false);
    const [lastReview, setLastReview] = useState(0); //just to trigger rerendering
    const [reviewsTriggered, setReviewsTriggered] = useState(false);
    //const [reviewsAvgs, setReviewsreviewsTriggeredAvgs] = useState([]);
    const genresLegenda = props.genresLegenda; //["Rock", "Pop", "Jazz", "Metal", "Classical", "Country", "Disco", "House", "R&M", "Rap", "Trap"];
    const instrumentsLegenda = props.instruments; //["Guitar", "Piano", "Violin", "Saxophone", "Bass", "Trumpet", "Drums", "Flute", "Cello", "Electric Guitar", "Keyboard", "Mixing Console"];

    props.setEditMode(false);

    //update backbutton
    useEffect(() => {
        props.switchHomeStatus(false, "/", "/user");
    }, []);
/*
    const getReviewsAvg = async (id) => {
        const revList = await API.getReviews(id);
        if (revList.length != []){
            const avg = revList.map(r => Number(r.NumberStars)).reduce((a, b) => a + b) / revList.length;
            return avg;
        }else
            return -1
    };*/
    const getMusicians = async () => {
        const musList = await API.getMusicianList();
        //console.log(musList)
        //set list of trophies
        for( var i=0; i<musList.length; i++){
            props.setTrophies((previous) => ({...previous,  idMusician: parseInt(musList[i].idMusician), numTrophies: parseInt(0) }))
        }
        search === "" ? setMusicians(musList) : setMusicians(musList.filter(m => m.name.toLowerCase().match(".*" + search.toLowerCase() + ".*") != null));
    };
    

    //get musicians list, filtered by search bar
    useEffect(() => {
        getMusicians().catch((err) => {
            console.error(err);
        });
        setTimeout(() => {setLoading(false)}, 1000);
    }, [search]);
/*
    const updateReviews = () => {
        //setReviewsAvgs([...reviewsAvgs.splice(0,reviewsAvgs.length)]);
        for (const m in musicians) {
            getReviewsAvg(musicians[m].idMusician).then((avg) => {
                musicians[m].reviewsAvg = avg.toFixed(1); 
                setLastReview(lastReview+1); 
                if(m==musicians.length-1) 
                    setLoading(false);
            })
            .catch((err) => { console.error(err); });
        }
    }*/

    //get reviews avg
    /*useEffect(() => {
        updateReviews();
        
        setTimeout(() => { setLoading(false)}, 1400)
        

    }, [musicians.length, search.length]);*/

    //getMusicians default audios
    useEffect(() => {
        const getDefaultAudios = async () => {
            const audios = await API.getDefaultAudios();
            const defaultAudios = [];
            for (var i = 0; i < audios.length; i++) {
                const newDefault = await API.getAudioByID(audios[i].idAudio)
                defaultAudios.push(newDefault)
            }
            setDefaultAudios(() => defaultAudios)
        };
        getDefaultAudios().catch((err) => {
            console.error(err);
        });
    }, [musicians]); 



    //get musicians filtered by 
    const updateSearchFilters = (dateFrom, dateTo, numberInGroup, selectedGenres, selectedInstruments, rangeSelected) => {
        const updateMusicians = async () => {
            setGenres([...selectedGenres.map(g => genresLegenda.indexOf(g))]);
            setInstruments([...selectedInstruments.map(i => instrumentsLegenda.indexOf(i))]);
            setFrom(dateFrom);
            setTo(dateTo);
            setNPeople(numberInGroup);
            setRange(rangeSelected);
            const musList = await API.getMusicianList([...selectedGenres.map(g => genresLegenda.indexOf(g))], [...selectedInstruments.map(i => instrumentsLegenda.indexOf(i))], numberInGroup, dateFrom, dateTo);
            search === "" ? setMusicians(musList) : setMusicians(musList.filter(m => m.name.toLowerCase().match(".*" + search + ".*") !== null));
        };
        updateMusicians().catch((err) => {
            console.error(err);
        });
        //updateReviews();
        /*setLoading(true)
        let checkReviews = setInterval(() => {
            if(musicians.filter(m => { return m.reviewsAvg == undefined}) == 0){
                setLoading(false);
                
                clearInterval(checkReviews);
            }
        }, 4000);*/
    }
    /*
    const waitForReviews = () => {
        
        if(!reviewsTriggered){  
            setReviewsTriggered(true)
            setLoading(true);
            updateReviews();
            setTimeout(() => { 
                setLoading(false);
                setReviewsTriggered(false);
            }, 3000)
            
        }
    }*/
    const filtersSelected = () => {
        return genres.length!=0 || instruments.length!=0 || !invalidDate(to) || !invalidDate(from) || nPeople != "Any";
    };
    const invalidDate = (date) => {
        return date == undefined || !date.isValid()
      }
    return (
        <Container fluid>
            {props.account === 'Musician' ? <Row style={{ paddingTop: '70px' }} /> : <Row style={{ paddingTop: '10px' }} />}

            <Row className="justify-content-md-center m-2 mb-2">
                <Col xs={10} className="p-0 mr-2">
                    <Form  action="#" role="search" aria-label="Quick search" className="mr-2">
                        <FormControl value={search} type="text" placeholder="Type here musician name" onChange={(event) => setSearch(event.target.value)} />
                    </Form>
                </Col>

                <Col xs={2} className="p-0 mr-2">
                    <Button className = "m-2" onClick={() => setHideForm(false)} variant={filtersSelected() ? "primary" : "bg-light"}>
                        <AiTwotoneFilter className="mt-1 mr-2 ml-2" size={30} />
                    </Button>
                </Col>
            </Row>

            <Row>
                <ListGroup variant="flush">
                    {loading ? <Spinner style={{ position: "fixed", top:"150px", left: "50px"}} className="mt-4 ms-4" animation="border" /> : <>
                        {musicians.sort((a,b)=>b.reviewsAvg-a.reviewsAvg).map((m, index) => {

                            var a = null;
                            var existsDefault = false;
                            for (var i = 0; i < defaultAudios.length; i++) {
                                if (m.idMusician == defaultAudios[i].idMusician) {
                                    a = defaultAudios[i];
                                    existsDefault = true;
                                    break;
                                }
                            }

                            return (
                                <Row style={{margin: '10px', marginBottom: '0px', marginRight: '0px'}}>
                                        <ListGroup.Item className = { index % 2 === 1 ? variantColor : firstColor } index={m.id} as={Link} key={index} to={{pathname: `/profile/${m.idMusician}`,state : {name : m.name, musicianId: m.idMusician}}}>

                                        <Row className="justify-content-md-center">

                                            <Col >
                                                <img width="60" height="60" src={(m.profilePicture === "NULL" || m.profilePicture == null) ? <CustomPlaceholder width={20} height={200} /> : require(`../Images/${m.profilePicture}`)}></img>
                                            </Col>
                                            <Col>
                                                <Row style={{ "font-weight": "bold"}}>
                                                    {m.name}
                                                </Row>
                                                <Row>{m.genres.map((g, index) => <>{genresLegenda[g]}   </>)}</Row>
                                                <Row style={{ "fontSize": "12px" }}>{m.instruments.map((i, index) => <>{instrumentsLegenda[i]}   </>)}</Row>
                                            </Col>
                                            <Col style={{ "fontSize": "15px" }} xs={3}>                                                
                                                    {m.reviewsAvg}<AiFillStar /> ({m.reviewsCount})
                                            </Col>
                                            <Col xs={2}>
                                                {existsDefault ? <><AudioSample key={a.path} path={a.path} /></> : ""}
                                            </Col>
                                        </Row>
                                            
                                        </ListGroup.Item>
                                </Row>
                                
                            );
                        })}</>}
                </ListGroup>
            </Row>
            {hideForm ? (
                ""
            ) : (
                <Filters.FilterModal
                    instruments={instrumentsLegenda}
                    genres={genresLegenda}
                    hideForm={hideForm}
                    setHideForm={setHideForm}
                    updateSearchFilters={updateSearchFilters}
                    selGenres={genres}
                    selInstruments={instruments}
                    selN = {nPeople}
                    selTo= {to}
                    selFrom = {from}
                    selRange = {range}
                ></Filters.FilterModal>)}
        </Container>
    );
}

function AudioSample(props) {
    const [pause, setPause] = useState(false);
    const [music, setMusic] = useState(null);

    const SoundPlay = (src) => {
        const sound = new Howl({ src })
        Howler.volume(1.0);
        setMusic(sound);
        sound.play();
    }

    return (
          
        <>
            {pause ? (
                <PauseBtn className="mt-2" size="42" onClick={(event) => {
                    event.preventDefault()
                    music.stop();
                    setPause(false);
                }}></PauseBtn>
            ) : (
                <PlayCircleFill className="mt-2" size="42" onClick={(event) => {
                    event.preventDefault()
                    SoundPlay(require(`../Audios/${props.path}`));
                    setPause(true);
                }}></PlayCircleFill>
            )
            }
        </>
        
    )
}

export default SearchPage;