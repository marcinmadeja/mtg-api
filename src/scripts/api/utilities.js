const utilities = (function () {
  function insertAfter(newNode, referenceNode) {
    const parent = referenceNode.parentNode;
    parent.insertBefore(newNode, referenceNode.nextSibling);
  }

  function removeNode(node) {
    const parent = node.parentNode;
    return parent.removeChild(node);
  }

  return {
    insertAfter,
    removeNode,
  };
}());

export default utilities;
