import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Image, Table, Form, Button, Card, Navbar, Nav, ButtonGroup, Modal, Popover, OverlayTrigger, Spinner } from "react-bootstrap";
import { Trash, Plus, PlayCircleFill, PlayBtn, Facebook, Youtube, Twitter, Instagram, StarFill, Star, TrophyFill, Image as ImageIcon, QuestionCircleFill, Pencil, PauseBtn } from 'react-bootstrap-icons';
import { Radio } from '@mui/material';
import { AiOutlineMail } from 'react-icons/ai';
import { useEffect, useState } from "react";
import API from '../API';
import Calendar from 'react-calendar'
//import 'react-calendar/dist/Calendar.css';
import '../Calendar.css';
import dayjs from "dayjs";
import AvailabilityModal from './AvailabilityModal';
import { getThemeProps } from '@mui/system';
import Filters from "./FilterModal";
import { useParams, Link } from 'react-router-dom';
import { Howl, Howler } from 'howler';
import ReactPlayer from 'react-player';
import FileUploadMP3 from './FileUploadMP3';
import FileUploadMP4 from './FileUploadMP4';
import FileUploadIMG from './FileUploadIMG';
import ContactUs from './Email';
import { CustomPlaceholder } from 'react-placeholder-image';


const daysEqual = (dayjsDate, dateDate) => {
    /*if (2022 == dateDate.getFullYear() && 1 == dateDate.getMonth()+1 && 13 == dateDate.getDate()){
        console.log(dayjsDate)
        console.log(dayjsDate.get('year'))
        console.log(dayjsDate.get('month'))
        console.log(dayjsDate.get('date')) 
    }*/
    return (dayjsDate.get('year') === dateDate.getFullYear() && dayjsDate.get('month') === dateDate.getMonth() && dayjsDate.get('date') === dateDate.getDate())
}


