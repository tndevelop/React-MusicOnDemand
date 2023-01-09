'use strict';
/* Data Access Object (DAO) module for accessing tasks */

const sqlite = require('sqlite3');


// open the database
const db = new sqlite.Database('hciDB.db', (err) => {
    if (err) throw err;
});


// get all musicians -> it could be useless
exports.listMusicians = () => {
    return new Promise((resolve, reject) => {

        const sql = 'SELECT * FROM Musicians';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const musicians = rows.map((e) => ({ idMusician: e.idMusician, name: e.name, profilePicture: e.profilePicture, genres: e.genresList.toString().split(",").map(i => Number(i)), instruments: e.instrumentsList.toString().split(",").map(i => Number(i)), numberMember: e.numberMember }));
            resolve(musicians);
        });
    });
};

/*GET REQUEST*/

// get filtered musicians (based on filtered genre, instruments and numberMembers) NB: still missing Date
exports.listFilteredMusicians = (genres, instruments, members) => {
    return new Promise((resolve, reject) => {

        const sql = 'SELECT * FROM Musicians, DateUnavailability WHERE DateUnavailability.idMusician = Musicians.idMusician';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const musicians = rows.map((e) => ({ idMusician: e.idMusician, name: e.name, profilePicture: e.profilePicture, genres: e.genresList.toString().split(",").map(i => Number(i)), instruments: e.instrumentsList.toString().split(",").map(i => Number(i)), numberMember: e.numberMember, startDate: e.startDate, endDate: e.endDate }));
            //From the query above, I have as many value as different Dates (idMusician: 1, Date: 1; idMusician: 1, Date: 2, idMusician: 1, Date: 3).
            //So now I want something like: (idMusician: 1, Date: [1,2,3]);

            // console.log(musicians);
            //Firstly I create a dictionary in order to aggregate all the Dates in which a band is available
            let myObj = {};
            let finalMusicians = [];
            for (var i = 0; i < musicians.length; i++) { //per ogni elemento di musicians

                if (musicians[i].idMusician in myObj === false) { //ritorna true se ans[j].question (1,2,3) è in myObj
                    myObj[parseInt(musicians[i].idMusician)] = { idMusician: musicians[i].idMusician, name: musicians[i].name, profilePicture: musicians[i].profilePicture, genres: musicians[i].genres, instruments: musicians[i].instruments, numberMember: musicians[i].numberMember, dateUnavailibility: [String(musicians[i].startDate + "," + musicians[i].endDate)] }
                }
                else {
                    myObj[parseInt(musicians[i].idMusician)].dateUnavailibility.push(musicians[i].startDate + "," + musicians[i].endDate)
                }

            }

            console.log(myObj);

            //Here, I remove the key from the dictionary, and I take only the value.    
            for (const x in myObj) {
                finalMusicians.push(myObj[x]);
            }

            //Now I have something like: (idMusician: 1, Date: [1,2,3]);





            if (genres != undefined && genres.length != 0) {
                finalMusicians = finalMusicians.filter(singleMusician => {
                    return singleMusician.genres.toString().split(",").map(i => Number(i)).some(elem => {
                        if (genres.indexOf(elem) > -1)
                            return true;
                        else
                            return false;
                    });
                });
            }

            if (instruments != undefined && instruments.length != 0) {
                finalMusicians = finalMusicians.filter(singleMusician => {
                    return singleMusician.instruments.toString().split(",").map(i => Number(i)).some(elem => {
                        if (instruments.indexOf(elem) > -1)
                            return true;
                        else
                            return false;
                    });
                });
            }

            if (members != undefined && members.length != 0) {
                finalMusicians = finalMusicians.filter(singleMusician => {
                    if (singleMusician.numberMember == members)
                        return true;
                    else return false;
                });
            }

            /* if(dfrom.length != 0 && dto.length!=0){
              finalMusicians = finalMusicians.filter(singleMusician => {
                  if (singleMusician.numberMember<=members)
                      return true;
                  else return false;
                }); 
      
             }*/

            resolve(finalMusicians);
        });
    });
};

