class JSONUtils {
  constructor() {}

  parseRequiredJSON(path) {
    return JSON.parse(JSON.stringify(require(`${path}`)));
  }
}

module.exports = { JSONUtils };
