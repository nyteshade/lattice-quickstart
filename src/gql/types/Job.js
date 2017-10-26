import { Schema, Properties, GQLBase, resolver } from 'graphql-lattice'
import { Randarray } from '../../utils/Randarray'

@Schema(/* GraphQL */`
  type Job {
    name: String
    location: String
    description: String
  }

  type Query {
    findJob(name: String): Job
    listJobs: [Job]
  }
`)
// Here we point our type's 'name' field to the model's '_n' field
// 'location' is called 'location' in the model as well
@Properties(['name', '_n'], 'location')
export class Job extends GQLBase {
  /**
   * 'name' and 'location' are referenced directly from the model that
   * is provided to it on instance creation. 'description' however will
   * be a calculated or generated resolver, so we do that, in this case,
   * as a getter. Field resolvers can be a getter, a method or an async
   * function.
   */
  get description() {
    return `Your job is as ${this.name}. You'll be working ${this.location}`
  }

  /**
   * Query resolvers defined using the @resolver/@mutator/@subscriptor
   * decorators all receive a requestData object as their first parameter
   *
   * In this example we destructure out the request, response and graphql
   * object.
   *
   * @param {Object} requestData an object containing the req, res and
   * gql objects from express-graphql or apollo-server
   * @param {Object} queryParams the GraphQL query parameters for this
   * resolver
   * @returns an instance of Job initialized with model payload
   * @memberof Job
   */
  @resolver findJob({req, res, gql}, {name}) {
    return new Job(Job.randomModel(name))
  }

  /**
   * This one simply traverses the list of jobs and locations and uses
   * them to generate model payloads for all the possibilities. These
   * are returned as a list of `Job` objects.
   *
   * @param {Object} requestData an object containing the req, res and
   * gql objects from express-graphql or apollo-server
   * @returns an array of instantiated `Job` instances
   * @memberof Job
   */
  @resolver listJobs(requestData) {
    let jobs = []
    let count = jobs.length

    for (let i = 0; i < 10; i++) {
      jobs.push(new Job(Job.randomModel(null, (i == count - 1))))
    }

    return jobs;
  }

  /**
   * A little bit of repeated code to assist in creating random
   * jobs for Person
   */
  static randomModel(name) {
    let model = { _n: (name ? name : jobs.next), location: jobLocations.next }

    return model
  }
}


const jobs = Randarray.from(
  'a Wizard', 'a Zombie Hunter', 'a Fry-Cook', 'a Mechanic', 'a Programmer',
  'an Artist', 'a Murdering Clown', 'a Color Guard', 'a Pizza Cook',
  'a Carpenter', 'a Self declared Emperor'
)

const jobLocations = Randarray.from(
  'a Highrise', 'under a bridge', 'in a Smug Pretentious Study',
  'out of an AMC Gremlin', 'in the local Yarpa\'s Yummy Coffee',
  'out of a Small Stone Tower', 'in the nearby Holistic Medical Center',
  'in the A/V lab at Smallville High School',
  'in the back of the main theater at a Tech Conference',
  'in your Competitor\'s Basement', 'at the Hot Dog on a Stick in the mall'
)