exports.getReviews = () => {
    return new Promise((resolve, reject) => {

        const sql = 'SELECT * FROM Reviews';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            
            const reviews = rows.map((e) => ({ MusicianID: e.MusicianID, ReviewID: e.ReviewID, ReviewText: e.ReviewText, NumberStars: e.NumberStars }));
            //From the query above, I have as many value as different Dates (idMusician: 1, Date: 1; idMusician: 1, Date: 2, idMusician: 1, Date: 3).
            //So now I want something like: (idMusician: 1, Date: [1,2,3]);

            
            
            resolve(reviews);
        });
    });
};

//get details of a specific musicianID
exports.getMusician = (idMusician) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Musicians WHERE idMusician = ?';

        db.get(sql, [idMusician], (err, row) => {
            if (err) {
                reject(err);
                console.log(err);
                return;
            }

            if (row === undefined) {
                resolve({ error: 'Musician id not in the db.' });
            } else {
                const musician = { idMusician: row.idMusician, name: row.name, genresList: row.genresList, instrumentsList: row.instrumentsList, numberMember: row.numberMember, profilePicture: row.profilePicture, phone: row.phone, website: row.website, email: row.email, facebookProfile: row.facebookProfile, instagramProfile: row.instagramProfile, twitterProfile: row.twitterProfile, youtubeChannel: row.youtubeChannel };
                resolve(musician);
            }
        });
    });
};

//get videos of a specific musicianID
exports.getVideosMusician = (idMusician) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT idMusician, VideoID, name, VideoName, Path FROM Musicians, Videos WHERE idMusician = ? AND Musicians.idMusician = Videos.MusicianID';

        db.all(sql, [idMusician], (err, rows) => {
            if (err) {
                reject(err);
                console.log(err);
                return;
            }

            if (rows === undefined) {
                resolve({ error: 'Musician id not in the db.' });
            } else {
                const videoMusician = rows.map((e) => ({ idMusician: e.idMusician, idVideo: e.VideoID, name: e.name, VideoName: e.VideoName, Path: e.Path }));
                resolve(videoMusician);
            }
        });
    });
};


//get audios of a specific musicianID
exports.getAudiosMusician = (idMusician) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT idMusician, name, AudioID, AudioName, Path FROM Musicians, Audios WHERE idMusician = ? AND Musicians.idMusician = Audios.MusicianID';

        db.all(sql, [idMusician], (err, rows) => {
            if (err) {
                reject(err);
                console.log(err);
                return;
            }

            if (rows === undefined) {
                resolve({ error: 'Musician id not in the db.' });
            } else {
                const audioMusician = rows.map((e) => ({ idMusician: e.idMusician, name: e.name, idAudio: e.AudioID, AudioName: e.AudioName, Path: e.Path }));
                resolve(audioMusician);
            }
        });
    });
};

exports.getAudioByID = (idAudio) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Audios WHERE AudioID = ?';

        db.get(sql, [idAudio], (err, row) => {
            if (err) {
                reject(err);
                console.log(err);
                return;
            }

            if (row === undefined) {
                resolve({ error: 'Audio id not in the db.' });
            } else {
                const audio = { idMusician: row.MusicianID, idAudio: row.AudioID, nameAudio: row.AudioName, path: row.Path };
                resolve(audio);
            }
        });
    });
};

exports.getDefaultAudios = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM DefaultAudios';

        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                console.log(err);
                return;
            }

            const audios = rows.map((e) => ({ idMusician: e.MusicianID, idAudio: e.AudioID }));
            resolve(audios);
        });
    });
};


//get reviews of a specific musicianID
exports.getReviewsMusician = (idMusician) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT idMusician, name, ReviewID, ReviewText, NumberStars FROM Musicians, Reviews WHERE idMusician = ? AND Musicians.idMusician = Reviews.MusicianID';

        db.all(sql, [idMusician], (err, rows) => {
            if (err) {
                reject(err);
                console.log(err);
                return;
            }

            if (rows === undefined) {
                resolve({ error: 'Musician id not in the db.' });
            } else {
                const reviewsMusician = rows.map((e) => ({ idMusician: e.idMusician, name: e.name, ReviewID: e.ReviewID, ReviewText: e.ReviewText, NumberStars: e.NumberStars }));
                resolve(reviewsMusician);
            }
        });
    });
};