function ProfilePage(props) {

    const params = useParams();
    props.setIdTrophy(params.id)
    const [musicianID, setMusicianID] = useState(params.id);
    const [newMusician, _] = useState(props.newMusician);
    const [musician, setMusician] = useState({});
    const [averageRating, setAverageRating] = useState(5);
    const [reviewList, setReviewList] = useState([]);
    //const [account, setAccount] = useState("Guest");
    const [value, onChange] = useState(new Date());
    const [hideForm, setHideForm] = useState(true);
    const [hideCategories, setHideCategories] = useState(true);
    const [availableDates, setAvailableDates] = useState([]);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [recurrentAvaialabilities, setRecurrentAvailabilities] = useState([]);

    const [availableDatesFROMToShowInAM, setAvailableDatesFROMToShowInAM] = useState([]);
    const [availableDatesTOToShowInAM, setAvailableDatesTOToShowInAM] = useState([]);

    const [forTrigger, setForTrigger] = useState(false);
    const [availableDaysOfWeek, setAvailableDaysOfWeek] = useState([]);
    const [selectedRadio, setSelectedRadio] = useState(-1);
    const [defaultSong, setdDefaultSong] = useState({});
    const [updateReviews, setUpdateReviews] = useState(false);
    const [existsprofilePicture, setExistProfilePicture] = useState(false);
    const [loadAllAudios, setLoadAllAudios] = useState(false);
    const [loadAllVideos, setLoadAllVideos] = useState(false);
    const [numVideos, setNumVideos] = useState(0);
    const [numAudios, setNumAudios] = useState(0);
    const [addOrDeleteTrophies, setAddOrDeleteTrophies] = useState(1);
    const [finished, setFinished] = useState(0);
    const [imgPrev, setImgPrev] = useState("");
    const [phonePrev, setPhonePrev] = useState("");
    const [webPrev, setWebPrev] = useState("");
    const [emailPrev, setEmailPrev] = useState("");
    const [socialPrev, setSocialPrev] = useState(0);


    //Handle Modal ADD New Audio, Video, Img, Review
    const [showAudio, setShowAudio] = useState(false);
    const handleShowAudio = () => setShowAudio(true);
    const handleCloseAudio = () => setShowAudio(false);
    const [showNewAudio, setShowNewAudio] = useState(true);
    const [showVideo, setShowVideo] = useState(false);
    const handleShowVideo = () => setShowVideo(true);
    const handleCloseVideo = () => setShowVideo(false);
    const [showNewVideo, setShowNewVideo] = useState(true);
    const [showIMG, setShowIMG] = useState(false);
    const handleShowIMG = () => setShowIMG(true);
    const handleCloseIMG = () => setShowIMG(false);
    const [showReview, setShowReview] = useState(false);
    const handleShowReview = () => setShowReview(true);
    const handleCloseReview = () => setShowReview(false);
    const [audioName, setAudioName] = useState("");
    const [videoName, setVideoName] = useState("");
    const [imgName, setImgName] = useState("");
    const [path, setPath] = useState("");
    const [uploadPressed, setUploadPressed] = useState(false);
    const [loading, setLoading] = useState(true);

    //UPDATE NAME AUDIO AND VIDEO
    const [updateNameAudio, setUpdateNameAudio] = useState([]);
    const [updateNameVideo, setUpdateNameVideo] = useState([]);
    const [stateForAudioName, setStateForAudioName] = useState(false);
    const [stateForVideoName, setStateForVideoName] = useState(false);

    //EMAIL
    const [showEmailForm, setShowEmailForm] = useState(false);
    const handleShowEmail = () => setShowEmailForm(true);


    const genresLegenda = props.genresLegenda; //["Rock", "Pop", "Jazz", "Metal", "Classical", "Country", "Disco", "House", "R&M", "Rap", "Trap"];
    const instruments = props.instruments; //["Guitar", "Piano", "Violin", "Saxophone", "Bass", "Trumpet", "Drums", "Flute", "Cello", "Electric Guitar", "Keyboard", "Mixing Console"];

    useEffect(() => {
        if (finished == 2) {
            setAddOrDeleteTrophies(0);
        }
    }, [finished]);

    props.setIdTrophy(params.id)
    useEffect(() => {
        if(props.page=="/")
            props.switchHomeStatus(false, "/", `/profile/${params.id}`);
        else
            props.switchHomeStatus(false, "/user", `/profile/${params.id}`);
        setLoading(true);
        setMusicianID(params.id);
        props.setIdTrophy(params.id);
        props.setTrophies((previous) => ({ ...previous, idMusician: parseInt(musicianID), numTrophies: parseInt(0) }))
        setAddOrDeleteTrophies(1);
    }, [params.id]);


    // Retrieve musician details
    useEffect(() => {
        props.setTrophies((previous) => ({ ...previous, idMusician: parseInt(musicianID), numTrophies: parseInt(0) }))
        const addTrophy = async (n) => {
            //console.log(n);
            props.setTrophies(oldTrophies => ({ ...oldTrophies, numTrophies: parseInt(parseInt(oldTrophies.numTrophies) + parseInt(n)) }));
            //console.log(props.trophies);
        }

        const retrieveMusician = async () => {
            await API.getMusician(musicianID).then(musician => {
                setMusician(musician);

                if (musician.profilePicture === "NULL") {
                    setExistProfilePicture(false)
                }
                else {
                    setExistProfilePicture(true)
                    setImgPrev(musician.profilePicture)
                    addTrophy(1)
                }
                if (musician.phone != "") {
                    setPhonePrev(musician.phone)
                    addTrophy(2)
                }
                if (musician.website != "") {
                    setWebPrev(musician.website)
                    addTrophy(2)
                }
                if (musician.email != "") {
                    setEmailPrev(musician.email)
                    addTrophy(2)
                }
                if (musician.facebookProfile != "" || musician.instagramProfile != "" || musician.twitterProfile != "" || musician.youtubeChannel != "") {
                    setSocialPrev(1)
                    addTrophy(5)
                }
            }).catch(err => {
                console.error(err);
            });
        }
        retrieveMusician();

        setTimeout(() => {setLoading(false)}, 1000);
    }, [musicianID]);

    // Retrieve review list
    useEffect(() => {
        const retrieveReview = async () => {
            await API.getReviews(musicianID).then(reviewList => {
                setReviewList(() => reviewList);
                var sumRating = 0;
                for (var i = 0; i < reviewList.length; i++) {
                    sumRating += reviewList[i].NumberStars;
                }
                setAverageRating((sumRating / reviewList.length).toFixed(1));
            }).catch(err => {
                console.error(err);
            });
        }
        retrieveReview();
    }, [musicianID, updateReviews]);

    // Retrieve available dates
    useEffect(() => {
        const availablePeriods = async () => {
            var arrayFrom = [];
            var arrayTo = [];
            await API.getAvailability(musicianID).then(s => {
                for (var i = 0; i < s.length; i++) {
                    if (s[i].endDate === "NULL") {
                        setAvailableDates((previous) => [...previous, dayjs(s[i].startDate)]);
                    }
                    else {
                        for (let date = dayjs(s[i].startDate); date.isSameOrBefore(dayjs(s[i].endDate));) {
                            setAvailableDates((previous) => [...previous, date])
                            date = date.add('1', 'day')
                        }
                    }

                    arrayFrom.push(dayjs(s[i].startDate));

                    if (s[i].endDate !== "NULL")
                        arrayTo.push(dayjs(s[i].endDate))
                    else
                        arrayTo.push("NULL")


                }
                setAvailableDatesFROMToShowInAM(arrayFrom);
                setAvailableDatesTOToShowInAM(arrayTo);
            })
        };

        const unavailablePeriods = async () => {
            await API.getUnavailability(musicianID).then(s => {
                setUnavailableDates([]);
                for (var i = 0; i < s.length; i++) {
                    let date = dayjs(s[i].singleDate);
                    setUnavailableDates((previous) => [...previous, date]);
                }
            }).catch(err => console.log(err))
        }

        const recurrentAvailabilities = async () => {

            await API.getDayOfWeekAvailability(musicianID).then(s => {
                setRecurrentAvailabilities([])
                for (var i = 0; i < s.length; i++) {
                    setRecurrentAvailabilities((previous) => [...previous, s[i].dayOfWeek]);
                }
            }).catch(err => console.log(err))
        }

        availablePeriods();
        unavailablePeriods();
        recurrentAvailabilities();
    }, [musicianID, props.account, forTrigger]);


    const displayGenres = () => {
        const genres = musician.genresList.map(g => genresLegenda[g]);
        return genres;
    }

    // Save profile edits
    const saveProfile = async () => {
        try {
            //add new musician
            let success = true;
            if (newMusician) {
                await API.createMusician(musician).catch(err => {
                    success = false;
                    console.error(err);
                }).finally(() => {
                    if (!success) {
                        //TODO: setErrorMessage("Unable to save profile. Please try again later.");

                    } else {
                        //TODO: show success message
                        props.setEditMode(false);
                    }
                });
            } else {//update musician
                await API.updateMusician(musician).catch(err => {
                    success = false;
                    console.error(err);
                }).finally(() => {
                    if (!success) {
                        //TODO: setErrorMessage("Unable to save profile. Please try again later.");
                    } else {
                        //TODO: show success message
                        props.setEditMode(false);
                    }
                });
            }
            //set default audio for musician
            if (Object.keys(defaultSong).length !== 0) {
                const newDefault = { idMusician: parseInt(defaultSong.idMusician), idAudio: parseInt(defaultSong.idAudio) }
                await API.setDefaultAudio(newDefault)
                    .catch(err => {
                        console.error(err);
                    });
            }
            //update name of audio
            for (var i = 0; i < updateNameAudio.length; i++) {
                await API.updateAudioNameMusician(updateNameAudio[i]).catch(err => {
                    console.error(err);
                });
            }
            //update name of video
            for (var j = 0; j < updateNameVideo.length; j++) {
                await API.updateVideoNameMusician(updateNameVideo[j]).catch(err => {
                    console.error(err);
                });
            }

            setStateForAudioName((prev) => !prev);
            setStateForVideoName((prev) => !prev);

            if (musician.profilePicture == "NULL" && imgPrev != "") {
                props.setTrophies(oldTrophies => ({ ...oldTrophies, numTrophies: parseInt(parseInt(oldTrophies.numTrophies) - parseInt(1)) }));
                setImgPrev("")
            }
            else if (musician.profilePicture != "NULL" && imgPrev == "") {
                props.setTrophies(oldTrophies => ({ ...oldTrophies, numTrophies: parseInt(parseInt(oldTrophies.numTrophies) + parseInt(1)) }));
                setImgPrev(musician.profilePicture)
            }


            if (musician.phone == "" && phonePrev != "") {
                props.setTrophies(oldTrophies => ({ ...oldTrophies, numTrophies: parseInt(parseInt(oldTrophies.numTrophies) - parseInt(2)) }));
                setPhonePrev("")
            }
            else if (musician.phone != "" && phonePrev == "") {
                props.setTrophies(oldTrophies => ({ ...oldTrophies, numTrophies: parseInt(parseInt(oldTrophies.numTrophies) + parseInt(2)) }));
                setPhonePrev(musician.phone)
            }


            if (musician.website == "" && webPrev != "") {
                props.setTrophies(oldTrophies => ({ ...oldTrophies, numTrophies: parseInt(parseInt(oldTrophies.numTrophies) - parseInt(2)) }));
                setWebPrev("")
            }
            else if (musician.website != "" && webPrev == "") {
                props.setTrophies(oldTrophies => ({ ...oldTrophies, numTrophies: parseInt(parseInt(oldTrophies.numTrophies) + parseInt(2)) }));
                setWebPrev(musician.website)
            }


            if (musician.email == "" && emailPrev != "") {
                props.setTrophies(oldTrophies => ({ ...oldTrophies, numTrophies: parseInt(parseInt(oldTrophies.numTrophies) - parseInt(2)) }));
                setEmailPrev("")
            }
            else if (musician.email != "" && emailPrev == "") {
                props.setTrophies(oldTrophies => ({ ...oldTrophies, numTrophies: parseInt(parseInt(oldTrophies.numTrophies) + parseInt(2)) }));
                setEmailPrev(musician.email)
            }

            if ((musician.facebookProfile == "" && musician.instagramProfile == "" && musician.twitterProfile == "" && musician.youtubeChannel == "") && socialPrev === 1) {
                props.setTrophies(oldTrophies => ({ ...oldTrophies, numTrophies: parseInt(parseInt(oldTrophies.numTrophies) - parseInt(5)) }));
                setSocialPrev(0)
            }
            else if ((musician.facebookProfile != "" || musician.instagramProfile != "" || musician.twitterProfile != "" || musician.youtubeChannel != "") && socialPrev == 0) {
                props.setTrophies(oldTrophies => ({ ...oldTrophies, numTrophies: parseInt(parseInt(oldTrophies.numTrophies) + parseInt(5)) }));
                setSocialPrev(1)
            }

            //remove profile picture from backend if no longer existing
            /*if (existsprofilePicture === false) {
                await API.deleteProfilePicture(musicianID)
                    .catch(err => {
                        console.error(err);
                    });
            }*/


            setForTrigger((prev) => (!prev))

        } catch (err) {
            console.log(err);
        }

    }

    // Add New Audio for a Musician 
    const addNewAudio = async () => {
        try {
            const audioMusician = {
                idMusician: musicianID,
                AudioName: audioName,
                Path: audioName
            }
            await API.addNewAudio(audioMusician).catch(err => {
                console.error(err);
            }).finally(() => {
                setShowAudio(false);
                setShowNewAudio((prev) => !prev);
                setAddOrDeleteTrophies(5);
                setUploadPressed(false);
            });
        } catch (err) {
            console.log(err);
        }

    }

    const deleteDefaultAudio = async () => {
        try {
            console.log("deleting")
            setSelectedRadio(-1)
            await API.deleteDefaultAudio(musicianID).catch(err => {
                console.error(err);
            })
        } catch (err) {
            console.log(err);
        }
    }


    // Add New IMG for a Musician 
    const addNewIMG = async () => {
        try {

            const imgMusician = {
                idMusician: musicianID,
                profilePicture: imgName
            }

            setMusician(oldMusician => ({ ...oldMusician, profilePicture: imgName }))
            setExistProfilePicture(true);
            setShowIMG(false);
            setUploadPressed(false);
            /* await API.addNewIMG(imgMusician).then(() => {
                 
             }).catch(err => {
                 console.error(err);
             })*/
        } catch (err) {
            console.log(err);
        }

    }


    const addNewVideo = async () => {
        try {
            const videoMusician = {
                idMusician: musicianID,
                VideoName: videoName,
                Path: path
            }
            await API.addNewVideo(videoMusician).catch(err => {
                console.error(err);
            }).finally(() => {
                setShowVideo(false);
                setShowNewVideo((prev) => !prev);
                setAddOrDeleteTrophies(6);
                setUploadPressed(false);
            });
        } catch (err) {
            console.log(err);
        }

    }

    const popoverDefault = (
        <Popover style={{ width: "300px" }} id="popover-basic-default">
            <Popover.Body>
                The song you choose as "default" will be visible in your profile's preview
            </Popover.Body>
        </Popover>
    );

    const popoverUploadAudio = (
        <Popover style={{ width: "300px" }} id="popover-basic-default">
            <Popover.Body>
                You must select an audio and then click "Upload" before saving the changes
            </Popover.Body>
        </Popover>
    );

    const popoverUploadVideo = (
        <Popover style={{ width: "300px" }} id="popover-basic-default">
            <Popover.Body>
                You must select a video and then click "Upload" before saving the changes
            </Popover.Body>
        </Popover>
    );

    const popoverUploadIMG = (
        <Popover style={{ width: "300px" }} id="popover-basic-default">
            <Popover.Body>
                You must select an image and then click "Upload" before saving the changes
            </Popover.Body>
        </Popover>
    );

    const editClick = () => {
        props.setEditMode(true);
    };

    const cancelEdit = () => {
        props.setEditMode(false);
    };

    return (
        <>
        {loading ? <><Spinner style={{ position: "fixed", top:"100px", left: "50px"}} className="mt-4 ms-4" animation="border" /></> : 
        <Container>

            {props.account === "Maneskin" && props.page === "/profile/1" ?
                <>
                    <Row style={{ paddingTop: '70px' }} />
                    {props.editMode ? <></> :
                        <Row className="m-2">
                            <Button variant="outline-primary" className="justify-content-center" onClick={() => { setAddOrDeleteTrophies(0); editClick(); }}>
                                Edit profile <Pencil size={20} />
                            </Button>
                        </Row>
                    }
                </>
                : <></>}

            { //This is the Edit view
                props.editMode ?
                    <div>
                        <Row>
                            <ButtonGroup style={{ position: "fixed", bottom: "0px", right: "0px" }}>
                                <Button variant="light" onClick={() => { setAddOrDeleteTrophies(0); cancelEdit() }}>Cancel</Button>
                                <Button onClick={() => { setAddOrDeleteTrophies(0); saveProfile(); }}>Save</Button>
                            </ButtonGroup>
                        </Row>
                        <Row>
                            <Col md={{ span: 6, offset: 3 }}>
                                <Form.Group className="justify-content-center BandName">
                                    <Form.Control size="lg" type="text" placeholder="Enter Band Name" value={musician.name} onChange={(event) => {
                                        setMusician(oldMusician => ({ ...oldMusician, name: event.target.value }));
                                    }}></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={{ span: 3, offset: 0 }}>



                            </Col>
                        </Row>
                        <Row className="justify-content-center ProfileImage">
                            <Card className="align-items-center" style={{ maxHeight: '18rem' }}>
                                {(existsprofilePicture && musician.profilePicture !== "NULL") ? (<Card.Img src={require(`../Images/${musician.profilePicture}`)} alt="Band Image" style={{ width: 'fit-content', height: '100%' }} />)
                                    : (<CustomPlaceholder
                                        width={400}
                                        height={200}
                                        text="No Profile Picture"
                                    />)
                                }
                                <Card.ImgOverlay className='d-flex align-items-end EditImage'>
                                    <Button variant="primary" onClick={handleShowIMG} class="btn btn-primary btn-sm">
                                        <ImageIcon />
                                        <Plus className="Plus" style={{marginBottom: "0rem"}} />
                                    </Button>
                                    {existsprofilePicture ? (<Button className='pl-10 pr-10' centered variant="danger" onClick={() => {
                                        setExistProfilePicture(false);
                                        setMusician(oldMusician => ({ ...oldMusician, profilePicture: "NULL" }))
                                    }}><Trash />
                                    </Button>) : ""}
                                    <Modal show={showIMG} onHide={handleCloseIMG} centered>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Add New Image</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <FileUploadIMG setImgName={setImgName} setUploadPressed={setUploadPressed} /></Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleCloseIMG}>
                                                Close
                                            </Button>
                                            {uploadPressed ? <Button variant="primary" onClick={addNewIMG}>Save Changes</Button>
                                                :
                                                <>
                                                    <Button variant="primary" disabled>
                                                        Save Changes
                                                    </Button>
                                                    <OverlayTrigger trigger={["hover", "hover"]} placement="right" overlay={popoverUploadIMG}>
                                                        <QuestionCircleFill className="Default" />
                                                    </OverlayTrigger>
                                                </>
                                            }
                                        </Modal.Footer>
                                    </Modal>
                                </Card.ImgOverlay>
                            </Card>
                        </Row>

                        <Row style={{ padding: '20px' }}>
                            Categories: <Col>
                                <Card>
                                    <Button onClick={() => setHideCategories(false)} variant="outline-primary">
                                        <Table borderless>
                                            <tbody>
                                                <tr style={{ textAlign: 'start' }}>
                                                    Number of group members: {musician.numberMember}
                                                </tr>
                                                <tr style={{ textAlign: 'start' }}>
                                                    {Array.from(String(musician.genresList)).map(g => <>{genresLegenda[g]} </>)}
                                                </tr>
                                                <tr style={{ textAlign: 'start' }}>
                                                    {Array.from(String(musician.instrumentsList)).map(g => <>{instruments[g]} </>)}
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <Card.ImgOverlay className='d-flex align-items-end EditImage'>
                                            <Pencil size={20} />
                                        </Card.ImgOverlay>
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="ProfileHeading">
                            Audio Samples:
                        </Row>
                        <Row style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                            Default: <Col style={{ paddingLeft: '5px' }}>
                                <OverlayTrigger trigger={["hover", "hover"]} placement="right" overlay={popoverDefault}>
                                    <QuestionCircleFill className="Default" />
                                </OverlayTrigger>
                                <Button style={{ marginLeft: '1rem' }} size="sm" variant="primary" onClick={deleteDefaultAudio}>No default song</Button>
                            </Col>
                        </Row>
                        <AudioTable musicianID={musicianID} showNewAudio={showNewAudio} trophies={props.trophies} setTrophies={props.setTrophies} stateForAudioName={stateForAudioName} updateNameAudio={updateNameAudio} setUpdateNameAudio={setUpdateNameAudio} editMode={props.editMode} selectedRadio={selectedRadio} setSelectedRadio={setSelectedRadio} setdDefaultSong={setdDefaultSong} setShowNewAudio={setShowNewAudio} addOrDeleteTrophies={addOrDeleteTrophies} setFinished={setFinished} setAddOrDeleteTrophies={setAddOrDeleteTrophies} />
                        <Row className='d-flex align-items-emd AddSampleButton'>
                            <div>
                                <Button variant="primary" onClick={handleShowAudio}>
                                    Add New Audio
                                </Button>

                                <Modal show={showAudio} onHide={handleCloseAudio} centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Add New Audio</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <FileUploadMP3 setAudioName={setAudioName} setUploadPressed={setUploadPressed} /></Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseAudio}>
                                            Close
                                        </Button>

                                        {uploadPressed ? <Button variant="primary" onClick={addNewAudio}>Save Changes</Button>
                                            :
                                            <>
                                                <Button variant="primary" onClick={addNewAudio} disabled>
                                                    Save Changes
                                                </Button>
                                                <OverlayTrigger trigger={["hover", "hover"]} placement="right" overlay={popoverUploadAudio}>
                                                    <QuestionCircleFill className="Default" />
                                                </OverlayTrigger>
                                            </>
                                        }

                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </Row>


                        <Row className="ProfileHeading">
                            Video Samples:
                        </Row>
                        <VideoTable musicianID={musicianID} showNewVideo={showNewVideo} trophies={props.trophies} setTrophies={props.setTrophies} stateForVideoName={stateForVideoName} setUpdateNameVideo={setUpdateNameVideo} updateNameVideo={updateNameVideo} editMode={props.editMode} setShowNewVideo={setShowNewVideo} addOrDeleteTrophies={addOrDeleteTrophies} setFinished={setFinished} setAddOrDeleteTrophies={setAddOrDeleteTrophies} />
                        <Row className='d-flex align-items-emd AddSampleButton'>
                            <div>
                                <Button variant="primary" onClick={handleShowVideo}>
                                    Add New Video
                                </Button>

                                <Modal show={showVideo} onHide={handleCloseVideo}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Add New Video</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Row>
                                            <b style={{ color: "black", float: "left" }} className='mb-4'>{"Upload a video"}</b>
                                        </Row>
                                        <Row><FileUploadMP4 className='mb-4' setVideoName={setVideoName} setPath={setPath} setUploadPressed={setUploadPressed} /></Row>
                                        <Row><b style={{ color: "#00B74A", float: "left", fontSize: "25px" }} className='mb-4'>{"OR"}</b></Row>
                                        <Row><b style={{ color: "black", float: "left" }} className='mb-4'>{"Insert a Youtube link"}</b></Row>
                                        <Form.Control type="text" placeholder="Enter Video Name" onChange={(event) => {
                                            setVideoName(event.target.value);
                                        }} />
                                        <Form.Control type="text" placeholder="Enter YouTube Link" onChange={(event) => {
                                            setPath(event.target.value);
                                        }} />
                                    </Modal.Body>

                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseVideo}>
                                            Close
                                        </Button>
                                        {(uploadPressed || path !== "") ? <Button variant="primary" onClick={addNewVideo}>Save Changes</Button>
                                            :
                                            <>
                                                <Button variant="primary" disabled>
                                                    Save Changes
                                                </Button>
                                                <OverlayTrigger trigger={["hover", "hover"]} placement="right" overlay={popoverUploadVideo}>
                                                    <QuestionCircleFill className="Default" />
                                                </OverlayTrigger>
                                            </>
                                        }
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </Row>


                        <Row className="ProfileHeading">
                            Contact Details
                        </Row>
                        <ContactTable musician={musician} editMode={props.editMode} setMusician={setMusician} />
                        <Row className="ProfileHeading">
                            Availability
                        </Row>
                        <Calendar
                            minDate={new Date()}
                            maxDate={new Date(2024, 11, 31)}
                            tileDisabled={({ date }) => {
                                //disable if not in recurrent availabilities
                                const dow = [{ name: "Mon", selected: recurrentAvaialabilities.includes("Mon") ? true : false, numDay: 1 },
                                { name: "Tue", selected: recurrentAvaialabilities.includes("Tue") ? true : false, numDay: 2 },
                                { name: "Wed", selected: recurrentAvaialabilities.includes("Wed") ? true : false, numDay: 3 },
                                { name: "Thu", selected: recurrentAvaialabilities.includes("Thu") ? true : false, numDay: 4 },
                                { name: "Fri", selected: recurrentAvaialabilities.includes("Fri") ? true : false, numDay: 5 },
                                { name: "Sat", selected: recurrentAvaialabilities.includes("Sat") ? true : false, numDay: 6 },
                                { name: "Sun", selected: recurrentAvaialabilities.includes("Sun") ? true : false, numDay: 0 }];
                                const day1 = date.getDay()
                                const found1 = dow.find(el => el.numDay === day1)

                                //disable if not in available periods
                                var mark = []
                                var mark2 = []
                                for (var i = 0; i < availableDates.length; i++) {
                                    mark.push(availableDates[i].format("DD-MM-YYYY").toString())
                                }

                                var day2 = -1;
                                var found2 = false;
                                for (var i = 0; i < recurrentAvaialabilities.length; i++) {
                                    switch (recurrentAvaialabilities[i]) {
                                        case "Sun":
                                            day2 = 0;
                                            break;
                                        case "Mon":
                                            day2 = 1;
                                            break;
                                        case "Tue":
                                            day2 = 2;
                                            break;
                                        case "Wed":
                                            day2 = 3;
                                            break;
                                        case "Thu":
                                            day2 = 4;
                                            break;
                                        case "Fri":
                                            day2 = 5;
                                            break;
                                        case "Sat":
                                            day2 = 6;
                                            break;
                                    }
                                    let myDate = new Date(date);
                                    //if the date is in the recurrent ones
                                    if (myDate.getDay() === day2)
                                        found2 = true;
                                }

                                for (var i = 0; i < unavailableDates.length; i++) {
                                    mark2.push(unavailableDates[i].format("DD-MM-YYYY").toString())
                                }

                                //if the date is in the musician's available period or in the recurrent availabilities
                                if ((mark.find(x => x === dayjs(date).format("DD-MM-YYYY")) || found2 === true)) {
                                    //if it is in the unavailable dates
                                    if (mark2.find(x => x === dayjs(date).format("DD-MM-YYYY")) !== undefined) {
                                        //disable
                                        return true
                                    }
                                    if (!dayjs(date).isBefore(dayjs())) {
                                        //do not disable
                                        return false
                                    }
                                    else {
                                        if (!dayjs(date).isBefore(dayjs())) {
                                            return true
                                        }
                                    }
                                }
                                else {
                                    return (found1.selected === false)
                                }
                            }}
                        />
                        <Button className='mt-2 mb-2' onClick={() => setHideForm(false)}>Set Up Availability</Button>
                        <Row style={{ paddingTop: '40px' }} />
                    </div> :

                    // This is the public view
                    <div>
                        <Row className="justify-content-center BandName">
                            {musician.name}
                        </Row>
                        <Row className="justify-content-center ProfileImage">
                            {(existsprofilePicture && musician.profilePicture !== "NULL") ? <Image src={require(`../Images/${musician.profilePicture}`)} alt="Band Image" style={{ width: 'fit-content', height: '100%', maxHeight: '18rem' }} />
                                : (<CustomPlaceholder
                                    width={600}
                                    height={200}
                                    text="No Profile Picture"
                                />)}
                        </Row>
                        <Row style={{ padding: '20px' }}>
                            Categories: <Col>
                                <Table borderless>
                                    <tbody>
                                        <tr style={{ textAlign: 'start' }}>
                                            Number of group members: {musician.numberMember}
                                        </tr>
                                        <tr style={{ textAlign: 'start' }}>
                                            {musician.genresList ? Array.from(String(musician.genresList)).map(g => <>{genresLegenda[g]} </>) : <></>}
                                        </tr>
                                        <tr style={{ textAlign: 'start' }}>
                                            {musician.instrumentsList ? Array.from(String(musician.instrumentsList)).map(g => <>{instruments[g]} </>) : <></>}
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row className="ProfileHeading">
                            Audio Samples:
                        </Row>
                        <AudioTable musicianID={musicianID} showNewAudio={showNewAudio} trophies={props.trophies} setTrophies={props.setTrophies} stateForAudioName={stateForAudioName} editMode={props.editMode} selectedRadio={selectedRadio} setSelectedRadio={setSelectedRadio} loadAllAudios={loadAllAudios} addOrDeleteTrophies={addOrDeleteTrophies} setFinished={setFinished} setAddOrDeleteTrophies={setAddOrDeleteTrophies} setNumAudios={setNumAudios}/>
                        {numAudios > 2 ? (
                            <Row className="LoadMore">
                                {loadAllAudios ? <div onClick={() => setLoadAllAudios(false)}>Load less</div> :
                                    <div onClick={() => setLoadAllAudios(true)}>Load more</div>}
                            </Row>
                        ) : <></>}
                        <Row className="ProfileHeading">
                            Video Samples:
                        </Row>
                        <Row className="justify-content-center">
                            <Col>
                                <VideoTable musicianID={musicianID} showNewVideo={showNewVideo} trophies={props.trophies} setTrophies={props.setTrophies} stateForVideoName={stateForVideoName} editMode={props.editMode} loadAllVideos={loadAllVideos} addOrDeleteTrophies={addOrDeleteTrophies} setFinished={setFinished} setAddOrDeleteTrophies={setAddOrDeleteTrophies} setNumVideos={setNumVideos}/>
                            </Col>
                        </Row>
                        {numVideos > 2 ? (
                            <Row className="LoadMore">
                            {loadAllVideos ? <div onClick={() => setLoadAllVideos(false)}>Load less</div> :
                                <div onClick={() => setLoadAllVideos(true)}>Load more</div>}
                        </Row>
                        ) : <></>}
                        <Row className="ProfileHeading">
                            Contact Details
                        </Row>
                        <ContactTable musician={musician} editMode={props.editMode} setMusician={setMusician} />
                        <Socials musician={musician} />
                        <Row className="ProfileHeading">
                            Availability
                        </Row>
                        <Calendar
                            minDate={new Date()}
                            //value={[new Date(), new Date(2022, 0, 14)]}
                            //tileContent={({ activeStartDate, date, view }) => date.getDay() === 5 ? <p>b</p> : null}
                            //tileDisabled={({ activeStartDate, date, view }) => musicianUnavailableDates.filter(d => daysEqual(d, date)).length !== 0}
                            tileClassName={({ activeStartDate, date, view }) => 'booked'}
                            tileDisabled={({ date }) => {
                                //disable if not in recurrent availabilities
                                const dow = [{ name: "Mon", selected: recurrentAvaialabilities.includes("Mon") ? true : false, numDay: 1 },
                                { name: "Tue", selected: recurrentAvaialabilities.includes("Tue") ? true : false, numDay: 2 },
                                { name: "Wed", selected: recurrentAvaialabilities.includes("Wed") ? true : false, numDay: 3 },
                                { name: "Thu", selected: recurrentAvaialabilities.includes("Thu") ? true : false, numDay: 4 },
                                { name: "Fri", selected: recurrentAvaialabilities.includes("Fri") ? true : false, numDay: 5 },
                                { name: "Sat", selected: recurrentAvaialabilities.includes("Sat") ? true : false, numDay: 6 },
                                { name: "Sun", selected: recurrentAvaialabilities.includes("Sun") ? true : false, numDay: 0 }];
                                const day1 = date.getDay()
                                const found1 = dow.find(el => el.numDay === day1)

                                //disable if not in available periods
                                var mark = []
                                var mark2 = []
                                for (var i = 0; i < availableDates.length; i++) {
                                    mark.push(availableDates[i].format("DD-MM-YYYY").toString())
                                }

                                var day2 = -1;
                                var found2 = false;
                                for (var i = 0; i < recurrentAvaialabilities.length; i++) {
                                    switch (recurrentAvaialabilities[i]) {
                                        case "Sun":
                                            day2 = 0;
                                            break;
                                        case "Mon":
                                            day2 = 1;
                                            break;
                                        case "Tue":
                                            day2 = 2;
                                            break;
                                        case "Wed":
                                            day2 = 3;
                                            break;
                                        case "Thu":
                                            day2 = 4;
                                            break;
                                        case "Fri":
                                            day2 = 5;
                                            break;
                                        case "Sat":
                                            day2 = 6;
                                            break;
                                    }
                                    let myDate = new Date(date);
                                    //if the date is in the recurrent ones
                                    if (myDate.getDay() === day2)
                                        found2 = true;
                                }

                                for (var i = 0; i < unavailableDates.length; i++) {
                                    mark2.push(unavailableDates[i].format("DD-MM-YYYY").toString())
                                }

                                //if the date is in the musician's available period or in the recurrent availabilities
                                if ((mark.find(x => x === dayjs(date).format("DD-MM-YYYY")) || found2 === true)) {
                                    //if it is in the unavailable dates
                                    if (mark2.find(x => x === dayjs(date).format("DD-MM-YYYY")) !== undefined) {
                                        //disable
                                        return true
                                    }
                                    if (!dayjs(date).isBefore(dayjs())) {
                                        //do not disable
                                        return false
                                    }
                                    else {
                                        if (!dayjs(date).isBefore(dayjs())) {
                                            return true
                                        }
                                    }
                                }
                                else {
                                    return (found1.selected === false)
                                }
                            }}
                        />
                        <Row className='mt-2' style={{ paddingLeft: '10px' }}>
                            <Col className="ReviewHeading">
                                Reviews
                            </Col>
                            <Col style={{ textAlign: 'end' }}>
                                {averageRating} <StarFill />
                            </Col>
                        </Row>
                        <ReviewTable musicianID={musicianID} reviewList={reviewList} />
                        {props.page !== "/profile/1" || props.account !== "Maneskin" ?
                            <>
                                <Button style={{ position: "fixed", bottom: "8px", right: "16px" }} variant="success" onClick={handleShowEmail}>
                                    <AiOutlineMail />
                                    Send an Email</Button>
                                <Row className="AddReviewButton">
                                    <Button onClick={() => handleShowReview()}>Add review</Button>
                                    <AddReviewModal handleCloseReview={handleCloseReview} handleShowReview={handleShowReview} showReview={showReview} musicianID={musicianID} setUpdateReviews={setUpdateReviews} />
                                </Row>
                                <Row style={{ paddingTop: '40px' }} />
                            </>
                            : <></>}

                    </div>
            }
            {hideForm ? (
                ""
            ) : (
                <AvailabilityModal
                    hideForm={hideForm}
                    setHideForm={setHideForm}
                    idMusician={musicianID}
                    availableDates={availableDates}
                    unavailableDates={unavailableDates}
                    recurrentAvaialabilities={recurrentAvaialabilities}

                    availableDatesFROMToShowInAM={availableDatesFROMToShowInAM}
                    availableDatesTOToShowInAM={availableDatesTOToShowInAM}

                    setForTrigger={setForTrigger}

                ></AvailabilityModal>)}
            {hideCategories ? ("") :
                (<Filters.CategoriesModal
                    instruments={instruments}
                    genres={genresLegenda}
                    hideForm={hideCategories}
                    setHideForm={setHideCategories}
                    setMusician={setMusician}
                    musician={musician}
                ></Filters.CategoriesModal>)}

            {showEmailForm ? (
                <ContactUs email={musician.email} showEmailForm={showEmailForm} setShowEmailForm={setShowEmailForm} />
            )
                : ("")
            }
        </Container>
        }
        </>
    );
}

