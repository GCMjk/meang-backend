const GMR = require('@wiicamp/graphql-merge-resolvers');

import resolversUserQuery from './user';
import resolversProductQuery from './product';
import resolversCategoryQuery from './category';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversProductQuery,
    resolversCategoryQuery
]);

export default queryResolvers;