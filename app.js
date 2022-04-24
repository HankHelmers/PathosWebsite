/// test user id :

const APIController = (function() {
    
    const clientId = '28ca2d3814414c08858c196d669a3838';
    const clientSecret = 'c3d8cd535bc64d0591202b7226649040';

    // Getting token immediately when the application is opened
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        console.log(data)
        return data.access_token;
    }
    
    const _getGenres = async (token) => {
        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreId) => {
        const limit = 10;
        
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {
        const limit = 100;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrackAudioFeatures = async(token, trackId) => {
        //  https://api.spotify.com/v1/audio-features/id
        const result = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        if(data.error != null) {
            return "ERROR"
        }
        return data;
    }

    const _getTrack = async (token, trackEndPoint) => {
        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        if(data.error != null) {
            return "ERROR"
        }
        return data;
    }

    const _getUserPlaylists = async (token, userId) => {
        const result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
    
        const data = await result.json();

        if(data.error != null) {
            return "ERROR"
        }

        console.log(data)
        return data.items;
    }

    // Closures defined as public methods with access to privately defined methods _(methodName) above
    return {
        // Order of execution for the above functions
        getToken() {
            return _getToken();
        },
        getUserPlaylists(token, userId){
            return _getUserPlaylists(token, userId)
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        },
        getTrackAudioFeatures(token, trackId) {
            return _getTrackAudioFeatures(token, trackId)
        }
    }
})();


// UI Module 
const UIController = (function() {
    //object to hold references to html selectors
    const DOMElements = {
        buttonSubmit: '#btn_submit', // Reference to download button
        hfToken: '#hidden_token', // Reference to saved token
        idSubmit: '#select_id', // reference to inputted id
        messageText: '#message_text', // reference to the message text we send to usre
        
        downloadingDiv: '#downloading_bar',
        downloadingProgress: '#downloading_progress',
        downloadingMsg: '#downloading_msg'
    }

    //public methods
    return {
        //method to get input fields
        inputField() {
            return {
                // genre: document.querySelector(DOMElements.selectGenre),
                // playlist: document.querySelector(DOMElements.selectPlaylist),
                // tracks: document.querySelector(DOMElements.divSonglist),
                //songDetail: document.querySelector(DOMElements.divSongDetail)
                
                // inputted id
                id: document.querySelector(DOMElements.idSubmit),

                // download data button
                submit: document.querySelector(DOMElements.buttonSubmit),
                message: document.querySelector(DOMElements.messageText),
                
                downloadingDiv: document.querySelector(DOMElements.downloadingDiv),
                downloadingProgress: document.querySelector(DOMElements.downloadingProgress),
                downloadingMsg: document.querySelector(DOMElements.downloadingMsg),
            }
        },

        // need methods to create select list option
        // createGenre(text, value) {
        //     const html = `<option value="${value}">${text}</option>`;
        //     document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        // }, 

        // createPlaylist(text, value) {
        //     const html = `<option value="${value}">${text}</option>`;
        //     document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        // },

        // // need method to create a track list group item 
        // createTrack(id, name) {
        //     const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
        //     document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        // },

        // // need method to create the song detail
        // createTrackDetail(img, title, artist) {

        //     const detailDiv = document.querySelector(DOMElements.divSongDetail);
        //     // any time user clicks a new song, we need to clear out the song detail div
        //     detailDiv.innerHTML = '';

        //     const html = 
        //     `
        //     <div class="row col-sm-12 px-0">
        //         <img src="${img}" alt="">        
        //     </div>
        //     <div class="row col-sm-12 px-0">
        //         <label for="Genre" class="form-label col-sm-12">${title}:</label>
        //     </div>
        //     <div class="row col-sm-12 px-0">
        //         <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
        //     </div> 
        //     `;

        //     detailDiv.insertAdjacentHTML('beforeend', html)
        // },

        // resetTrackDetail() {
        //     this.inputField().songDetail.innerHTML = '';
        // },

        // resetTracks() {
        //     this.inputField().tracks.innerHTML = '';
        //     this.resetTrackDetail();
        // },

        // resetPlaylist() {
        //     this.inputField().playlist.innerHTML = '';
        //     this.resetTracks();
        // },




        
            // begin downloading
        hideSubmitButton() {
            console.log('hide button :P')
            this.inputField().submit.setAttribute("hidden", "hidden");
        },

        showSubmitButton() {
            console.log('show button')
            this.inputField().submit.removeAttribute("hidden");
        },

            // error messages
        hideMessageText() {
            //console.log('hide message');
            this.inputField().message.setAttribute("hidden", "hidden");
        },

        showMessageText(message) {
            //console.log('show message');
            this.inputField().message.innerHTML = message;
            this.inputField().message.removeAttribute("hidden");
        },
        
            // progress bar
        showProgressDiv() {
            this.inputField().downloadingDiv.removeAttribute("hidden");
        },

        updateProgressVal(progress) {
            console.log('progress updated ' + progress*100)
           this.inputField().downloadingProgress.setAttribute('value', progress*100);
        
            console.log(this.inputField().downloadingProgress.getAttribute('value'))
        },

        // DATA STORAGE & RETRIEVAL
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        },

        storePlaylistData(value) {
            document.querySelector(DOMElements.messageText).value = value;
        },

        getPlaylistData() {
            return {
                data: document.querySelector(DOMElements.messageText).value
            }
        },
    }

})();

