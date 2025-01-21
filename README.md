# Pod Tool

This is a NodeJS micro service which reads scanned POD files (TIFs), converts them from the default scanner settings, then uploads them to networks servers.

Features:

  - Looking to extend or customise functionality? Start with `index.js`, the main entry point, and then a relevant Controller under `controllers`, which will act as the orchestrator/use case.
  - Can connect to various FTP servers, just pass your required FTP config to `FtpClient`.
  - Change processing options by editing or creating a `ProcessingStrategy` as required.  Under the hood, it is powered by the Sharp library.
  - Follows Uncle Bob's Clean Architecture principles so far as possible.
  - Due to the above - easily and highly extensible.

## .env file

You will need to create one with the variables you require at runtime. For example:

```
PF_HOST=palletforce-ftp-server.com
PF_USER=username
PF_PASSWORD='secretpassword'
PF_INPUT_FOLDER='pf_in'
PF_ARCHIVE_FOLDER='pf_arch'
```

## Directories

Following directories need to be created on the server where this is deployed:

  - Input folder e.g. `abc_in` - with TIF files from your scanner
  - Archive folder e.g. `abc_arch` - TIF files will be archived here after upload

Where `abc` is a reference to whatever network or partner you're working with.