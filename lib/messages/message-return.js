'use strict';

const xml2js = require('xml2js');

class MessageReturn {

  static fromHttpBody(body) {
    this.data = body;
    return this;
  }

  static fromAllJoynXMLAsync(xml) {
    return new Promise((resolve, reject) => {
      let parser = new xml2js.Parser();
      parser.parserString(xml, (err, result) => {
        if (err) return reject(err);
        this.data = result;
        return resolve(this);
      });
    });
  }

  toAllJoynXML() {
    let builder = new xml2js.Builder();
    let xml = builder.buildObject(this.data);
    return xml;
  }

}

module.exports = MessageReturn;
