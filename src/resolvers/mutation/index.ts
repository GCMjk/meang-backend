const GMR = require('@wiicamp/graphql-merge-resolvers');

import resolversUserMutation from './user';
import resolversCategoryMutation from './category';

const mutationResolvers = GMR.merge([
    resolversUserMutation,
    resolversCategoryMutation
]);

export default mutationResolvers;