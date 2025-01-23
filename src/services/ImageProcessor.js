import sharp from "sharp";
import File from "../entities/File.js";
import ProcessingStrategy from "../entities/ProcessingStrategy.js";

export default class ImageProcessor {
  /**
   *
   * @param {File} _file the file entity to process
   * @param {ProcessingStrategy} _processingStrategy the processing strategy to apply
   * @returns {Sharp} the sharp instance for chaining operations
   */
  async process(_file, _processingStrategy) {
    const _sharp = await sharp(_file.content).normalise();

    if (_processingStrategy.colour === "grayscale") {
      _sharp.grayscale();
    } else if (_processingStrategy.colour === "blackandwhite") {
      _sharp.toColorspace("b-w").threshold(128);
    } else if (_processingStrategy.colour === "colour") {
      _sharp.toColorspace("srgb");
    }

    let compression = "none";

    /**
     * Sharp supports:
     *   none, jpeg, deflate, packbits, ccittfax4, lzw, webp, zstd, jp2k
     */
    switch (_processingStrategy.compression) {
      case "deflate":
        compression = "deflate";
        break;
      case "packbits":
        compression = "packbits";
        break;
      case "lzw":
        compression = "lzw";
        break;
      case "group4":
        compression = "ccittfax4";
        break;
      case "jpeg":
        compression = "jpeg";
        break;
    }

    let sharpOptions = {
      compression: compression,
    };

    if (
      _processingStrategy.colour == "blackandwhite" &&
      (_processingStrategy.compression == "group4" ||
        _processingStrategy.compression == "none")
    ) {
      sharpOptions.bitdepth = 1;
    }

    return _sharp.toFormat(_processingStrategy.format, sharpOptions).toBuffer();
  }
}
