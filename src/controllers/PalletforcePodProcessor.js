import File from "../entities/File.js";
import ProcessingStrategy from "../entities/ProcessingStrategy.js";
import FileRepositoryInterface from "../services/FileRepositoryInterface.js";
import ImageProcessor from "../services/ImageProcessor.js";
import FtpClient from "../services/FtpClient.js";

export default class PalletforcePodProcessor {
  /**
   * @property {FtpClient} ftpClient the ftp client
   */
  ftpClient;

  /**
   *
   * @param {FtpClient} ftpClient the ftp client
   * @param {FileRepositoryInterface} fileRepository the file repository implementation we are using
   * @param {ImageProcessor} imageProcessor the image processor implementation we are using e.g. Sharp for Tiffs
   */
  constructor(ftpClient, fileRepository, imageProcessor) {
    this.ftpClient = ftpClient;
    this.imageProcessor = imageProcessor;
    this.fileRepository = fileRepository;
  }

  async processTiffFiles(inFolderPath, archiveFolderPath) {
    console.log("Palletforce processing started...");
    console.time("palletforce-processing-time");

    const files = await this.fileRepository.dir(inFolderPath);
    const validExtensions = ["tiff", "tif"];

    await this.ftpClient.connect();

    for (const fileName of files) {
      const ext = fileName.split(".").pop().toLowerCase();

      if (!validExtensions.includes(ext)) {
        continue;
      }

      console.log("Processing file:", fileName);

      const fileContents = await this.fileRepository.read(
        inFolderPath,
        fileName
      );

      // Create a new File instance representing the raw, unprocessed image file
      const _file = new File(inFolderPath, fileName, fileContents);

      // Create our processing strategy representing the desired output format
      const processingStrategy = new ProcessingStrategy({
        colour: "blackandwhite",
        format: "tiff",
        compression: "lzw",
      });

      // Create a new File instance representing the processed image file
      // setting it's content to the processed image data
      const _outputFile = new File(
        archiveFolderPath,
        `processed_${_file.name}`,
        await this.imageProcessor.process(_file, processingStrategy)
      );

      // Write the processed image file to the archive folder
      await this.fileRepository.write(
        archiveFolderPath,
        _outputFile.name,
        _outputFile.content
      );

      // Upload the processed image file to the FTP server
      await this.ftpClient.upload(
        _outputFile.fullpath(),
        `/PWImages/InDel/${_outputFile.name}`
      );

      // Delete the original image file
      await this.fileRepository.delete(_file.path, _file.name);
    }

    console.timeEnd("palletforce-processing-time");
  }
}
