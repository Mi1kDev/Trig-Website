// class to control all the audio sounds
export class AudioManager{
    //class requires a reference to the main game class
    constructor(parent){
        this.parent = parent
        //a list of the file paths to the various background sound tracks
        this.bgm = [
            "../audio/NightDrive.mp3",
            "../audio/ICarly.mp3",
            "../audio/Untitled 13.mp3",
            "../audio/Dark Side.mp3",
            "../audio/Apocalypse.mp3"
        ]
        //index of the currently playing soundtrack
        this.currentSound = 0
        //base volume
        this.volume = 0.5
        //references the Audio Object when created
        this.track
        //holds the reference id to the fade interval once created
        this.fadeInterval
        //total amount of time for a music track to fade out before switching to the next track
        this.fadeSecondsTotal = 3
    }
    //getter function which returns the index of the currently playing sound
    getCurrentTrack(){
        return this.currentSound
    }
    //allows pausing and resume of a music track
    toggleAudioTrack(bool){
        if(!bool){
            this.pause()
        }else{
            this.play()
        }
    }
    //plays the background music at the current index
    play(){
        if(!this.track){
            this.track = new Audio(this.bgm[this.currentSound])
            //each music track is set to loop
            this.track.loop = true
            this.track.volume = this.volume
            //once the audio is loaded and ready to be played, the track is played
            this.track.oncanplaythrough = ()=>{
                this.track.play()
            }
        }else{
            //resumes a paused track
            if(this.track.paused){
                this.track.volume = this.volume
                this.track.play()
            }
        }
           
    }
    //pauses a playing track
    pause(){
        if(this.track){
            if(!this.track.paused){
                this.track.pause()
            }
        }
    }
    //stops a track and removes its references to sources
    stop(){
        if(this.track){
            this.track.src = null
            this.track.srcObject = null
        }
        //if the track was in the middle of fading out then the fading is stopped
        if(this.fadeInterval){
            clearInterval(this.fadeInterval)
        }
    }
    //switches between tracks and initiates fade out upon switching audio
    switchTrack(index){
        if(index < this.bgm.length){
            //updates the index of the audio to next play
            this.currentSound = index
            //reduces volume at a set interval to simulate audio fading
            this.fadeInterval = setInterval(()=>{
                this.fadeOut()
            }, (this.fadeSecondsTotal / (this.volume / 0.1)) * 1000)
        }
    }
    //reduces the volume of the playing track by an amount until it is silent
    fadeOut(){
        if(this.track.volume > 0.0){
            try{
                this.track.volume -= 0.1
            }catch(e){
                this.track.volume = 0
            }
            
        }else{
            //when the track has completely faded out, the next track is loaded and played
            clearInterval(this.fadeInterval)
            this.track.pause()
            this.track.currentTime = 0
            this.track.src = null
            this.track = null
            this.play()
        }
    }
}