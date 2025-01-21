export default class ProcessingStrategy {
    constructor({ colour, format, compression }) {
        this.setColour(colour);
        this.setFormat(format);
        this.setCompression(compression);
    }

    setColour(colour) {
        if (colour !== 'grayscale' && colour !== 'colour' && colour !== 'blackandwhite') {
            throw new Error('Invalid colour');
        }
        this.colour = colour;
    }

    setFormat(format) {

        format = format || 'tiff';

        if (format !== 'tiff' && format !== 'jpeg' && format !== 'png') {
            throw new Error('Invalid format');
        }
        this.format = format;
    }

    setCompression(compression) {
        // none, jpeg, deflate, packbits, ccittfax4, lzw, webp, zstd, jp2k
        if (compression !== 'none' && compression !== 'deflate' && compression !== 'packbits' && compression !== 'zstd' && compression !== 'lzw' && compression !== 'group4' && compression !== 'jpeg') {
            throw new Error('Unsupported or invalid compression method');
        }
        
        this.compression = compression;
    }
}