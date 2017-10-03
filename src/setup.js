//import server from './fastify'
import server from './express'
import HTTP from 'http'

import { StopClock } from './utils/StopClock'
import { DefaultErrorHandler } from './utils/DefaultErrorHandler'

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

// A string template tag function that removes leading whitespace from 
// a given template string. Simple but effective.
let dedent = (strings, ...substitutes) => substitutes.reduce(
  (prev, cur, i) => `${prev}${cur}${strings[i + 1].replace(/^[ \t]*/gm, '')}`,
  strings[0].replace(/^[ \t]*/gm, '')
)

for (let {name, doStep, step} of [
  // Determine the ports we might be running the server on in this step. If 
  // you have some custom logic around this point, add it into the step() 
  // method below.
  {
    name: 'Calculate ports',    
    step(server) {
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
    }
  },
  
  // Start the HTTP server
  {
    name: 'Start the HTTP Server',
    step(server) {
      let port = server.get('ports').http;
      let http = HTTP.createServer(server)
      
      http.listen(port);
      http.on('error', DefaultErrorHandler.bind(server, 'http'))
      http.on('listening', () => {        
        console.log(dedent`
          The server is now listening locally on port ${port}.
          Try: http://localhost:${port}/graphql
        `)
      })
    }
  },
  
  // Start the HTTPS server if you so desire 
  {
    name: 'Start the HTTPS server',
    doStep: false,
    step(server) {
      // ignored for now; setup as you deem fit
    }    
  }
]) {
  if (typeof doStep === 'undefined' || !!doStep === true) {
    const timing = StopClock();
    step(server);
    console.log(`[\x1b[32m√\x1b[0m:${timing}] ${name}`)
  } 
  else {
    console.warn(`[\x1b[33mSkip \x1b[0m] ${name}`)
  }
}
