// @flow

import { Schema, Properties, GQLBase } from 'graphql-lattice'

const names = [
  'Sally', 'Lucy', 'Ann', 'Lisa', 'Scarlet', 'Brielle', 'Kasia',
  'David', 'Mark', 'Daniel', 'Brian', 'Steven', 'Jacob', 'Joe'
] 
const jobs = [
  'Wizard', 'Zombie Hunter', 'Fry-Cook', 'Mechanic', 'Programmer',
  'Artist', 'Murdering Clown', 'Color Guard', 'Pizza Cook', 
  'Carpenter', 'Self declared Emperor'
]


@Schema(`
  type Person {
    name: String 
    job: String
  }
  
  type Query {
    findPerson(name: String!): Person 
    allThePeople: [Person]
  }
`)
@Properties('name', 'job')
export class Person extends GQLBase {
  /**
   * This function returns an object describing the documentation for this 
   * type. It is later merged with the `buildSchema()` generated AST object. 
   *
   * @method apiDocs
   * @return {Object} an object with documentation for this class
   */
  static apiDocs(): Object {
    // Reference the constants used to document your class; joinLines is a 
    // helper template tag function for making your multiline documentation 
    // easier to read in your source code.
    const {joinLines, DOC_CLASS, DOC_FIELDS, DOC_QUERIES} = this;

    let dedent = (strings, ...substitutes) => substitutes.reduce(
      (prev, cur, i) => `${prev}${cur}${strings[i + 1].replace(/^[ \t]*/gm, '')}`,
      strings[0].replace(/^[ \t]*/gm, '')
    )
    
    return {
      // The comment describing the class itself
      [DOC_CLASS]: dedent`
        The PersonSample class is exactly that, a contrived example for 
        use with the server. It should be picked up auotmatically by the
        ModuleParser and be available in GraphiQL.
        
        ## You can use Markdown here
        **bold** *italics* \`code\` 
        
        * etc
        * etc
      `,

      // One entry for each field for the type described by this class
      [DOC_FIELDS]: {
        name: `The name of the fictional person`,
        job: `The profession or job of the fictional person`
      },

      // One entry for each query resolver describe by this class 
      [DOC_QUERIES]: {
        findPerson: joinLines`
          This query loads the person in question by name. Given this is a 
          very contrived example on how to make this all go, the name queried 
          for is the name you'll receive. A random job will be applied as well
        `,
        
        allThePeople: joinLines`
          This returns a random number of people in a list. The names are 
          randomly chosen as are the jobs. You should receive no more than
          fourteen names.
        `
      }
    }
  }    
  
  /**
   * There should be one function for each query resolver in your schema for 
   * this type. The descriptions can include as much or as little information 
   * as you see fit.
   *
   * @method RESOLVERS
   * @param {[type]} express [description]
   * @return {Promise} [description]
   */
  static async RESOLVERS(express) {
    return {
      findPerson({name}) {
        return new Person({
          name,
          job: jobs[parseInt(Math.random() * 1000, 10) % jobs.length]
        })
      },
      
      allThePeople() {
        let count = (parseInt(Math.random() * 1000, 10) % 14) + 1;
        let peeps = [];
        let list = [].concat(names)
        
        for (let i = 0; i < count; i++) {
          let name = parseInt(Math.random() * list.length, 10)
          let job = parseInt(Math.random() * 1000, 10) % jobs.length;
          
          peeps.push(new Person({name: list.splice(name, 1), job: jobs[job]}))
          
        }
        
        return peeps;
      }
    }
  }
}