function AudioTable(props) {

    const [audioList, setAudioList] = useState([]);


    // Retrieve audio sample list
    useEffect(() => {
        const retrieveAudio = async () => {
            await API.getAudioSamples(props.musicianID).then(audioList => {
                setAudioList(() => audioList);
                props.setNumAudios(audioList.length);
                props.setFinished((prev) => prev + 1)
            }).catch(err => {
                console.error(err);
            });
        }

        retrieveAudio();
    }, [props.musicianID, props.stateForAudioName, props.showNewAudio]);


    //Retrieve trophies
    useEffect(() => {
        const addTrophy = async (n) => {
            props.setTrophies(oldTrophies => ({ ...oldTrophies, numTrophies: parseInt(parseInt(oldTrophies.numTrophies) + parseInt(n)) }));
        }

        if (audioList.length > 0 && props.addOrDeleteTrophies === 1) {
            addTrophy(10 * audioList.length);
        }
        else if (audioList.length > 0 && props.addOrDeleteTrophies === 3) {
            addTrophy(-10);
            props.setAddOrDeleteTrophies(0);
        }
        else if (audioList.length > 0 && props.addOrDeleteTrophies === 5) {
            addTrophy(10);
            props.setAddOrDeleteTrophies(0);
        }

    }, [props.addOrDeleteTrophies, audioList.length]);

    useEffect(() => {
        const setDefaultAudioMusician = async () => {
            if (props.selectedRadio != -1) {
                props.setdDefaultSong({ idMusician: props.musicianID, idAudio: props.selectedRadio })
            }
        }
        setDefaultAudioMusician();
    }, [props.selectedRadio]);

    const handleRadioChange = (event) => {
        props.setSelectedRadio(event.target.value);
    };

    return (
        <Table borderless >
            <tbody>
                {props.editMode ?
                    audioList.map(a => <EditAudioSample key={a.Path} updateNameAudio={props.updateNameAudio} setUpdateNameAudio={props.setUpdateNameAudio} id={a.idMusician} path={a.Path} idAudio={a.idAudio} audioName={a.AudioName} editMode={props.editMode} selectedRadio={props.selectedRadio} handleRadioChange={handleRadioChange} setShowNewAudio={props.setShowNewAudio} setAddOrDeleteTrophies={props.setAddOrDeleteTrophies} />)
                    : (props.loadAllAudios ?
                        audioList.map(a => <AudioSample key={a.Path} path={a.Path} audioName={a.AudioName} editMode={props.editMode} />)
                        :
                        audioList.slice(0, 2).map(a => <AudioSample key={a.Path} path={a.Path} audioName={a.AudioName} editMode={props.editMode} />)
                    )
                }
            </tbody>
        </Table>
    )
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
        <tr >
            <td style={{ textAlign: 'center' }}>
                {props.editMode ?
                    (pause ? (
                        <PauseBtn className='mt-3' size="35" onClick={() => {
                            music.stop();
                            setPause(false);
                        }}></PauseBtn>
                    ) : (
                        <PlayCircleFill className='mt-3' size="35" onClick={() => {
                            SoundPlay(require(`../Audios/${props.path}`));
                            setPause(true);
                        }}></PlayCircleFill>
                    )
                    )
                    :
                    (pause ? (
                        <PauseBtn size="35" onClick={() => {
                            music.stop();
                            setPause(false);
                        }}></PauseBtn>
                    ) : (
                        <PlayCircleFill size="35" onClick={() => {
                            SoundPlay(require(`../Audios/${props.path}`));
                            setPause(true);
                        }}></PlayCircleFill>
                    )
                    )}
            </td>
            {props.editMode ? <></> : <td>{props.audioName}</td>}
        </tr>
    )
}

