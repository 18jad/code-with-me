/**
 * @description Exclude properties from prisma request | object
 * @param object {Object}
 * @param keys {string[]} keys to exclude
 * @returns {Object} the object without the excluded keys
 */
const exclude = (object: any, keys: any[]) => {
  for (let key of keys) {
    delete object[key];
  }
  return object;
};

module.exports = exclude;
