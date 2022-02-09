import { IResolvers } from '@graphql-tools/utils';
import CategoriesService from '../../services/categories.service';

const resolversCategoryQuery: IResolvers = {
    Query: {

        // Category details
        async category(_, { id }, { db }) {
            return new CategoriesService(_, { id }, { db }).details();
        },

        // Show categories
        async categories(_, variables, { db }) {
            return new CategoriesService(_, {
                pagination: variables
            }, { db }).items();
        }
        
    }
};

export default resolversCategoryQuery;