import clientSchema from './clientSchema.json';
import {normalizeResponse} from 'cashay/lib/normalizeResponse';
import {buildExecutionContext} from './buildExecutionContext';
import {denormalizeStore} from 'cashay/lib/denormalizeStore';
import {parse} from 'graphql/language/parser';
import {unionQueryString, unionResponse, unionExpectedResult} from './unionExample';
import {nestedQueryString, nestedResponse, nestedStore, nestedPaginationWords, nestedVariableValues} from './nestedExample';
import {back5Query, back5Response,frontPaginationWords, front5Query, front5Response } from './frontAndBacks';
import {mergeDeepWithArrs, mergeArrays, isObject} from 'cashay/lib/mergeDeep';
//const queryAST = parse(unionQueryString, {noLocation: true, noSource: true});
//const context = buildExecutionContext(clientSchema, queryAST, {idFieldName: '_id', store: unionExpectedResult});
//export const denormalizedResponse = denormalizeStore(unionExpectedResult, context);
//const queryAST = parse(nestedQueryString, {noLocation: true, noSource: true});
//const contextOptions = {
//  variableValues: nestedVariableValues,
//  paginationWords: nestedPaginationWords,
//  idFieldName: '_id',
//  store: nestedStore
//};
//const context = buildExecutionContext(clientSchema, queryAST, contextOptions);
//export const denormalizedResponse = denormalizeStore(context);
//console.log(denormalizedResponse);
//const queryAST = parse(back5Query, {noLocation: true, noSource: true});
//const context = buildExecutionContext(clientSchema, queryAST, {idFieldName: '_id', paginationWords: frontPaginationWords});
//const normalizedResponse = normalizeResponse(back5Response.data, context);
const queryASTfront = parse(front5Query, {noLocation: true, noSource: true});
console.log(front5Query, queryASTfront);
debugger
const contextFront = buildExecutionContext(clientSchema, queryASTfront, {idFieldName: '_id', paginationWords: frontPaginationWords});
const normalizedResponseFront = normalizeResponse(front5Response.data, contextFront);
const queryASTBack = parse(back5Query, {noLocation: true, noSource: true});
const contextBack = buildExecutionContext(clientSchema, queryASTBack, {idFieldName: '_id', paginationWords: frontPaginationWords});
const normalizedResponseBack = normalizeResponse(back5Response.data, contextBack);
const newState = mergeDeepWithArrs(normalizedResponseFront, normalizedResponseBack, {mergeArrays});
console.log(newState)
