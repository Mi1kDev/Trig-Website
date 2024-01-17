// improved version of settimeout, allows for pausing and resumption of timers
export class Timer{
    // requires a callback and a delay time
    constructor(callback, delay){
        this.callback = callback
        this.delay = delay
        this.start
        this.timerId
        this.remaining = delay
        this.resume()
    }
    // clears and deletes the timer Id if it exists
    clear(){
        if(!this.timerId){
            return
        }
        clearTimeout(this.timerId)
        this.timerId = null
    }
    // pauses active timers
    pause(){
        clearTimeout(this.timerId)
        this.timerId = null
        this.remaining -= Date.now() - this.start
    }
    // resumes (if the timer exists) or plays (if the timer does not exist) the timeout for the callback
    resume(){
        if(this.timerId){
            return
        }
        this.start = Date.now()
        this.timerId = setTimeout(this.callback, this.remaining)
    }
}