let player;

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQDdW47u7lIG5yy8zZVMHo1fgKYxcEDBqc4-b5TdXQWt7mauZDbg43w6S4RuRx2t2Y3rbqXPZ6uGF4HSxuJdf1u7ipsy3d8nm7pWpUcyF_4puhafrAVF2KnHLbrqDZGLCz70fQABmJ4agX93S9RcN-J8sC1lZz6-lu0SbA';

    player = new Spotify.Player({
        name: 'WebCustomPlayer',
        getOAuthToken: cb => { cb(token); }
    });

    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });
    player.connect().then(success => {
        if (success) {
            console.log('Weeehoo!\n Conectado!');
        }
    })

};

$(function(){
    hideElements();
    let actualVolume = 1;
    let playingTrack = false;
    
    let $valueSpan = $('.valueSpan2');
    $valueSpan.html(100+"%");
    $("#customRange11").val(100);

    
    $('.btnPlayPause').on('click', function(){
        player.togglePlay().then(() => {            
            getData();
            $('#rowSongName').show();
            if(!playingTrack){
                playingTrack = true;
                $('#playSong').hide();
                $('#pauseSong').show();
            }else{
                playingTrack = false;
                $('#playSong').show();
                $('#pauseSong').hide();
            }
        });
    });

    $('.btnChangeTrack').on('click', function(){
        let idAction = $(this).attr('id');
        
        if(idAction == "prevSong"){
            player.previousTrack().then(() => {
                getDataDelay();
            });
        }else{
            player.nextTrack().then(() => {
                getDataDelay();
            });
        }

    });

    $('.btnVolume').on('click', function(){
        let idAction = $(this).attr('id');

        if(idAction == "upVol"){
            actualVolume = actualVolume + 0.1;
        }else if(idAction == "downVol"){
            actualVolume = actualVolume - 0.1;
        }else{
            actualVolume = 2.7755575615628914e-17;
        }

        if(actualVolume > 1){
            actualVolume = 1;
        }else if(actualVolume < 0){
            actualVolume = 2.7755575615628914e-17;
        }

        if(actualVolume < 0.1){
            $valueSpan.html(0);
            $("#customRange11").val(0);
        }else{
            let formatedValue = parseInt(actualVolume*100);
            $("#customRange11").val(formatedValue);
            $valueSpan.html( formatedValue+"%");
        }

        player.setVolume(actualVolume);
    });

    function getData(){
        $('#rowActualSong').show();
        
        player.getCurrentState().then(state => {
            if (!state) {
                console.error('User is not playing music through the Web Playback SDK');
                return;
            }
        
            let {
                current_track,
                next_tracks: [next_track]
            } = state.track_window;
                    
            if( $('#songName').text() != current_track.name){
                $('#songName').text(current_track.name);
                $('#albumImage').attr('src',current_track.album.images[0].url)
            }
            
        });
    }


    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    const getDataDelay = async () => {
        await sleep(500);
        player.getCurrentState().then(state => {
            if (!state) {
                console.error('User is not playing music through the Web Playback SDK');
                return;
            }
        
            let {
                current_track,
                next_tracks: [next_track]
            } = state.track_window;
        
            if( $('#songName').text() != current_track.name){
                $('#songName').text(current_track.name);
                $('#albumImage').attr('src',current_track.album.images[0].url)
            }
            
        });
    }

    function hideElements(){
        $('#pauseSong').hide();
        $('#rowSongName').hide();
        $('#rowActualSong').hide();
    }
});

/*

    function getConfigs(file, callback) {
        var jsonConfigFile = new XMLHttpRequest();
        jsonConfigFile.overrideMimeType("application/json");
        jsonConfigFile.open("GET", file, true);
        jsonConfigFile.onreadystatechange = function() {
            if (jsonConfigFile.readyState === 4 && jsonConfigFile.status == "200") {
                callback(jsonConfigFile.responseText);
            }
        }
        jsonConfigFile.send(null);
    }
    
    
    readTextFile("json/SpotifyConfigurations.json", function(text){
        var data = JSON.parse(text);
        console.log(data);
    });
*/
