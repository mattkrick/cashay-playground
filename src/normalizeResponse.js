import {TypeKind} from 'graphql/type/introspection';
import {FRAGMENT_SPREAD, INLINE_FRAGMENT} from 'graphql/language/kinds';
import {mergeDeepWithArrs, mergeArrays, isObject} from './mergeDeep';
import im, {List} from 'immutable';

const {UNION, INTERFACE, LIST, OBJECT, NON_NULL, SCALAR} = TypeKind;

const mapResponseToResult = (nestedResult, response, regularArgs, paginationArgs) => {
  const regularArgsString = regularArgs && (Object.keys(regularArgs).length ? JSON.stringify(regularArgs) : '');
  if (paginationArgs) {
    const paginationObj = {};
    const {before, after, first, last} = paginationArgs;
    if (before) {
      paginationObj.before = before;
    } else if (after) {
      paginationObj.after = after;
    }
    const arrName = first ? 'front' : last ? 'back' : 'full';
    paginationObj[arrName] = response;
    response = paginationObj;
  }
  if (regularArgs === false) {
    return response;
  } else {
    const resultObj = {[regularArgsString]: response};
    if (isObject(nestedResult) && !Array.isArray(nestedResult)) {
      // Not sure if I need recursive merging, but playing it safe
      return mergeDeepWithArrs(nestedResult, resultObj, {mergeArrays});
    } else {
      return resultObj
    }
  }
};

const getSuppliedArgs = (args, variableValues = {}, paginationWords) => {
  const regularArgs = {};
  const paginationArgs = {};
  args
    .sort((a, b) => a.name.value < b.name.value)
    .forEach(arg => {
      const argName = arg.name.value;
      const argValue = arg.value.value || variableValues[argName];
      if (!argValue) return;
      const paginationMeaning = Object.keys(paginationWords).find(pageWord => paginationWords[pageWord] === argName);
      if (paginationMeaning) {
        paginationArgs[paginationMeaning] = argName;
      } else {
        regularArgs[argName] = argValue;
      }
    });
  const {before, after, first, last} = paginationArgs;
  if (before && !last || after && !first || before && first || after && last || before && after || first && last) {
    console.error('Pagination options are: `before, last` `after, first`, `first`, and `last`');
  }
  return {regularArgs, paginationArgs};
};

const getPossibleArgs = (schema, paginationWords) => {
  if (!schema.args) return {};
  let acceptsRegularArgs = false;
  let acceptsPaginationArgs = false;
  const paginationWordSet = Object.keys(paginationWords)
    .reduce((reduction, key) => reduction.add(paginationWords[key]), new Set());
  schema.args.forEach(arg => {
    if (paginationWordSet.has(arg.name)) {
      acceptsPaginationArgs = true;
    } else {
      acceptsRegularArgs = true;
    }
  });
  return {acceptsRegularArgs, acceptsPaginationArgs};
};

const separateArgs = (fieldSchema, reqASTArgs, {paginationWords, variableValues}) => {
  const responseType = ensureTypeFromNonNull(fieldSchema.type);
  const {acceptsRegularArgs, acceptsPaginationArgs} = getPossibleArgs(fieldSchema, paginationWords);
  let {regularArgs, paginationArgs} = getSuppliedArgs(reqASTArgs, variableValues, paginationWords);
  regularArgs = acceptsRegularArgs && regularArgs;
  paginationArgs = acceptsPaginationArgs && paginationArgs;
  if (paginationArgs && responseType.kind !== LIST) {
    console.warn(`${responseType} is not a List. Pagination args ignored`);
    paginationArgs = false;
  }
  return {regularArgs, paginationArgs}
};

const ensureTypeFromNonNull = type => type.kind === NON_NULL ? type.ofType : type;
//const ensureTypeFromList = type => type.kind === LIST ? ensureTypeFromNonNull(type.ofType) : type;
const ensureRootType = type => {
  while (type.ofType) type = type.ofType;
  return type;
};

const getSubReqAST = (key, reqAST, fragments) => {
  let subReqAST;
  for (let i = 0; i < reqAST.selectionSet.selections.length; i++) {
    const selection = reqAST.selectionSet.selections[i];
    if (selection.kind === FRAGMENT_SPREAD) {
      subReqAST = getSubReqAST(key, fragments[selection.name.value], fragments);
    } else if (selection.kind === INLINE_FRAGMENT) {
      subReqAST = getSubReqAST(key, selection, fragments);
      if (subReqAST) return subReqAST;
    } else if (selection.alias && selection.alias.value === key || selection.name.value === key) {
      subReqAST = selection;
    }
    if (subReqAST) {
      return subReqAST;
    }
  }
};