function EditAudioSample(props) {
    const [audioName, setAudioName] = useState(props.audioName)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    // Delete Audio for a Musician 
    const deleteAudio = async () => {
        try {
            const audioToDelete = {
                idMusician: props.id,
                AudioName: props.audioName,
                Path: props.path
            }
            await API.deleteAudio(audioToDelete).catch(err => {
                console.error(err);
            }).finally(() => {
                props.setShowNewAudio((prev) => !prev);
                props.setAddOrDeleteTrophies(3);
                //TO DO - Delete Audios also from /src/Audios but Google and I have not idea :)
            });
        } catch (err) {
            console.log(err);
        }
    }

    // Change Audio Name
    useEffect(() => {

        const changeAudioName = async () => {
            var audio = "";
            for (var i = 0; i < props.updateNameAudio.length; i++) {
                if (props.updateNameAudio[i].idAudio === props.idAudio)
                    audio = props.updateNameAudio[i];
            }
            if (audio != "") {
                props.setUpdateNameAudio((previous) => previous.splice(previous.indexOf(audio), 1));
            }
            props.setUpdateNameAudio((previous) => [...previous, { idAudio: props.idAudio, idMusician: props.id, newName: audioName }]);
        }

        changeAudioName();
    }, [audioName]);


    return (
        <tr >
            <td style={{ textAlign: 'center' }}>
                <Radio className="mt-3"
                    checked={props.selectedRadio == props.idAudio}
                    onChange={props.handleRadioChange}
                    value={props.idAudio}
                    name="radio-buttons"
                />
            </td>
            <td style={{ textAlign: 'center' }}>
                <AudioSample key={props.key} path={props.path} audioName={props.audioName} editMode={props.editMode} />
            </td>
            <td>
                <Form.Group>
                    <Form.Control type="text" placeholder="Enter audio description" value={audioName} onChange={(event) => {
                        setAudioName(event.target.value);
                    }}></Form.Control>
                </Form.Group>
            </td>
            <td>
                <Trash className="mt-3" size="30" onClick={handleShow} style={{ color: "red" }} />
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete the audio?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={deleteAudio}>Yes</Button>
                        <Button variant="danger" onClick={handleClose}>No</Button>
                    </Modal.Footer>
                </Modal>

            </td>
        </tr>
    )
}

