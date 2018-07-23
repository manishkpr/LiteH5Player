class DOM {
  constructor(tagName = 'div', attributes = {}, content = null) {
    const el = document.createElement(tagName);

    Object.getOwnPropertyNames(attributes).forEach(function(attrName) {
      el.setAttribute(attrName, attributes[attrName]);
    });

    if (!content) {
      this.textContent(el, content);
    }

    return el;
  }

  textContent(el, text) {
    if (typeof el.textContent === 'undefined') {
      el.innerText = text;
    } else {
      el.textContent = text;
    }
    return el;
  }
}

export default DOM;