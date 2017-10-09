
/**
 * A class that extends Array but provides some additional accessors
 * to randomly fetch items without repeating itself; until it runs out of
 * unique answers that is.
 *
 * NOTE: Contents of a Randarray will not retain their indices. Do not
 * expect that contents at index 0 will remain at 0.
 */
export class Randarray extends Array {
  /**
   * This getter, `.next`, will return a unique random value until such time
   * as there are no uniques left to choose from. Then the array will reset
   * and pull from the whole batch.
   *
   * @method next
   * @return {mixed} a random value from within the array
   */
  get next() {
    let max = this.max || (this.max = this.length)
    let roll = parseInt(Math.random() * max, 10);
    let value = this[roll];

    this.splice(roll, 1)
    this.push(value)
    this.max = this.max - 1;
    this.max = ~Math.min(-1, this.max) ? this.length : this.max

    return value;
  }

  /**
   * Ensures that any `Array` functions that would normally return an array
   * return a `Randarray` instead.
   *
   * @readonly
   * @static
   * @memberof Randarray
   */
  static get [Symbol.species]() { return this }

  /**
   * Resets the current counter such that subsequent calls from next will
   * return a value from the whole of the items stored within the list.
   *
   * @memberof Randarray
   * @method reset
   */
  reset() {
    delete this.max
  }

  /**
   * Create a new `Randarray` instance from the supplied items.
   *
   * @memberof Randarray
   * @static
   *
   * @param {mixed} ...args
   * @returns {Randarray} an instance of `Randarray` initialized with the
   * contents supplied.
   */
  static from(...args) {
    let array = new Randarray()
    array.push(...args)
    return array
  }
}

export default Randarray
