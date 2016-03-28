import clientSchema from '../node_modules/cashay/src/__tests__/clientSchema.json';
import {normalizeResponse} from '../node_modules/cashay/lib/normalizeResponse';
import {buildExecutionContext} from '../node_modules/cashay/lib/buildExecutionContext';
import {denormalizeStore} from '../node_modules/cashay/lib/denormalizeStore';
import {minimizeQueryAST} from '../node_modules/cashay/lib/minimizeQueryAST';
import {parse} from 'graphql/language/parser';
import {mergeDeepWithArrs} from '../node_modules/cashay/lib/mergeDeep';
import {front5Response, front5Query, front3Query,
  front2AfterQuery, front3Response, front2AfterResponse,
  front5Normalized, frontPaginationWords, front5QueryAfter5, front5ResponseAfter5} from '../node_modules/cashay/lib/__tests__/_front';
import {unionQueryString, unionNormalized, unionNormalizedMissingOwner, unionQueryStringExtraOwner, unionResponseMissingOwner} from '../node_modules/cashay/lib/__tests__/_union'
import {nestedQueryString, nestedResponse,
  nestedNormalized, nestedPaginationWords, nestedVariableValues, nestedNormalizedNoFirstAuthor,
  nestedNormalizedNoFirstComments} from '../node_modules/cashay/lib/__tests__/_nested'
// front 3 then 2
//const queryAST3 = parse(front3Query, {noLocation: true, noSource: true});
//const context3 = buildExecutionContext(clientSchema, queryAST3, {idFieldName: '_id', paginationWords: frontPaginationWords});
//debugger
//const normalizedResponse3 = normalizeResponse(front3Response.data, context3);

//const queryAST2 = parse(front2AfterQuery, {noLocation: true, noSource: true});
//const context2 = buildExecutionContext(clientSchema, queryAST2, {idFieldName: '_id', paginationWords: frontPaginationWords});
//const normalizedResponse2 = normalizeResponse(front2AfterResponse.data, context2);

//front 5 then 4
//const queryAST5 = parse(front5Query, {noLocation: true, noSource: true});
//const context5 = buildExecutionContext(clientSchema, queryAST5, {idFieldName: '_id', paginationWords: frontPaginationWords});
//const normalizedResponse5 = normalizeResponse(front5Response.data, context5);
//const queryAST4 = parse(front5QueryAfter5, {noLocation: true, noSource: true});
//const context4 = buildExecutionContext(clientSchema, queryAST4, {idFieldName: '_id', paginationWords: frontPaginationWords});
//const normalizedResponse4 = normalizeResponse(front5ResponseAfter5.data, context4);



// denorm with missing twitter prop
//const queryAST = parse(nestedQueryString, {noLocation: true, noSource: true});
//const unionOptions = {
//  variableValues: nestedVariableValues,
//  paginationWords: nestedPaginationWords,
//  idFieldName: '_id',
//  store: nestedNormalizedNoFirstComments
//};
//const context = buildExecutionContext(clientSchema, queryAST, unionOptions);
//const denormalizedResponse = denormalizeStore(context);
//console.log('response',denormalizedResponse)

// normal nest
//const queryAST = parse(nestedQueryString, {noLocation: true, noSource: true});
//const nestedOptions = {
//  variableValues: nestedVariableValues,
//  paginationWords: nestedPaginationWords,
//  idFieldName: '_id',
//  store: nestedNormalized
//};
//const context = buildExecutionContext(clientSchema, queryAST, nestedOptions);
//const denormalizedResponse = denormalizeStore(context);
//console.log('response',denormalizedResponse)

//missing union
const queryAST = parse(unionQueryString, {noLocation: true, noSource: true});
const unionOptions = {
  variableValues: nestedVariableValues,
  paginationWords: nestedPaginationWords,
  idFieldName: '_id',
  store: unionNormalized
};
const context = buildExecutionContext(clientSchema, queryAST, unionOptions);
const denormalizedResponse = denormalizeStore(context);
const minimizedQuery = minimizeQueryAST(queryAST.definitions[0], context.idFieldName);
console.log('response',denormalizedResponse);
console.log('min query', minimizedQuery);

