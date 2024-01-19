class JSONUtils {
  parseRequiredJSON (path) {
    return JSON.parse(JSON.stringify(require(`${path}`)))
  }
}

module.exports = { JSONUtils }
