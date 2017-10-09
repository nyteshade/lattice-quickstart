// @flow

import { Router } from 'express'
import { GQLExpressMiddleware, ModuleParser } from 'graphql-lattice'

const router = Router();
const parser = new ModuleParser(fromRoot('src', 'gql'))
const lattice = new GQLExpressMiddleware(parser.parseSync())

router.use('/graphql', lattice.middleware)
router.use('/schema', lattice.schemaMiddleware)
router.use('/ast', lattice.astMiddleware)

export default router;
