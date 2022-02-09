import ResolversOperationsService from './resolvers-operations.service';
import { IContextData } from '../interfaces/context-data.interface';
import { COLLECTIONS } from '../config/constants';

import { assignDocumentId, findOneElement } from '../lib/db-operations';

import slugify from 'slugify';

class CategoriesService extends ResolversOperationsService {

    collection = COLLECTIONS.CATEGORIES;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    // Show all categories
    async items() {
        const page = this.getVariables().pagination?.page;
        const itemsPage = this.getVariables().pagination?.itemsPage;
        const result = await this.list(this.collection, 'categorías', page, itemsPage);
        return { info: result.info, status: result.status, message: result.message, categories: result.items };
    }

    // Show a category
    async details() {
        const result = await this.get(this.collection);
        return { status: result.status, message: result.message, category: result.item };
    }

    // Register a category
    async insert() {
        const category = this.getVariables().category;
        // Check that it is not empty or undefined
        if (!this.checkData(category || '')) {
            return {
                status: false,
                message: 'La categoría no se ha especificado correctamente',
                category: null
            };
        }
        // Check that it does not exist
        if (await this.checkInDatabase(category || '')) {
            return {
                status: false,
                message: 'La categoría existe en la base de datos, intenta con otra categoría',
                category: null
            }
        }

        // Document creation validating the above conditions
        const categoryObject = {
            id: await assignDocumentId(this.getDb(), this.collection, { id: -1}),
            name: category,
            slug: slugify(category || '', { lower: true })
        };
        const result = await this.add(this.collection, categoryObject, 'category');
        return { status: result.status, message: result.message, category: result.item };
    }

    // Modify a category
    async modify() {
        const id = this.getVariables().id;
        const category = this.getVariables().category;

        // Checking the correct id
        if (!this.checkData(String(id) || '')) {
            return {
                status: false,
                message: 'El ID de la categoría no se ha especificado correctamente.',
                category: null
            };
        }
        // Check that it is not empty or undefined
        if (!this.checkData(category || '')) {
            return {
                status: false,
                message: 'La categoría no se ha especificado correctamente.',
                category: null
            };
        }
        const objectUpdate = { 
            name: category,
            slug: slugify(category || '', { lower: true })
        };

        const result = await this.update(this.collection, { id }, objectUpdate, 'category');
        return { status: result.status, message: result.message, category: result.item };
    }

    // Delete a category
    async delete() {
        const id = this.getVariables().id;

        if (!this.checkData(String(id) || '')) {
            return {
                status: false,
                message: 'El ID de la categoria no se ha especificado correctamente.',
                category: null
            };
        }

        const result = await this.del(this.collection, { id }, 'category');
        return { status: result.status, message: result.message };
    }

    // Check the information
    private checkData(value: string) {
        return (value === '' || value === undefined) ? false: true;
    }

    // Check in the database
    private async checkInDatabase(value: string) {
        return await findOneElement(this.getDb(), this.collection, {
            name: value
        });
    }
}

export default CategoriesService;