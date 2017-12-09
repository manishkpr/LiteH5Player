import XHRLoader from '../../src/utils/xhr_loader';

describe("XHRLoader", function () {
    let xhrLoader_ = new XHRLoader();

    it("load a url is true", function () {
        let url = "http://localhost/2/myhls/common/fileSequence0.ts";
        function cbSuccess(bytes) {

        }

        let request = { url: url, cbSuccess: cbSuccess };
        expect(xhrLoader_.load(request)).toBeTruthy();
    });
});



