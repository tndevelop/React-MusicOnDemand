'use strict';

const express = require('express');
var bodyParser = require('body-parser')
const { query, validationResult, check, body } = require('express-validator'); // validation middleware
const dao = require('./dbHCI'); // module for accessing the DB
const fileUpload = require('express-fileupload');

// init express
const app = express();
app.use(fileUpload());
var jsonParser = bodyParser.json()
const port = 3001;

const dayjs = require("dayjs");
const daysLegenda = ["dayjs.day() returns data from 1 to 7. 0 not used","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
/***API***/

//Format of URL: localhost:3001/api/musicians?genres=${genres}&instruments=${instruments}&members=${members}&dfrom=${dfrom}&dto=${dto};
//to get filtered Musician
app.get('/api/musicians', [],
  async (req, res) => {
    try {
      // input sanitization
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }
      //console.log(req.query)
      let payload = req.query;
      let musicians, availabilities, unavailabilities, DOWavailabilities, available, unavailableMusicians = [], dates=[], reviews = [];


      if (Object.keys(payload).length === 0) {
        musicians = await dao.listMusicians();
      }
      else {
        musicians = await dao.listFilteredMusicians(payload.genres, payload.instruments, payload.members);
        
        
        if(payload.dfrom || payload.dto){
          const dfrom = payload.dfrom? dayjs(payload.dfrom) : undefined;
          const dto = payload.dto? dayjs(payload.dto) : dfrom; //if only dfrom is selected the range is one single day (dfrom <-> dfrom)
          let it = dayjs(dfrom.format("YYYY/MM/DD"));
          
          while (it.format("YYYY/MM/DD") != dto.add(1, "day").format("YYYY/MM/DD")){   
            dates = [...dates, { date: it.format("YYYY-MM-DD"), dow: it.day() }];
            it = it.add(1, "day");
          };
          for (let m in musicians){            
            availabilities = await dao.getAvailableDatesMusician(musicians[m].idMusician);
            unavailabilities = await dao.getUnavailableDatesMusician(musicians[m].idMusician);
            DOWavailabilities = await dao.getDayOfWeekAvailabilityMusician(musicians[m].idMusician);
            
            available = 
                //check availability ranges and from-to range    
                (availabilities.filter(
                  a => (a.startDate <= dfrom.format("YYYY-MM-DD") && a.endDate >= dfrom.format("YYYY-MM-DD")) || (a.startDate >= dfrom.format("YYYY-MM-DD") && a.startDate <= dto.format("YYYY-MM-DD") )
                  )!=0
                //check DOW availabilities and single date unavailabilities
                || (dates.filter(d => DOWavailabilities.map(d => d.dayOfWeek).includes(daysLegenda[d.dow]) && !unavailabilities.map(d => d.singleDate).includes(d.date)))!=0 ); 
            
            
            if (!available)
              unavailableMusicians.push(m);
          }
          
          musicians = musicians.filter((m,index) => !unavailableMusicians.includes(""+index));
        }
      }
      reviews = await dao.getReviews();
      let sum = 0;
      let count = 0;
      for (let musicianIdx in musicians){
        sum = 0;
        count = 0;
        reviews.filter(r => r.MusicianID == musicians[musicianIdx].idMusician).forEach(r => {sum+=r.NumberStars; count++;});
        musicians[musicianIdx].reviewsAvg = (sum/count).toFixed(1);
        musicians[musicianIdx].reviewsCount = count;
      }
      //console.log(musicians)
      
      res.status(200).json(musicians);
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  });

//Format of URL: localhost:3001/api/musician/:id
//to get details of a specific musicianID
app.get('/api/musician/:id', [
  check('id', 'id must be an integer').isInt()
], async (req, res) => {
  try {
    // input sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const musician = await dao.getMusician(req.params.id);

    res.status(200).json(musician);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

//Format of URL: localhost:3001/api/videos/:id
//to get videos of a specific musicianID
app.get('/api/videos/:id', [
  check('id', 'id must be an integer').isInt()
], async (req, res) => {
  try {
    // input sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const videoMusician = await dao.getVideosMusician(req.params.id);

    res.status(200).json(videoMusician);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});


//Format of URL: localhost:3001/api/audios/:id
//to get audios of a specific musicianID
app.get('/api/audios/:id', [
  check('id', 'id must be an integer').isInt()
], async (req, res) => {
  try {
    // input sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const audioMusician = await dao.getAudiosMusician(req.params.id);

    res.status(200).json(audioMusician);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.get('/api/getAudio/:id', [
  check('id', 'id must be an integer').isInt()
], async (req, res) => {
  try {
    // input sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const audio = await dao.getAudioByID(req.params.id);

    res.status(200).json(audio);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.get('/api/defaultAudios', async (req, res) => {
  try {
    // input sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const audios = await dao.getDefaultAudios();

    res.status(200).json(audios);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});


//Format of URL: localhost:3001/api/reviews/:id
//to get audios of a specific musicianID
app.get('/api/reviews/:id', [
  check('id', 'id must be an integer').isInt()
], async (req, res) => {
  try {
    // input sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const reviewMusician = await dao.getReviewsMusician(req.params.id);

    res.status(200).json(reviewMusician);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});


//Format of URL: localhost:3001/api/suggestionTaken/:id
//to get suggestions taken of a specific musicianID
app.get('/api/suggestionTaken/:id', [
  check('id', 'id must be an integer').isInt()
], async (req, res) => {
  try {
    // input sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const suggestionMusician = await dao.getSuggestionsMusician(req.params.id);

    res.status(200).json(suggestionMusician);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.get('/api/allSuggestions', async (req, res) => {
  try {
    // input sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const allSuggestions = await dao.getSuggestions();

    res.status(200).json(allSuggestions);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

//Format of URL: localhost:3001/api/availability/:id
//to get availability of a specific musicianID
app.get('/api/availability/:id', [
  check('id', 'id must be an integer').isInt()
], async (req, res) => {
  try {
    // input sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const availability = await dao.getAvailableDatesMusician(req.params.id);

    res.status(200).json(availability);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

//Format of URL: localhost:3001/api/availabilityPeriodicDate/:id
//to get availability periodic dayOfWeek of a specific musicianID
app.get('/api/availabilityPeriodicDate/:id', [
  check('id', 'id must be an integer').isInt()
], async (req, res) => {
  try {
    // input sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const availabilityPeriodicDate = await dao.getDayOfWeekAvailabilityMusician(req.params.id);

    res.status(200).json(availabilityPeriodicDate);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

//Format of URL: localhost:3001/api/dateUnavailability/:id
//to get unavailability of a specific musicianID
app.get('/api/dateUnavailability/:id', [
  check('id', 'id must be an integer').isInt()
], async (req, res) => {
  try {
    // input sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const dateUnavailability = await dao.getUnavailableDatesMusician(req.params.id);

    res.status(200).json(dateUnavailability);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.delete(`/api/deleteAvailability/:id`, jsonParser, [
  check('mid').isInt({ min: 0 }),
], async (req, res) => {
    const id = parseInt(req.params.id)
    try {
      const dateDeleted = await dao.deleteAvailability(id);
      res.status(200).json({ 'Date deleted': dateDeleted });
    } catch (err) {
      console.log(err)
      res.status(500).json({ 'New error': err });
    }
  }
);

const validationBodyNewMusician = (req, res, next) => {

  if (req.body.name === "")
    return res.status(401).json({ error: 'You must insert a name' });

  next();
}

/*
example of POST /api/addMusician (p.s. setup content-type: application/json)
{     
      name: "a new group name",
      genresList: "0, 1",
      instrumentsList: "0, 1, 2, 3",
      numberMember: 4,
      profilePicture: "pathImage",
      phone: "1122334455",
      website: "www.newgroup.com",
      email: "newgroup@gmail.com",
      facebookProfile: "new group fb",
      instagramProfile: "new group insta",
      twitterProfile: "new group tw",
      youtubeChannel: "new group yt" 
}
*/
app.post('/api/addMusician', jsonParser,
  async (req, res) => {
    try {
      const singleMusician = {
        name: req.body.name,
        genresList: req.body.genresList,
        instrumentsList: req.body.instrumentsList,
        numberMember: req.body.numberMember,
        profilePicture: req.body.profilePicture,
        phone: req.body.phone,
        website: req.body.website,
        email: req.body.email,
        facebookProfile: req.body.facebookProfile,
        instagramProfile: req.body.instagramProfile,
        twitterProfile: req.body.twitterProfile,
        youtubeChannel: req.body.youtubeChannel
      }
      const musicianCreated = await dao.insertMusician(singleMusician);

      res.status(200).json({ 'musician created': req.body.name }); // rispondo col del json
    } catch (err) {
      console.log(err)
      res.status(500).json({ 'error': err });
    }
  }
);

app.post('/api/addAvailablePeriod', jsonParser,
  async (req, res) => {
    try {
      const availability = {
        idMusician: req.body.idMusician,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      }
      const availablePeriod = await dao.insertAvailablePeriod(availability);

      res.status(200).json({ 'period of availability inserted': req.body.idMusician });
    } catch (err) {
      console.log(err)
      res.status(500).json({ 'error': err });
    }
  }
);

app.post('/api/addRecurrentAvailability', jsonParser,
  async (req, res) => {
    try {
      const dayAvailability = {
        idMusician: req.body.idMusician,
        dayOfWeek: req.body.dayOfWeek
      }
      const availableDay = await dao.insertRecurrentAvailability(dayAvailability);

      res.status(200).json({ 'day of recurrent availability inserted': req.body.idMusician });
    } catch (err) {
      console.log(err)
      res.status(500).json({ 'error': err });
    }
  }
);

app.post('/api/addUnavailability', jsonParser,
  async (req, res) => {
    try {
      const dayUnavailability = {
        idMusician: req.body.idMusician,
        singleDate: req.body.singleDate
      }
      const availableDay = await dao.insertUnavailability(dayUnavailability);

      res.status(200).json({ 'day of recurrent availability inserted': req.body.idMusician });
    } catch (err) {
      console.log(err)
      res.status(500).json({ 'error': err });
    }
  }
);

// PUT /api/musician/<mid>
app.put('/api/updateMusician/:mid', jsonParser, [
  check('mid').isInt({ min: 0 }),
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const mid = parseInt(req.params.mid);
  const musician = {
    idMusician: mid,
    name: req.body.name,
    genresList: req.body.genresList,
    instrumentsList: req.body.instrumentsList,
    numberMember: req.body.numberMember,
    profilePicture: req.body.profilePicture,
    phone: req.body.phone,
    website: req.body.website,
    email: req.body.email,
    facebookProfile: req.body.facebookProfile,
    instagramProfile: req.body.instagramProfile,
    twitterProfile: req.body.twitterProfile,
    youtubeChannel: req.body.youtubeChannel
  }

  try {
    await dao.updateMusician(musician);
    res.status(200).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the update of musician ${musician.mid}.` });
  }
});


// Upload MP3 Endpoint
app.post('/uploadMP3', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  file.mv(`${__dirname}/../client/src/Audios/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.post('/api/setDefaultAudio', jsonParser,
  async (req, res) => {
    try {
      const defaultAudio = {
        idMusician: req.body.idMusician,
        idAudio: req.body.idAudio
      }
      const audio = await dao.setDefaultAudioMusician(defaultAudio);

      res.status(200).json({ 'default song inserted': req.body.idMusician });
    } catch (err) {
      console.log(err)
      res.status(500).json({ 'error': err });
    }
  }
);

// Upload MP4 Endpoint
app.post('/uploadMP4', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  file.mv(`${__dirname}/../client/src/Videos/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

// Upload IMG Endpoint
app.post('/uploadIMG', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  file.mv(`${__dirname}/../client/src/Images/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

/*
example of POST /api/addNewAudio/:idMusician (p.s. setup content-type: application/json)
{     
      MusicianID: 1,
      AudioID: "0, 1",
      AudioName: "prova",
      Path: "somegroup.mp3"
}
*/
//Manage add and delete Audio from DB
app.post('/api/addNewAudio', jsonParser,
  async (req, res) => {
    try {
      const audioMusician = {
        idMusician: req.body.idMusician,
        AudioName: req.body.AudioName,
        Path: req.body.Path
      }
      const musicianCreated = await dao.insertNewAudioMusician(audioMusician);
      res.status(200).json({ 'New audio added': musicianCreated });
    } catch (err) {
      console.log(err)
      res.status(500).json({ 'error': err });
    }
  }
);

app.delete('/api/deleteAudio', jsonParser,
  async (req, res) => {
    try {
      const audioToDelete = {
        idMusician: req.body.idMusician,
        AudioName: req.body.AudioName,
        Path: req.body.Path
      }

      const audioDeleted = await dao.deleteAudio(audioToDelete);
      res.status(200).json({ 'Audio deleted': audioDeleted });
    } catch (err) {
      console.log(err)
      res.status(500).json({ 'New error': err });
    }
  }
);

app.delete('/api/deleteDefaultAudio/:id', [
  check('id', 'id must be an integer').isInt()
], async (req, res) => {
  try {
    // input sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const audioDeleted = await dao.deleteDefaultAudio(req.params.id);

    res.status(200).json(audioDeleted);
  } catch (err) {
    console.log(err)
    res.status(500).end();
  }
});

// PUT /api/updateNameAudios
app.put('/api/deleteProfilePicture/:id', [
  check('id', 'id must be an integer').isInt()
], async (req, res) => {

  try {
    // input sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const profilePictureDeleted = await dao.deleteProfilePicture(req.params.id);

    res.status(200).json(profilePictureDeleted);
  } catch (err) {
    console.log(err)
    res.status(500).end();
  }
});

// PUT /api/updateNameAudios
app.put('/api/updateNameAudios', jsonParser, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const audioName = {
    idMusician: req.body.idMusician,
    newAudioName: req.body.newName,
    idAudio: req.body.idAudio
  }
  
  try {
    await dao.changeNameAudio(audioName);
    res.status(200).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the update of musician ${audioName.idMusician}.` });
  }
});


// PUT /api/updateNameVideos
app.put('/api/updateNameVideos', jsonParser, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const videoName = {
    idMusician: req.body.idMusician,
    newVideoName: req.body.newName,
    idVideo: req.body.idVideo
  }

  try {
    await dao.changeNameVideo(videoName);
    res.status(200).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the update of musician ${audioName.idMusician}.` });
  }
});



//add Review
app.post('/api/addNewReview', jsonParser,
async (req, res) => {
  try {
    const newReview = {
      idMusician: req.body.idMusician,
      ReviewText: req.body.ReviewText,
      NumberStars: req.body.NumberStars,
    }
    const reviewAdded = await dao.insertNewReviewMusician(newReview);
    res.status(200).json({ 'New review added': reviewAdded }); // rispondo col del json
  } catch (err) {
    console.log(err)
    res.status(500).json({ 'error': err });
  }
});


//Manage add and delete video from DB
app.post('/api/addNewVideo', jsonParser,
  async (req, res) => {
    try {
      const videoMusician = {
        idMusician: req.body.idMusician,
        VideoName: req.body.VideoName,
        Path: req.body.Path
      }
      const videoCreated = await dao.insertNewVideoMusician(videoMusician);
      res.status(200).json({ 'New audio added': videoCreated }); // rispondo col del json
    } catch (err) {
      console.log(err)
      res.status(500).json({ 'error': err });
    }
  });

app.delete('/api/deleteVideo', jsonParser,
  async (req, res) => {
    try {
      const videoToDelete = {
        idMusician: req.body.idMusician,
        VideoName: req.body.VideoName,
        Path: req.body.Path
      }

      const videoDeleted = await dao.deleteVideo(videoToDelete);
      res.status(200).json({ 'Audio deleted': videoDeleted }); // rispondo col del json
    } catch (err) {
      console.log(err)
      res.status(500).json({ 'New error': err });
    }
  });

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});