//import server from './fastify'
import server from './express'
import HTTP from 'http'

import { StopClock } from './utils/StopClock'
import { SetupErrorHandler } from './utils/ErrorHandlers'
import { Stepper, Step } from 'stepwise'
import { dedent } from 'ne-tag-fns'

let ENV = process.env;
let env = ENV.NODE_ENV || 'development'
let opts = PACKAGE.server || {
  'development': {
    ports: {
      http: ENV.HTTP_PORT || 9000,
      https: ENV.HTTPS_PORT || 9443
    }
  }
}

let stepper = Stepper.from([server],
  // Determine the ports we might be running the server on in this step. If
  // you have some custom logic around this point, add it into the step()
  // method below.
  Step('Calculate ports', function(server) {
    // The dev server will run on port 9000 by default. The proxy in
    // the client webpack dev server will point to this port when used
    // during development. HTTPS ports need to be decided later for
    // use with HTTP2

    server.set('ports', {
      get http() {
        return opts[env] && opts[env].ports && opts[env].ports.http || 9000
      },

      get https() {
        return opts[env] && opts[env].ports && opts[env].ports.http || 9000
      },

      get named() {
        return opts[env] && opts[env].ports && opts[env].ports.named || 'nil'
      }
    })
  }),

  // Start the HTTP server
  Step('Start the HTTP server', function(server) {
    let port = server.get('ports').http;
    let http = HTTP.createServer(server)

    http.listen(port);
    http.on('error', SetupErrorHandler.bind(server, 'http'))
    http.on('listening', () => {
      console.log(dedent`
        The server is now listening locally on port ${port}.
        Try: http://localhost:${port}/graphql
      `)
    })
  }),

  Step('Start the HTTPS server', function(server) {
    // ignored for now; setup as you deem fit
  }, {proceed: () => false})
)

// Show some progress as we move through each step. Not required but a
// nice touch for those debugging or following along the server startup
// process.
stepper.on(Stepper.STEP_COMPLETED, (error, step, stepData) => {
  let stepPerformed = step.proceed();

  if (stepPerformed) {
    console.log(`[\x1b[32m√\x1b[0m:${stepData.stopclock}] ${step.name}`)
  }
  else {
    console.warn(`[\x1b[33mSkip \x1b[0m] ${step.name}`)
  }
})

stepper.startSteppin()
