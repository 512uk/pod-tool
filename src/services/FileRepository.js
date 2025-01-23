import { promises as fs } from "fs";
import path from "path";
import FileRepositoryInterface from "./FileRepositoryInterface.js";

export default class FileRepository extends FileRepositoryInterface {
  constructor() {
    super();
  }

  async dir(directory) {
    return await fs.readdir(directory);
  }

  async read(directory, file) {
    return await fs.readFile(path.join(directory, file));
  }

  async write(directory, file, data) {
    return await fs.writeFile(path.join(directory, file), data);
  }

  async delete(directory, file) {
    return await fs.unlink(path.join(directory, file));
  }
}
