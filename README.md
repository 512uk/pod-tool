# Pod Tool

This is a NodeJS micro service which reads scanned POD files (TIFs), converts them from the default scanner settings, then uploads them to networks servers.

Currently support's Palletforce, which has the following requirements:

  - Black and white files
  - LZW tif compression
  - Upload to their FTP-SSL server, into the `PWImages/InDel` folder.

## Directories

Following directories need to be created on the server where this is deployed:

  - `pf_in` - where incoming TIFs will be dropped from the scanner.
  - `pf_ready` - where the converted files are left and uploaded.