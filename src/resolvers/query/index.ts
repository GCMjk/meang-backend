const GMR = require('@wiicamp/graphql-merge-resolvers');

import resolversUserQuery from './user';
import resolversProductQuery from './product';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversProductQuery
]);

export default queryResolvers;