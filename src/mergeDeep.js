export const isObject = (val) => val && typeof val === 'object';

export const mergeArrays = (target, src) => {
  //check for overlap in docs, intelligently append keys
  const primaryKey = src[0].cursor ? 'cursor' : 'id';
  const maxTraversals = Math.max(0, target.length - src.length);
  let arrayFront = target;
  for (let i = target.length -1; i >= maxTraversals; i--) {
    if (target[i][primaryKey] === src[0][primaryKey]) {
      arrayFront = target.slice(0,i);
      break;
      //TODO verify afterFields are equal? only if we do janky mutations
    }
  }
  return arrayFront.concat(src);
};

export const mergeDeepWithArrs = (target, src, {mergeArrays}) => {
  const srcIsArr = Array.isArray(src);
  if (srcIsArr) {
    const targetIsArr = Array.isArray(target);
    if (targetIsArr) {
      target = mergeArrays(target, src);
    } else {
      //target is obj or scalar, src replaces it
      target = src;
    }
  } else {
    Object.keys(src).forEach(key => {
      if (isObject(target[key]) && isObject(src[key])) {
        target[key] = mergeDeepWithArrs(target[key],src[key]);
      } else {
        target[key] = src[key];
      }
    });
  }
  return target;
};