//get suggestions taken by a specific musicianID
exports.getSuggestionsMusician = (idMusician) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT MusicianID, name,  SUM(NumberTrophies) AS TotalNumberTrophies FROM Suggestions, SuggestionsTakenByMusician, Musicians WHERE idMusician = ? AND SuggestionsTakenByMusician.MusicianID = Musicians.idMusician AND Suggestions.SuggestionID = SuggestionsTakenByMusician.SuggestionID GROUP BY MusicianID;';

        db.all(sql, [idMusician], (err, rows) => {
            if (err) {
                reject(err);
                console.log(err);
                return;
            }

            if (rows === undefined) {
                resolve({ error: 'Musician id not in the db.' });
            } else {
                const suggestionsMusician = rows.map((e) => ({ idMusician: e.MusicianID, nameMusician: e.name, NumberTrophies: e.TotalNumberTrophies }));
                resolve(suggestionsMusician);
            }
        });
    });
};

//get all suggestions to show in QuestionCircleFill
exports.getSuggestions = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT SuggestionText,  NumberTrophies FROM Suggestions';

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                console.log(err);
                return;
            }

            if (rows === undefined) {
                resolve({ error: 'Musician id not in the db.' });
            } else {
                const allSuggestions = rows.map((e) => ({ suggestionText: e.SuggestionText, numberTrophies: e.NumberTrophies }));
                resolve(allSuggestions);
            }
        });
    });
};

//get available dates of a specific musicianID
exports.getAvailableDatesMusician = (idMusician) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM DateAvailability WHERE idMusician = ? ';

        db.all(sql, [idMusician], (err, rows) => {
            if (err) {
                reject(err);
                console.log(err);
                return;
            }

            if (rows === undefined) {
                resolve({ error: 'Musician id not in the db.' });
            } else {
                const dateAvailibility = rows.map((e) => ({ idMusician: e.idMusician, startDate: e.startDate, endDate: e.endDate }));
                resolve(dateAvailibility);
            }
        });
    });
};

//get available days of a specific musicianID
exports.getDayOfWeekAvailabilityMusician = (idMusician) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM DayOfWeekAvailability WHERE idMusician = ? ';

        db.all(sql, [idMusician], (err, rows) => {
            if (err) {
                reject(err);
                console.log(err);
                return;
            }

            if (rows === undefined) {
                resolve({ error: 'Musician id not in the db.' });
            } else {
                const availibility = rows.map((e) => ({ idMusician: e.idMusician, dayOfWeek: e.dayOfWeek }));
                resolve(availibility);
            }
        });
    });
};

//get unavailable dates of a specific musicianID
exports.getUnavailableDatesMusician = (idMusician) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM DateUnavailability WHERE idMusician = ? ';

        db.all(sql, [idMusician], (err, rows) => {
            if (err) {
                reject(err);
                console.log(err);
                return;
            }

            if (rows === undefined) {
                resolve({ error: 'Musician id not in the db.' });
            } else {
                const dateUnavailibility = rows.map((e) => ({ idMusician: e.idMusician, singleDate: e.singleDate }));
                resolve(dateUnavailibility);
            }
        });
    });
};


/*POST*/

