export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
}

export function partialEqual(partialObj: any, fullObj: any): boolean {
  if (!partialObj || !fullObj) return false;
  for (const key of Object.keys(partialObj)) {
    if (partialObj[key] !== fullObj[key]) return false;
  }
  return true;
}
