/**
 * All the API calls
 */

 async function getMusician(id) {
    const response = await fetch(`/api/musician/${id}`);
    if (!response.ok)
        throw new Error(response.statusText);
    const musician = await response.json();
    return musician;
}

async function getAudioSamples(id) {
    const response = await fetch(`/api/audios/${id}`);
    if (!response.ok)
        throw new Error(response.statusText);
    const audioSamples = await response.json();
    return audioSamples;
}

async function getAudioByID(id) {
    const response = await fetch(`/api/getAudio/${id}`);
    if (!response.ok)
        throw new Error(response.statusText);
    const audioSample = await response.json();
    return audioSample;
}

async function getDefaultAudios() {
    const response = await fetch(`/api/defaultAudios`);
    if (!response.ok)
        throw new Error(response.statusText);
    const audios = await response.json();
    return audios;
}

async function getVideoSamples(id) {
    const response = await fetch(`/api/videos/${id}`);
    if (!response.ok)
        throw new Error(response.statusText);
    const videoSamples = await response.json();
    return videoSamples;
}

async function getReviews(id) {
    const response = await fetch(`/api/reviews/${id}`);
    if (!response.ok)
        throw new Error(response.statusText);
    const reviews = await response.json();
    return reviews;
}

async function getSuggestions() {
    const response = await fetch(`/api/allSuggestions`);
    if (!response.ok)
        throw new Error(response.statusText);
    const s = await response.json();
    
    return s;
}

async function getAvailability(id) {
    const response = await fetch(`/api/availability/${id}`);
    if (!response.ok)
        throw new Error(response.statusText);
    const availability = await response.json();
    return availability;
}

async function getDayOfWeekAvailability(id) {
    const response = await fetch(`/api/availabilityPeriodicDate/${id}`);
    if (!response.ok)
        throw new Error(response.statusText);
    const availabilityPeriodicDate = await response.json();
    return availabilityPeriodicDate;
}

async function getUnavailability(id) {
    const response = await fetch(`/api/dateUnavailability/${id}`);
    if (!response.ok)
        throw new Error(response.statusText);
    const dateUnavailability = await response.json();
    return dateUnavailability;
}

async function deleteAvailability(id) {
    const response = await fetch(`/api/deleteAvailability/${id}`, {
        method : 'DELETE',
        headers : {
            'Content-Type' : 'application/json',
        }
    });
    if (!response.ok)
        throw new Error(response.statusText);
    const dateUnavailability = await response.json();
    return dateUnavailability;
}

async function getMusicianList(genres, instruments, members, dfrom, dto) {
let api = "/api/musicians?";

api += (genres == undefined || genres.length == 0) ? "" : `genres=${genres}&`
api += (instruments == undefined  || instruments.length == 0) ? "" : `instruments=${instruments}&`
api += (members && members != "Any") ? `members=${members}&` : "" 
api += !invalidDate(dfrom) ? `dfrom=${dfrom}&` : "" 
api += !invalidDate(dto) ? `dto=${dto}` : "";
api = api.endsWith('?') || api.endsWith('&') ? api.substring(0, api.length -1 ) : api;
const response = await fetch(api)//`/api/musicians?genres=${genres}&instruments=${instruments}&members=${members}&dfrom=${dfrom}&dto=${dto}`);
    if (!response.ok)
        throw new Error(response.statusText);
    const musicians = await response.json();
    return musicians;
}
const invalidDate = (date) => {
    return date == undefined || !date.isValid()
  }

async function createMusician(musician){
    let response = await fetch(`/api/addMusician`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(musician),
    });
    if(!response.ok) {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}

async function updateMusician(musician){
    let response = await fetch(`/api/updateMusician/${musician.idMusician}`,{
        method : 'put',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(musician),
    });
    if(!response.ok) {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}

async function addAvailablePeriod(availability){
    let response = await fetch(`/api/addAvailablePeriod`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(availability),
    });
    if(!response.ok) {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}

async function addRecurrentAvailability(dayAvailability){
    let response = await fetch(`/api/addRecurrentAvailability`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(dayAvailability),
    });
    if(!response.ok) {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}

async function addUnavailability(dayUnavailability){
    let response = await fetch(`/api/addUnavailability`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(dayUnavailability),
    });
    if(!response.ok) {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}

async function addNewAudio(newAudio){
    let response = await fetch(`/api/addNewAudio`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(newAudio),
    });
    if(!response.ok) {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}

async function setDefaultAudio(audio){
    let response = await fetch(`/api/setDefaultAudio`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(audio),
    });
    if(!response.ok) {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}

async function updateAudioNameMusician(audioName){
    let response = await fetch(`/api/updateNameAudios`,{
        method : 'put',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(audioName),
    });
    if(!response.ok) {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}

async function updateVideoNameMusician(videoName){
    let response = await fetch(`/api/updateNameVideos`,{
        method : 'put',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(videoName),
    });
    if(!response.ok) {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}



async function addNewReview(newReview){
    let response = await fetch(`/api/addNewReview`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(newReview),
    });
    if(!response.ok) {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}

async function addNewVideo(newVideo){
    let response = await fetch(`/api/addNewVideo`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(newVideo),
    });
    if(!response.ok) {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}

async function deleteAudio(audioToDelete){
    let response = await fetch(`/api/deleteAudio`,{
        method : 'DELETE',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(audioToDelete),
    });
    if(!response.ok) {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}

async function deleteDefaultAudio(id) {
    const response = await fetch(`/api/deleteDefaultAudio/${id}`);
    if (!response.ok)
        throw new Error(response.statusText);
    const musician = await response.json();
    return musician;
}

async function deleteVideo(videoToDelete){
    let response = await fetch(`/api/deleteVideo`,{
        method : 'DELETE',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(videoToDelete),
    });
    if(!response.ok) {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}

async function deleteProfilePicture(idMusician){
    let response = await fetch(`/api/deleteProfilePicture/${idMusician}`,{
        method : 'put',
    });
    if (!response.ok)
        throw new Error(response.statusText);
    const res = await response.json();
    return res;
}

const API = { getMusician, getAudioSamples, getAudioByID, getDefaultAudios, getVideoSamples, 
    getReviews, getMusicianList, getSuggestions, getUnavailability, getAvailability, getDayOfWeekAvailability, deleteAvailability,
    createMusician, updateMusician, updateAudioNameMusician, updateVideoNameMusician, addAvailablePeriod, addRecurrentAvailability, addUnavailability, addNewAudio, 
    setDefaultAudio, addNewReview, deleteAudio, deleteDefaultAudio, addNewVideo, deleteVideo, deleteProfilePicture}
export default API;