// Combining UI Controller & API Controller to combine 
const APPController = (function(UICtrl, APICtrl) {
    // MESSAGES
    const noAccountFoundMsg = 'Sorry we were unable to find an account under that username, please try again.';
    const playlistsFoundMsg1 = 'We found a total of '; 
    const playlistsFoundMsg2 = ' public playlists under this user id.'

    // get input field object ref
    const DOMInputs = UICtrl.inputField();

    // get token on page load
    const loadToken = async () => {
       //get the token
        const token = await APICtrl.getToken();           
        //store the token onto the page
        UICtrl.storeToken(token);
    }


    // When the user id is updated / inputted
    DOMInputs.id.addEventListener('change', async (e) => {
        console.log(e.target.value)

        const token = UICtrl.getStoredToken().token;   
        console.log(token)
        const playlistData = await APICtrl.getUserPlaylists(token, e.target.value);


        // check that we actually got the data 
        if(playlistData == "ERROR") {
            console.log("Something went wrong with that id try again");
            
            UICtrl.showMessageText(noAccountFoundMsg);
            UICtrl.hideSubmitButton();
        } else {
            console.log(playlistData);
            
            UICtrl.storePlaylistData(playlistData);
            
            UICtrl.showMessageText(playlistsFoundMsg1 + playlistData.length + playlistsFoundMsg2);
            
            if(playlistData.length >= 1) {//UICtrl.hideMessageText();
                UICtrl.showSubmitButton();
            }
        }
    });

    // Button only shows up when a valid id has been inputted
    DOMInputs.submit.addEventListener('click', async (e) => {
        console.log("pressed")

        playlistData = UICtrl.getPlaylistData();

        console.log(playlistData)

        savePlaylistData(playlistData);
    });

    // check if successful requests
    const savePlaylistData = async (playlistsData) => {
        console.log("Saving playlist data...")

        playlistsData = playlistsData.data;          // REFERENCE TO THE PLAYLIST DATA JSON

        const token = UICtrl.getStoredToken().token; // REFERENCE TO API TOKEN TO MAKE CALLS 
        const numPlaylists = playlistsData.length;

        if(numPlaylists >= 1) {            

            UICtrl.showProgressDiv();

            // save playlist tracks data into a array :)
            completeDataEntries = [];

            for(let i = 0; i < numPlaylists; i++) { 
                // GET TRACKS FOR PLAYSTS
                const trackGetLink = playlistsData[i].tracks.href;
                tracksData = await APICtrl.getTracks(token, trackGetLink) // holds all the tracks data from playlist
                
                console.log(tracksData)

                trackIds = []; // holds the ids of this playlists tracks

                for(let i = 0; i < tracksData.length; i++) {
                    trackIds[i] = tracksData[i].track.id; // get only the track ids
                }

                console.log(trackIds)
                
                await sleep(5000);

                // // ADD ALL TRACK AUDIO FEATURES TO COMPLETE DATA ENTRIES
                completeDataEntriesCurrLength = completeDataEntries.length;

                for(let i = 0; i < tracksData.length;i++) { 
                    audioFeatureData = await APICtrl.getTrackAudioFeatures(token, trackIds[i])
                    
                    if(audioFeatureData == "ERROR") {
                        continue;
                    } else {
                        console.log(audioFeatureData)
                    }

                    completeDataEntries[i + completeDataEntriesCurrLength] = [
                        tracksData[i].track.name,
                        audioFeatureData.acousticness,
                        audioFeatureData.danceability,
                        audioFeatureData.energy,
                        audioFeatureData.duration_ms,
                        audioFeatureData.instrumentalness,
                        audioFeatureData.liveness,
                        audioFeatureData.loudness,
                        audioFeatureData.tempo,
                        audioFeatureData.valence,
                    ]
                } 

                console.log('playlists complete: ' + i)
                // update ui progress
                UICtrl.updateProgressVal("" + ( (i+1) / numPlaylists));
            }

            console.log(completeDataEntries)
            console.log('download csv :P')
            downloadCSVFile(completeDataEntries);
        } else {
            // tell the user we didn't find any information under that userId, 
            // either incorrect user id or no public playlists
            console.log("No playlists found")
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function downloadCSVFile(completeDataEntries) {
         //define the heading for each row of the data  
        var csv = 'name,acousticness,danceability,energy,duration_ms,instrumentalness,liveness,loudness,tempo,valence\n';  
        
        //merge the data with CSV  
        completeDataEntries.forEach(function(row) {  
                
            // if name has a comma => make it a space
            if(row[0].includes(',')) {
                row[0] = row[0].replace(",", " ")
            }

            csv += row.join(',');  
            csv += "\n";  
        });  
    
        var hiddenElement = document.createElement('a');  
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
        hiddenElement.target = '_blank';  
          
        //provide the name for the CSV file to be downloaded  
        hiddenElement.download = 'Song Data.csv';  
        hiddenElement.click();   
    }
    

    // create genre change event listener
    // DOMInputs.genre.addEventListener('change', async () => {
    //     //reset the playlist
    //     UICtrl.resetPlaylist();
    //     //get the token that's stored on the page
    //     const token = UICtrl.getStoredToken().token;        
    //     // get the genre select field
    //     const genreSelect = UICtrl.inputField().genre;       
    //     // get the genre id associated with the selected genre
    //     const genreId = genreSelect.options[genreSelect.selectedIndex].value;             
    //     // ge the playlist based on a genre
    //     const playlist = await APICtrl.getPlaylistByGenre(token, genreId);       
    //     // create a playlist list item for every playlist returned
    //     playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    // });
    // DOMInputs.submit.addEventListener('click', async (e) => {
    //     console.log('download data pressed')

    // });
     

    // create submit button click event listener
    
    // Download music was pressed
    

    

    // create song selection click event listener
    // DOMInputs.tracks.addEventListener('click', async (e) => {
    //     // prevent page reset
    //     e.preventDefault();
    //     UICtrl.resetTrackDetail();
    //     // get the token
    //     const token = UICtrl.getStoredToken().token;
    //     // get the track endpoint
    //     const trackEndpoint = e.target.id;
    //     //get the track object
    //     const track = await APICtrl.getTrack(token, trackEndpoint);
    //     // load the track details
    //     UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
    // });    

    return {
        init() {
            console.log('App is starting');
            loadToken(); // STARTS RUN DOWN
        }
    }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();




