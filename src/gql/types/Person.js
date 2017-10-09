// @flow

import { Schema, Properties, GQLBase, resolver } from 'graphql-lattice'
import { Randarray } from '../../utils/Randarray'

const names = Randarray.from(
  'Sally', 'Lucy', 'Ann', 'Lisa', 'Scarlet', 'Brielle', 'Kasia',
  'David', 'Mark', 'Daniel', 'Brian', 'Steven', 'Jacob', 'Joe'
)
const jobs = Randarray.from(
  'Wizard', 'Zombie Hunter', 'Fry-Cook', 'Mechanic', 'Programmer',
  'Artist', 'Murdering Clown', 'Color Guard', 'Pizza Cook',
  'Carpenter', 'Self declared Emperor'
)

@Schema(/* GraphQL */`
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
   * Example query resolver; finds a person with a given name. The name
   * itself doesn't matter for this example since we are not looking up
   * any data from a real data source.
   *
   * When used with express-graphql, the requestData object has the format
   * { req, res, gql } where
   *   • req is an Express 4.x request object
   *   • res is an Express 4.x response object
   *   • gql is the graphQLParams object in the format of
   *     { query, variables, operationName, raw }
   *     See https://github.com/graphql/express-graphql for more info
   *
   * @method Person.findPerson
   *
   * @param {Object} requestData this will contain data specific to the
   * request as sent by Express. Specifically it will be an object with
   * {req, res, gql}. See above for further details
   * @param {Object} name through destructuring, the name property is
   * extracted. GraphQL parameters are always sent as an object of name
   * value pairs.
   */
  @resolver
  findPerson(requestData, {name}) {
    let job = jobs.next;

    jobs.reset();

    return new Person({ name, job })
  }

  /**
   * To demonstrate returning an array of a given type, the `allThePeople`
   * query simply returns a random number of people generated with the
   * `findPerson` code.
   *
   * See `findPerson()` for more information on the requestData parameter
   * supplied to resolvers, mutators and subscriptors in graphql-lattice
   *
   * @method Person.findPerson
   *
   * @param {Object} requestData this will contain data specific to the
   * request as sent by Express. Specifically it will be an object with
   * {req, res, gql}. See above for further details
   */
  @resolver
  allThePeople(requestData) {
    let count = (parseInt(Math.random() * 1000, 10) % 14) + 1;
    let peeps = [];

    for (let i = 0; i < count; i++) {
      let name = names.next
      let job = jobs.next

      peeps.push(new Person({name, job}))
    }

    names.reset();
    jobs.reset();

    return peeps;
  }

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

    return {
      // The comment describing the class itself
      [DOC_CLASS]: joinLines`
        The PersonSample class is exactly that, a contrived example for
        use with the server. It should be picked up auotmatically by the
        ModuleParser and be available in GraphiQL.

        ## You can use Markdown here
        **bold** *italics* \`code\`

        * etc
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
}
