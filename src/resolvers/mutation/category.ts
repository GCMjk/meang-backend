import { IResolvers } from '@graphql-tools/utils';
import CategoriesService from "../../services/categories.service";

const resolversCategoryMutation: IResolvers = {
    Mutation: {
        addCategory(_, variables, context) {
            return new CategoriesService(_, variables, context).insert();
        },
        updateCategory(_, variables, context) {
            return new CategoriesService(_, variables, context).modify();
        },
        deleteCategory(_, variables, context) {
            return new CategoriesService(_, variables, context).delete();
        }
    }
};

export default resolversCategoryMutation;