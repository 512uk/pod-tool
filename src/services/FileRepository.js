import fs from 'fs';
import path from 'path';
import FileRepositoryInterface from './FileRepositoryInterface.js';

export default class FileRepository extends FileRepositoryInterface {
    constructor() {
        super();
    }

    async dir(directory) {
        return await fs.readdirSync(directory);
    }

    async read(directory, file) {
        return await fs.readFileSync(path.join(directory, file));
    }

    async write(directory, file, data) {
        return await fs.writeFileSync(path.join(directory, file), data);
    }

    async delete(directory, file) {
        return await fs.unlinkSync(path.join(directory, file));
    }

}