const visitObject = (bag, subResponse, reqAST, subSchema, context) => {
  return Object.keys(subResponse).reduce((reduction, key) => {
    if (key.startsWith('__')) return reduction;
    let subReqAST = getSubReqAST(key, reqAST, context.fragments);
    const name = subReqAST.name.value;
    const field = subSchema.fields.find(field => field.name === name);
    let fieldType = ensureRootType(field.type);
    //if (fieldType.kind === UNION && key !== 'members') {
    //  fieldType = {name: subResponse[key].__typename}
    //}
    let fieldSchema = context.schema.types.find(type => type.name === fieldType.name);
    // handle first recursion where things are stored in the query
    fieldSchema = fieldSchema || subSchema.types.find(type => type.name === fieldType.name);
    const normalizedResponse = visit(bag, subResponse[key], subReqAST, fieldSchema, context);
    if (field.args && field.args.length) {
      const {regularArgs, paginationArgs} = separateArgs(field, subReqAST.arguments, context);
      reduction[key] = mapResponseToResult(reduction[key], normalizedResponse, regularArgs, paginationArgs);
    } else {
      reduction[key] = normalizedResponse;
    }
    return reduction;
  }, {})
};
const visitEntity = (bag, subResponse, reqAST, subSchema, context, id) => {
  const entityKey = subSchema.name;
  bag[entityKey] = bag[entityKey] || {};
  bag[entityKey][id] = bag[entityKey][id] || {};
  let stored = bag[entityKey][id];
  let normalized = visitObject(bag, subResponse, reqAST, subSchema, context);
  mergeDeepWithArrs(stored, normalized, {mergeArrays});
  return `${entityKey}:${id}`;
};

const visitIterable = (bag, subResponse, reqAST, subSchema, context) => {
  return subResponse.map(res => visit(bag, res, reqAST, subSchema, context));
};

const visitUnion = (bag, subResponse, reqAST, subSchema, context) => {
  const concreteSubScema = context.schema.types.find(type => type.name === subResponse.__typename);
  return visit(bag, subResponse, reqAST, concreteSubScema, context);
};

const visit = (bag, subResponse, reqAST, subSchema, context) => {
  if (!isObject(subResponse)) {
    return subResponse;
  } else if (Array.isArray(subResponse)) {
    return visitIterable(bag, subResponse, reqAST, subSchema, context);
  } else if (subSchema.kind === UNION) {
    return visitUnion(bag, subResponse, reqAST, subSchema, context);
  } else {
    const isEntity = !!subSchema.fields.find(field => field.name === context.idFieldName);
    if (isEntity) {
      const id = subResponse[context.idFieldName];
      if (id) {
        return visitEntity(bag, subResponse, reqAST, subSchema, context, id);
      }
      console.warn(`Cashay: Cannot normalize ${subSchema.name}. Did not receive '${context.idFieldName}' field.`)
    }
    return visitObject(bag, subResponse, reqAST, subSchema, context);
  }
};

window.im = im;
window.target = {
  foo: [{id: 1}, {id: 2, a: {a1: 2}}, {id: 3}],
  bar: {
    d: 4,
    e: 5
  }
};

window.source = {
  foo: [{id: 2, a: {a1: 2}}, {id: 3}, {id: 4}],
  bar: {
    g: 7
  },
  baz: 1
};

//window.imTarget = im.fromJS(window.target);
//    debugger
//window.merged = window.imTarget.mergeDeepWith((prev, next, key) => {
//    const aa = key;
//  if (Array.isArray(next) && List.isList(prev)) {
//    const primaryKey = next[0].cursor ? 'cursor' : 'id';
//    const maxTraversals = Math.max(0, prev.size - next.length);
//    let arrayFront = prev;
//    for (let i = prev.size -1; i >= maxTraversals; i--) {
//      if (prev.getIn([i,primaryKey]) === src[0][primaryKey]) {
//        arrayFront = prev.slice(0,i);
//        break;
//      }
//    }
//    return arrayFront.concat(src);
//  }
//}, window.source)
export const normalizeResponse = (response, context) => {
  let bag = {};
  const operationType = `${context.operation.operation}Type`;
  const operationSchema = context.schema.types.find(type => type.name === context.schema[operationType].name);
  const result = visit(bag, response, context.operation, operationSchema, context);
  const data = {
    entities: bag,
    result
  };
  console.log(data)
  return data
};
