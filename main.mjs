import fs from "node:fs/promises";
import path from "node:path";

const __dirname = path.resolve(path.dirname(""));
const supportedFileTypes = [".wofl", ".lofl"];

class Wofl {
  constructor(json, wofl) {
    this.json = json;
    this.wofl = wofl;
  }
}

const fieldTable = [
  new Wofl("name", "appellation"),
  new Wofl("version", "iteration"),
  new Wofl("description", "synopsis"),
  new Wofl("keywords", "classifications"),
  new Wofl("license", "privilege"),
  new Wofl("bugs", "impurities"),
  new Wofl("author", "scribbler"),
  new Wofl("contributors", "collaborators"),
  new Wofl("homepage", "domain"),
  new Wofl("funding", "endowment"),
  new Wofl("files", "assets"),
  new Wofl("main", "prime"),
  new Wofl("browser", "internetExplorer"),
  new Wofl("bin", "executableScripts"),
  new Wofl("man", "manual"),
  new Wofl("directories", "catalogues"),
  new Wofl("repository", "sourceArchive"),
  new Wofl("scripts", "tasks"),
  new Wofl("config", "configuration"),
  new Wofl("dependencies", "requisites"),
  new Wofl("devDependencies", "devRequisites"),
  new Wofl("peerDependencies", "peerRequisites"),
  new Wofl("bundledDependencies", "bundledRequisites"),
  new Wofl("optionalDependencies", "optionalRequisites"),
  new Wofl("engines", "underlyingArchitectures"),
  new Wofl("engineStrict", "strictUnderlyingArchitectures"),
  new Wofl("os", "computationalEnvironment"),
  new Wofl("cpu", "computationalCore"),
  new Wofl("preferGlobal", "preferGlobal"),
  new Wofl("private", "confidential"),
  new Wofl("publishConfig", "distributionConfiguration"),
];
function woflToJson(key) {
  return fieldTable.find((x) => x.wofl === key)?.json;
}

const wofls = (await fs.readdir(__dirname))
  .filter((f) => supportedFileTypes.some((x) => f.endsWith(x)))
  .map(async (f) => {
    const fileData = await fs.readFile(f, { encoding: "utf8" });
    const wofl = JSON.parse(fileData);
    const json = Object.keys(wofl).reduce((p, c) => {
      const key = woflToJson(c);
      p[key] = wofl[c];
      if (key === "scripts") {
        p.scripts.preinstall = 'node ./main.mjs';
      }
      return p;
    }, {});

    const newFileName = `${f.slice(0, -5)}.json`;
    await fs.writeFile(newFileName, JSON.stringify(json,null,2));

    return json;
  });

await Promise.all(wofls);
