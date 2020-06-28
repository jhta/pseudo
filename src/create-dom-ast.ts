function createDOMSyntaxTree(node: any) {
  const $el = document.createElement("div");

  if (typeof node === "string") {
    $el.innerHTML = `<p>${node}<p>`;
    $el.classList.add("factor");

    return $el;
  }

  if (Array.isArray(node)) {
    const $list = document.createElement("div");

    for (const nodeItem of node) {
      const $block = document.createElement("div");
      $block.appendChild(createDOMSyntaxTree(nodeItem));
      $list.appendChild($block);
    }
    $el.appendChild($list);
    return $el;
  }

  $el.classList.add("expr");

  const $op = document.createElement("p");
  const $leaves = document.createElement("div");
  $leaves.classList.add("leaves");

  $op.innerHTML = node.operation;
  $op.classList.add("op");
  $el.appendChild($op);
  if (node.left) $leaves.appendChild(createDOMSyntaxTree(node.left));
  $leaves.appendChild(createDOMSyntaxTree(node.right));
  $el.appendChild($leaves);
  return $el;
}

export default createDOMSyntaxTree;
