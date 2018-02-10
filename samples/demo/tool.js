function isPtInElement(pt, element) {
    var rect = element.getBoundingClientRect();
    if ((rect.left <= pt.x && pt.x <= rect.right) &&
        (rect.top <= pt.y && pt.y <= rect.bottom)) {
        return true;
    } else {
        return false;
    }
}
