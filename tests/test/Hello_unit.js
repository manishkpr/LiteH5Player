describe("Hello", function() {
  var Hello = require("./Hello");
  var hello;

  beforeEach(function() {
    hello = new Hello();
  });

  it("2222a newly created Hello instance should not be the same instance with the origin one", function() {
    expect(hello).not.toBe(new Hello());
    expect(hello).toEqual(new Hello());
  });

  describe("helloWorld function", function() {
    it("should return hello statement", function() {
      expect(hello.helloWorld()).toBe("Hello World!");
    });

    it("should contain word 'World'", function() {
      expect(hello.helloWorld()).toContainWord("World!");
    });

    it("an undefined variable should pass 'toBeUndefined' matcher", function() {
      expect(hello.a).toBeUndefined();
    });

    it("a null variable should pass 'toBeNull' matcher", function() {
      expect(hello.bar).toBeNull();
    });

    it("variable after boolean casting should pass 'toBeTruthy' 'toBeFalsy' matcher", function() {
      expect(hello.foo).toBeTruthy();
      expect(hello.bar).toBeFalsy();
    });
    it("should pass the 'toMatch' matcher for regular expressions", function() {
      expect(hello.helloWorld()).toMatch(/^\w*\s\w*!$/);
    });
  });

  describe("helloSomeone function", function() {
    it("should calls the sayHello() function", function() {
      spyOn(hello, "sayHello");
      hello.helloSomeone("Chou");
      expect(hello.sayHello).toHaveBeenCalled();
      expect(hello.sayHello).toHaveBeenCalledTimes(1);
    });
    it("should greet the 'World'", function() {
      spyOn(hello, "helloSomeone");
      hello.helloSomeone("World");
      expect(hello.helloSomeone).toHaveBeenCalledWith("World");
      expect(hello.helloSomeone).not.toHaveBeenCalledWith("world");
    });
    it("should calls the fake sayHello()", function() {
      hello.sayHello = jasmine.createSpy("'sayHello' spy");
      hello.helloSomeone("world");
      expect(hello.sayHello).toHaveBeenCalled();
    });
  });
});