function VideoTable(props) {

    const [videoList, setVideoList] = useState([]);

    // Retrieve video sample list
    useEffect(() => {
        const retrieveVideo = async () => {
            await API.getVideoSamples(props.musicianID).then(videoList => {
                setVideoList(() => videoList);
                props.setNumVideos(videoList.length);
                props.setFinished((prev) => prev + 1);
            }).catch(err => {
                console.error(err);
            });
        }
        retrieveVideo();
    }, [props.musicianID, props.stateForVideoName, props.showNewVideo]);

    //Retrieve trophies
    useEffect(() => {
        const addTrophy = async (n) => {
            props.setTrophies(oldTrophies => ({ ...oldTrophies, numTrophies: parseInt(parseInt(oldTrophies.numTrophies) + parseInt(n)) }));
        }

        if (videoList.length > 0 && props.addOrDeleteTrophies === 1) {
            addTrophy(15 * videoList.length);
        }
        else if (videoList.length > 0 && props.addOrDeleteTrophies === 4) {
            addTrophy(-15);
            props.setAddOrDeleteTrophies(0);
        }
        else if (videoList.length > 0 && props.addOrDeleteTrophies === 6) {
            addTrophy(15);
            props.setAddOrDeleteTrophies(0);
        }
    }, [props.addOrDeleteTrophies, videoList.length]);

    return (
        <Table borderless >
            <tbody>
                {props.editMode ?
                    videoList.map(v => <EditVideoSample key={v.Path} updateNameVideo={props.updateNameVideo} setUpdateNameVideo={props.setUpdateNameVideo} id={v.idMusician} idVideo={v.idVideo} path={v.Path} videoName={v.VideoName} editMode={props.editMode} setShowNewVideo={props.setShowNewVideo} setAddOrDeleteTrophies={props.setAddOrDeleteTrophies} />)
                    : (props.loadAllVideos ?
                        videoList.map(v => <VideoSample key={v.Path} path={v.Path} videoName={v.VideoName} editMode={props.editMode} />)
                        :
                        videoList.slice(0, 2).map(v => <VideoSample key={v.Path} path={v.Path} videoName={v.VideoName} editMode={props.editMode} />)
                    )
                }
            </tbody>
        </Table>
    )
}

