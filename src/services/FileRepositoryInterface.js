export default class FileRepositoryInterface {
    async dir(dirPath) {
        throw new Error('dir(dirPath) method must be implemented');
    }

    async read(dirPath, filename) {
        throw new Error('read(dirPath, filename) method must be implemented');
    }

    async write(dirPath, filename, data) {
        throw new Error('write(dirPath, filename, data) method must be implemented');
    }

    async delete(dirPath, filename) {
        throw new Error('delete(dirPath, filename) method must be implemented');
    }
}