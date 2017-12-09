

import Hello2 from './Hello2';

describe("Hello2", function () {
    it("should contain word 'World'", function () {
        expect(Hello2()).toContainWord("World!");
    });
});