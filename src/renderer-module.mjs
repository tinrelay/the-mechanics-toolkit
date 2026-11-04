import fs from "node:fs";
import {parse} from "acorn";

function locate({file, id, parameters, registry = "__webpack_modules__"}, source) {
  const tree = parse(source, {ecmaVersion: "latest", sourceType: "module"});
  const declarations = tree.body.flatMap(node => {
    const declaration = node.type === "ExportNamedDeclaration" ? node.declaration : node;
    return declaration?.type === "VariableDeclaration"
      ? declaration.declarations.filter(value => value.id.name === registry) : [];
  });
  const owners = declarations.flatMap(declaration =>
    declaration.init?.type === "ObjectExpression"
      ? declaration.init.properties.filter(property => (property.key?.name ?? property.key?.value) === id)
      : []);
  if (declarations.length !== 1 || owners.length !== 1 || owners[0].value?.type !== "FunctionExpression") {
    throw new Error(`Upstream changed: renderer module ${id} in ${file} is not unique`);
  }
  const owner = owners[0].value;
  if (owner.params.map(parameter => parameter.name).join(",") !== parameters.join(",")) {
    throw new Error(`Upstream changed: renderer module ${id} parameters do not match`);
  }
  return {start: owner.body.start + 1, end: owner.body.end - 1};
}

export function readRendererModule(owner) {
  const source = fs.readFileSync(owner.file, "utf8");
  const {start, end} = locate(owner, source);
  return source.slice(start, end);
}

export function writeRendererModule(owner, body) {
  const source = fs.readFileSync(owner.file, "utf8");
  const {start, end} = locate(owner, source);
  const changed = source.slice(0, start) + body + source.slice(end);
  locate(owner, changed);
  fs.writeFileSync(owner.file, changed);
}
