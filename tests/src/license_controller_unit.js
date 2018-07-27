import LicenseController from '../../src/controller/license_controller';

describe("LicenseChecker", function() {
  it("should output word 'domain.com'", function() {

    const whitelist = [
      '10.2.68.64',
      'vo-joseph.com',
      'test1.com',
      'test2.com'
    ];

    let licenseController_ = new LicenseController();
    licenseController_.setWhitelist(whitelist);
    
    const targeDomain = [
      'localhost',
      '10.2.68.64',
      'vo-joseph.com',
      'wrong1.com',
      'wrong2.com.cn',
      'test1.com'
    ];

    targeDomain.forEach(function(value) {
        let ret = licenseController_.checkUrl(value);
        console.log(`check ${value} = ${ret}`);
    });
  });
});
