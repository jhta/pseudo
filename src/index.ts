// https://ruslanspivak.com/lsbasi-part2/
// import { FACTORS } from "./enums";
// import Token from "./Token";
import Lexer from "./Lexer";
import Parser from "./parser";

import Interpreter from "./Interpreter";

const str = "var = -7 + 3 * (10 / (12 / (3 + 1) - 1))";
const str2 = `

INICIO
  abc = -7 + 3 * (10 / (12 / (3 + 1) - 1));
FINAL
`;

console.log(
  str2
    .replace("\t", "")
    .replace(/(?:\r\n|\r|\n)/g, " ")
    .replace(/\s\s+/g, " ")
    .trim()
);
const l = new Lexer(str);
const l2 = new Lexer(str2);

let tok = l2.getNextToken();

while (tok.type !== "EOF") {
  console.log(tok);
  tok = l2.getNextToken();
}

//const l2 = new Lexer("1 + 2     4 + 5");

// console.log(l2.getNextToken());
// console.log(l.getNextToke:wn());
// console.log(l.getNextToken());
// console.log(l.getAllTheTokens().map(t => t.value));
const p = new Parser(l);
// const p2 = new Parser(l2);

const tree = p.verbose();
console.log("tree", tree);
// const tr = p.parse();
// const tree = p2.verbose();

// const v = new Visitor();
// console.log(v.visit(tr));

// const int = new Interpreter();
// console.log("interpreted:", int.interpret(str));
// console.log(int);

document.getElementById("app").innerHTML = `
<h1>Hello Parcel!</h1>
<div>
  Look
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>
  for more info about Parcel.
</div>
<div id="tree"></div>
`;

function createDOMSyntaxTree(node: any) {
  const $el = document.createElement("div");

  if (typeof node === "string") {
    $el.innerHTML = `<p>${node}<p>`;
    $el.classList.add("factor");

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

const $tree = document.getElementById("tree");

if (tree) {
  const $root = createDOMSyntaxTree(tree);
  $tree && $tree.appendChild($root);
}
