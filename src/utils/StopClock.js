// @flow

/**
 * StopClock catches the current timestamp when created and allows you to 
 * easily take multiple timings as well as reset the data in you StopClock 
 * instance. 
 *
 * @method StopClock
 * @constructor
 */
export function StopClock() {
  return {
    /**
     * Resets the start time as well as any previously stored stop timings
     *
     * @method StopClock#reset
     */
    reset() {
      this.start = Date.now();
      this.stops.splice(0, this.stops.length)
    },
    
    /**
     * A number property representing when the object was created or when 
     * the last time `reset()` was called.
     *
     * @type {number}
     * @instance
     */
    start: Date.now(),
    
    /**
     * An array of timings, in milliseconds, denoting the last time a call 
     * to stop was made relative to when the `StopClock` was started
     *
     * @type {Array<number>}
     * @instance
     */
    stops: [],
    
    /**
     * A function that both adds a new calculated stop timing to the list of 
     * recorded `stops` as well as returns a the number recorded. Again the 
     * value returned is the number of milliseconds since the start time. 
     *
     * @method StopClock#stop
     *
     * @param {boolean} relative if true, then the returned value is calculated 
     * since the last stop or the start time if there are no stops recorded yet
     * @return {number} the number of milliseconds that have passed since the 
     * start time was recorded or the last recorded stop time if relative is 
     * true and there is one to compare to.
     */
    stop(relative: boolean = false) {
      const now = Date.now();
      const last = this.stops.length && relative
        ? this.stops[this.stops.length - 1]
        : this.start
      const time = now - last;
      
      this.stops.push(time);
      return time;
    },
    
    /**
     * When evaluated as a string, the current time elapsed in milliseconds 
     * since the clock was started is returned as a string. The string is also 
     * labeled with a trailing 'ms'. So 3000 would be '3000ms'.
     *
     * @method StopClock#toString
     * 
     * @return {string} the elapsed time since start in milliseconds as a
     * string postfixed with 'ms'
     */
    toString() {
      const time = Date.now() - this.start;

      return `${time}ms`;
    },
    
    /**
     * The `Symbol.toStringTag` symbol denotes the type of the object or 
     * object instance in question. For StopClock instances, that is the 
     * string "StopClock". 
     *
     * Passing an instance of `StopClock` through Object.prototype.toString 
     * will reveal the string `"[object StopClock]"`
     *
     * @return {string} the value `"StopClock"`
     */
    get [Symbol.toStringTag]() { return 'StopClock'; }
  }
}

export default StopClock;