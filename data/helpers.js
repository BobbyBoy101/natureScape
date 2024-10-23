export function latLonToDecimal (lat, lon, latRef, lonRef) {
    // Convert GPS coordinates to decimal format
    let latitude = lat[0] + lat[1] / 60 + lat[2] / 3600;
    let longitude = lon[0] + lon[1] / 60 + lon[2] / 3600;
    if (latRef === 'S') {
        latitude = -latitude;
    }
    if (lonRef === 'W') {
        longitude = -longitude;
    }
    return { latitude, longitude };
};

export const findKeys = (obj, keys) => {
    let result = {};
    for (let key of keys) {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
    }
    for (let k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            let nestedResult = findKeys(obj[k], keys);
            result = { ...result, ...nestedResult };
        }
    }
    return result;
};