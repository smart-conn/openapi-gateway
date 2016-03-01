'use strict';

const xml2js = require('xml2js');

class MessageCall {

  static fromAllJoynXMLAsync(xml) {
    return new Promise((resolve, reject) => {
      let parser = new xml2js.Parser();
      parser.parseString(xml, (err, result) => {
        if (err) return reject(err);
        this.data = result;
        return resolve(this);
      });
    });
  }

  toRequestOptions() {
    return {
      uri: 'https://github.com/'
    }
  }

}

module.exports = MessageCall;
