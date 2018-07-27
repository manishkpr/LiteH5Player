

// From: https://stackoverflow.com/questions/21173734/extracting-top-level-and-second-level-domain-from-a-url-using-regex/21174423#21174423
const DOMAIN_REGEX = /[^.]*\.[^.]{2,3}(?:\.[^.]{2,3})?$/;
// From: https://www.regular-expressions.info/ip.html
const IPADDRESS_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;


class LicenseController {
  constructor(props) {
  }

  setWhitelist(whitelist) {
    this.whitelist = whitelist;

    // BD
    // this.whitelist.forEach(function(value, index) {
    //   console.log(`whitelist, index[${index}] = ${value}`);
    // });
    // ED
  }

  checkUrl(url) {
    let ret = false;
    if (url.toLowerCase() === 'localhost') {
      ret = true;
    } else {
      // check ip address
      let arrRegex = url.match(IPADDRESS_REGEX);
      //console.log(`check ip: ${url} ==> ip: ${arrRegex}`);
      if (arrRegex) {
        for (let i = 0; i < this.whitelist.length; i++) {
          if (arrRegex[0] === this.whitelist[i]) {
            ret = true;
            break;
          }
        }
      } else {
        // check domain
        let arrRegex = url.match(DOMAIN_REGEX);
        //console.log(`check domain: ${url} ==> domain: ${arrRegex}`);
        if (arrRegex) {
          for (let i = 0; i < this.whitelist.length; i++) {
            if (arrRegex[0] === this.whitelist[i]) {
              ret = true;
              break;
            }
          }
        }
      }
    }

    return ret;
  }
}

export default LicenseController;



