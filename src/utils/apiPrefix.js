const rawPrefix = process.env.API_PREFIX;
const API_PREFIX = !rawPrefix || rawPrefix === "undefined" ? "/dev-api" : rawPrefix;

export default API_PREFIX;