function VideoSample(props) {
    let myUrl;
    if (props.path.includes("http")) {
        myUrl = props.path;
    }
    else {
        myUrl = require(`../Videos/${props.path}`);
    }

    return (
        <>
            <Row className="justify-content-center">
                {props.editMode ?
                    <ReactPlayer
                        width='100px'
                        height='60px'
                        url={myUrl}
                        controls={true} />
                    :
                    <ReactPlayer
                        width='300px'
                        height='180px'
                        url={myUrl}
                        controls={true} />
                }
            </Row>
            {props.editMode ? "" : <Row className="justify-content-center" textAlign="center">{props.videoName}</Row>}
        </>

    )
}

function EditVideoSample(props) {
    const [videoName, setVideoName] = useState(props.videoName)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Change Video Name
    useEffect(() => {

        const changeVideoName = async () => {
            var video = "";
            for (var i = 0; i < props.updateNameVideo.length; i++) {
                if (props.updateNameVideo[i].idVideo === props.idVideo)
                    video = props.updateNameVideo[i];
            }
            if (video != "") {
                props.setUpdateNameVideo((previous) => previous.splice(previous.indexOf(video), 1));
            }
            props.setUpdateNameVideo((previous) => [...previous, { idVideo: props.idVideo, idMusician: props.id, newName: videoName }]);
        }

        changeVideoName();
    }, [videoName]);
    // Delete Video for a Musician 
    const deleteVideo = async () => {
        try {
            const videoToDelete = {
                idMusician: props.id,
                VideoName: props.videoName,
                Path: props.path
            }
            await API.deleteVideo(videoToDelete).catch(err => {
                console.error(err);
            }).finally(() => {
                props.setShowNewVideo((prev) => !prev);
                props.setAddOrDeleteTrophies(4);
                //TO DO - Delete Audios also from /src/Audios but Google and I have not idea :)
            });
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <tr >
            <td style={{ textAlign: 'center' }}>
                <VideoSample key={props.key} path={props.path} videoName={props.videoName} editMode={props.editMode} />
            </td>
            <td>
                <Form.Group>
                    <Form.Control type="text" placeholder="Enter video description" value={videoName} onChange={(event) => {
                        setVideoName(event.target.value);
                    }}></Form.Control>
                </Form.Group>
            </td>
            <td>
                <Trash className="mt-3" size="30" onClick={handleShow} style={{ color: "red" }} />
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete the video?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={deleteVideo}>Yes</Button>
                        <Button variant="danger" onClick={handleClose}>No</Button>
                    </Modal.Footer>
                </Modal>
            </td>
        </tr>
    )
}

function ContactTable(props) {


    return (
        <Table borderless>
            <tbody>
                <tr>
                    <td className="ContactRow">
                        Ph:
                    </td>
                    <td>
                        {props.editMode ?
                            <Form.Group>
                                <Form.Control type="text" placeholder="Enter phone number" value={props.musician.phone} onChange={(event) => {
                                    props.setMusician(oldMusician => ({ ...oldMusician, phone: event.target.value }));
                                }}></Form.Control>
                            </Form.Group> :
                            props.musician.phone}
                    </td>
                </tr>
                <tr>
                    <td className="ContactRow">
                        Web:
                    </td>
                    <td>{props.editMode ?
                        <Form.Group>
                            <Form.Control type="text" placeholder="Enter website" value={props.musician.website} onChange={(event) => {
                                props.setMusician(oldMusician => ({ ...oldMusician, website: event.target.value }));
                            }}></Form.Control>
                        </Form.Group> :
                        props.musician.website}
                    </td>
                </tr>
                <tr>
                    <td className="ContactRow">
                        Email:
                    </td>
                    <td>
                        {props.editMode ?
                            <Form.Group>
                                <Form.Control type="text" placeholder="Enter email address" value={props.musician.email} onChange={(event) => {
                                    props.setMusician(oldMusician => ({ ...oldMusician, email: event.target.value }));
                                }}></Form.Control>
                            </Form.Group> :
                            props.musician.email}
                    </td>
                </tr>
                {props.editMode ? <></> :
                    <tr>
                        <td className="ContactRow">
                            Social:
                        </td>
                        <td>

                        </td>
                    </tr>}
                {props.editMode ?
                    <>
                        <tr>
                            <td className="ContactRow">
                                Facebook:
                            </td>
                            <td>
                                <Form.Group>
                                    <Form.Control type="text" placeholder="Enter facebook link" value={props.musician.facebookProfile} onChange={(event) => {
                                        props.setMusician(oldMusician => ({ ...oldMusician, facebookProfile: event.target.value }));
                                    }}></Form.Control>
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td className="ContactRow">
                                Instagram:
                            </td>
                            <td>
                                <Form.Group>
                                    <Form.Control type="text" placeholder="Enter instagram link" value={props.musician.instagramProfile} onChange={(event) => {
                                        props.setMusician(oldMusician => ({ ...oldMusician, instagramProfile: event.target.value }));
                                    }}></Form.Control>
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td className="ContactRow">
                                Twitter:
                            </td>
                            <td>
                                <Form.Group>
                                    <Form.Control type="text" placeholder="Enter twitter link" value={props.musician.twitterProfile} onChange={(event) => {
                                        props.setMusician(oldMusician => ({ ...oldMusician, twitterProfile: event.target.value }));
                                    }}></Form.Control>
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td className="ContactRow">
                                YouTube:
                            </td>
                            <td>
                                <Form.Group>
                                    <Form.Control type="text" placeholder="Enter YouTube channel link" value={props.musician.youtubeChannel} onChange={(event) => {
                                        props.setMusician(oldMusician => ({ ...oldMusician, youtubeChannel: event.target.value }));
                                    }}></Form.Control>
                                </Form.Group>
                            </td>
                        </tr>
                    </>
                    : <></>}
            </tbody>
        </Table>
    )
}

function Socials(props) {
    return (
        <Table borderless style={{ padding: '20px' }}>
            <tbody>
                <tr>
                    <td style={{ textAlign: 'center' }}>
                        <a href={props.musician.facebookProfile}>
                            <Facebook size='40' />
                        </a>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                        <a href={props.musician.instagramProfile}>
                            <Instagram size='40' />
                        </a>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                        <a href={props.musician.twitterProfile}>
                            <Twitter size='40' />
                        </a>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                        <a href={props.musician.youtubeChannel}>
                            <Youtube size='40' />
                        </a>
                    </td>
                </tr>
            </tbody>
        </Table>
    )
}

function ReviewTable(props) {

    return (
        <Table borderless >
            <tbody>
                {props.reviewList.map(r => <Review key={r.ReviewID} reviewID={r.ReviewID} reviewText={r.ReviewText} numberStars={r.NumberStars} />)}
            </tbody>
        </Table>
    )
}

function Review(props) {

    var stars = [];
    for (var i = 0; i < props.numberStars; i++) {
        stars.push(<StarFill />)
    }

    return (
        <tr>
            <td >
                {props.reviewText}
            </td>
            <td>
                {stars}
            </td>
        </tr>
    )
}

function AddReviewModal(props) {
    const [number, setNumber] = useState(0);
    const [reviewText, setReviewText] = useState({});

    // Add New Review for a Musician 
    const addNewReview = async () => {
        try {
            const review = {
                idMusician: props.musicianID,
                ReviewText: reviewText,
                NumberStars: number,
            }
            await API.addNewReview(review).catch(err => {
                console.error(err);
            }).finally(() => {
                props.handleCloseReview();
                props.setUpdateReviews(true);
            });
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <Modal centered show={props.showReview} onHide={props.handleCloseReview}>
            <Modal.Header closeButton>
                <Modal.Title>Add Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Ratings number={number} setNumber={setNumber} />
                    <Form.Group>
                        <Form.Label>Leave a comment:</Form.Label>
                        <Form.Control as="textarea" placeholder="Enter your comment here" onChange={(event) => {
                            setReviewText(event.target.value);
                        }
                        } />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseReview}>
                    Close
                </Button>
                <Button variant="primary" onClick={addNewReview}>
                    Submit Review
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

function Ratings(props) {

    const [starsList, setStars] = useState([]);

    useEffect(() => {
        var stars = [];
        for (var i = 0; i < 5; i++) {
            stars.push({ num: i, fill: false })
        }
        setStars(stars);
    }, []);

    useEffect(() => {
        fillStars();
    }, [props.number]);

    const fillStars = () => {
        setStars(oldStarsList => {
            return oldStarsList.map(s => {
                if (s.num < props.number)
                    return { num: s.num, fill: true, }
                else
                    return { num: s.num, fill: false, };
            });
        });
    }

    return (
        <table>
            <tr>
                <td>
                    Rating:
                </td>
                <td>
                    {starsList.map(s =>
                        <>
                            {s.fill ? <StarFill as="button" key={s.num} className="Rating" size={25} onClick={() => props.setNumber(s.num + 1)} />
                                : <Star as="button" key={s.num} className="Rating" size={25} onClick={() => props.setNumber(s.num + 1)} />}
                        </>)}
                </td>
            </tr>
        </table>
    )
}

export default ProfilePage;