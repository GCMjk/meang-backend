import { Db } from 'mongodb';
import { IPaginationOptions } from '../interfaces/pagination-options-interface';

/**
 * Assign a new ID based on the previous registration
 * @param database Database with which you work
 * @param collection Collection to search for the last item
 * @param sort How will be ordered { <property>: -1 }
 * @returns ID for the new registered item
 */
export const assignDocumentId = async(
    database: Db,
    collection: string,
    sort: object = { registerDate: -1 }
) => {
    const lastElement = await database
        .collection(collection)
        .find()
        .limit(1)
        .sort(sort)
        .toArray();

    if (lastElement.length === 0) {
        return '1';
    } 
    
    return String(+lastElement[0].id + 1);

};

/**
 * Filter item search
 * @param database Database with which you work
 * @param collection Collection to filter the item
 * @param filter Filters object
 * @returns Filtered element
 */
export const findOneElement = async(
    database: Db,
    collection: string,
    filter: object
) => {
    return database
        .collection(collection)
        .findOne(filter);
};

/**
 * Search for multiple items with filter
 * @param database Database with which you work
 * @param collection Collection where the search for elements is performed
 * @param filter Filters object
 * @returns Filtered items
 */
export const findElements = async (
    database: Db,
    collection: string,
    filter: object = {},
    paginationOptions: IPaginationOptions = {
        page: 1,
        pages: 1,
        itemsPage: -1,
        skip: 0,
        total: -1
    }
) => {
    if (paginationOptions.total === -1) {
        return await database.collection(collection).find(filter).toArray();
    }
    return await database.collection(collection).find(filter).limit(paginationOptions.itemsPage)
                            .skip(paginationOptions.skip).toArray();
};

/**
 * Insert an element
 * @param database Database with which you work
 * @param collection Collection where the insert is made
 * @param document Document
 * @returns Document inserted in collection
 */
export const insertOneElement = async (
    database: Db,
    collection: string,
    document: object
) => {
    return await database
        .collection(collection)
        .insertOne(document);
};

/**
 * Insert multiple items
 * @param database Database with which you work
 * @param collection Collection where the insert is made
 * @param documents Array of documents
 * @returns Documents inserted in the collection
 */
export const insertManyElements = async (
    database: Db,
    collection: string,
    documents: Array<object>
) => {
    return await database
        .collection(collection)
        .insertMany(documents);
};

/**
 * Update an element
 * @param database Database with which you work
 * @param collection Collection where the update is made
 * @param document Document
 * @returns Document updated in collection
 */
export const updateOneElement = async (
    database: Db,
    collection: string,
    filter: object,
    updateObject: Object
) => {
    return await database
        .collection(collection)
        .updateOne(
            filter,
            { $set: updateObject }
        );
};

/**
 * Delete an element
 * @param database Database with which you work
 * @param collection Collection where the delete is made
 * @param document Document
 * @returns Document deleted in collection
 */
export const deleteOneElement = async (
    database: Db,
    collection: string,
    filter: object = {}
) => {
    return await database
        .collection(collection)
        .deleteOne(filter);
};

/**
 * Document counting
 * @param database Database with which you work
 * @param collection Collection where the delete is made
 * @returns 
 */
export const countElements = async (
    database: Db,
    collection: string
) => {
    return await database.collection(collection).countDocuments();
};