//post add profile musician
exports.insertMusician = (m) => {

    return new Promise(async (resolve, reject) => {
        try {


            const sql = 'INSERT INTO Musicians (name, genresList, instrumentsList, numberMember, profilePicture,  phone,  website,  email, facebookProfile,  instagramProfile,  twitterProfile, youtubeChannel)' +
                ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';


            //insert into table quiz only if idQuiz not exists
            db.run(sql, [m.name, m.genresList, m.instrumentsList, m.numberMember, m.profilePicture, m.phone, m.website, m.email, m.facebookProfile, m.instagramProfile, m.twitterProfile, m.youtubeChannel], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};

exports.insertNewAudioMusician = (newAudio) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = 'INSERT INTO Audios (MusicianID, AudioName, Path) VALUES (?, ?, ?)'

            //insert into table quiz only if idQuiz not exists
            db.run(sql, [newAudio.idMusician, newAudio.AudioName, newAudio.Path], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};

exports.setDefaultAudioMusician = (audio) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = 'INSERT OR REPLACE INTO DefaultAudios (MusicianID, AudioID) VALUES (?, ?)'

            //insert into table quiz only if idQuiz not exists
            db.run(sql, [audio.idMusician, audio.idAudio], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};


exports.insertNewReviewMusician = (newReview) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = 'INSERT INTO Reviews (MusicianID, ReviewText, NumberStars) VALUES (?, ?, ?)'

            db.run(sql, [newReview.idMusician, newReview.ReviewText, newReview.NumberStars], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};

exports.insertNewVideoMusician = (newVideo) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = 'INSERT INTO Videos (MusicianID, VideoName, Path) VALUES (?, ?, ?)'

            //insert into table quiz only if idQuiz not exists
            db.run(sql, [newVideo.idMusician, newVideo.VideoName, newVideo.Path], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};

exports.changeNameAudio = (audio) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = 'UPDATE Audios SET AudioName=? WHERE MusicianID=? AND AudioID = ?'

            db.run(sql, [audio.newAudioName, audio.idMusician, audio.idAudio], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};


exports.changeNameVideo = (video) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = 'UPDATE Videos SET VideoName=? WHERE MusicianID=? AND VideoID = ?'

            db.run(sql, [video.newVideoName, video.idMusician, video.idVideo], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};

exports.deleteAvailability = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql1 = 'DELETE FROM DateAvailability WHERE idMusician = ?'
            const sql2 = 'DELETE FROM DateUnavailability WHERE idMusician = ?'
            const sql3 = 'DELETE FROM DayOfWeekAvailability WHERE idMusician = ?'

            db.run(sql1, [id], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            db.run(sql2, [id], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            db.run(sql3, [id], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            console.log(err);
            reject(err);
            return;
        }
    });
};

exports.deleteDefaultAudio = (idMusician) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = 'DELETE FROM DefaultAudios WHERE MusicianID = ?'

            //insert into table quiz only if idQuiz not exists
            db.run(sql, [idMusician], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};

exports.deleteProfilePicture = (idMusician) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = 'UPDATE Musicians SET profilePicture=? WHERE idMusician = ?'

            //insert into table quiz only if idQuiz not exists
            db.run(sql, [null, idMusician], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};

exports.deleteVideo = (videoToDelete) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = 'DELETE FROM Videos WHERE MusicianID = ? AND VideoName = ? AND Path = ?'

            //insert into table quiz only if idQuiz not exists
            db.run(sql, [videoToDelete.idMusician, videoToDelete.VideoName, videoToDelete.Path], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};

exports.insertAvailablePeriod = (m) => {

    return new Promise(async (resolve, reject) => {
        try {

            const sql = 'INSERT OR REPLACE INTO DateAvailability (idMusician, startDate, endDate)' +
                ' VALUES (?, ?, ?)';

            db.run(sql, [m.idMusician, m.startDate, m.endDate], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};

exports.insertRecurrentAvailability = (m) => {

    return new Promise(async (resolve, reject) => {
        try {

            const sql = 'INSERT OR REPLACE INTO DayOfWeekAvailability (idMusician, dayOfWeek) VALUES (?, ?)';

            db.run(sql, [m.idMusician, m.dayOfWeek], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};

exports.insertUnavailability = (m) => {

    return new Promise(async (resolve, reject) => {
        try {

            const sql = 'INSERT OR REPLACE INTO DateUnavailability (idMusician, singleDate) VALUES (?, ?)';

            db.run(sql, [m.idMusician, m.singleDate], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};


exports.deleteAudio = (audioToDelete) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = 'DELETE FROM Audios WHERE MusicianID = ? AND AudioName = ? AND Path = ?'

            //insert into table quiz only if idQuiz not exists
            db.run(sql, [audioToDelete.idMusician, audioToDelete.AudioName, audioToDelete.Path], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.lastID);
        } catch (err) {
            reject(err);
            return;
        }
    });
};

/*PUT*/

//Update musician
exports.updateMusician = (m) => {
    return new Promise(async (resolve, reject) => {
        try {

            const sql = 'UPDATE Musicians SET name=?, genresList=?, instrumentsList=?, numberMember=?, profilePicture=?, phone=?, website=?,' +
                ' email=?, facebookProfile=?, instagramProfile=?, twitterProfile=?, youtubeChannel=? WHERE idMusician=?';

            //insert into table quiz only if idQuiz not exists
            db.run(sql, [m.name, m.genresList, m.instrumentsList, m.numberMember, m.profilePicture, m.phone, m.website, m.email, m.facebookProfile, m.instagramProfile, m.twitterProfile, m.youtubeChannel, m.idMusician], function (err1) {
                if (err1) {
                    reject(err1);
                    console.log(err1);
                    return;
                }
            });

            resolve(this.changes);
        } catch (err) {
            reject(err);
            return;
        }
    });
};
