class Test {
  constructor() {
  }

  get t1() {
    return 't1 here.';
  }
}

var t = new Test();
console.log('t.t1: ' + t.t1);