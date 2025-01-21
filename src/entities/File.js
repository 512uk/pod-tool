export default class File {
    constructor(path, name, content) {
        this.path = path;
        this.name = name;
        this.content = content;

        const magicNumbers = this.content.slice(0, 4).toString('hex');

        if (magicNumbers !== "49492a00" && magicNumbers !== "4d4d002a") {
            console.error("Magic number:", magicNumbers);
            throw new Error('Unknown and unsupported file type');
        }
    
    }

    fullpath() {
        return `${this.path}/${this.name}`;
    }

}