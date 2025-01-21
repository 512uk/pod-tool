import { Client } from 'basic-ftp';

export default class FtpClient {
    constructor(config) {
        if (!config.host) {
            throw new Error('FTP Host is required');
        }

        if (!config.user) {
            throw new Error('FTP login user is required');
        }

        if (!config.password) {
            throw new Error('FTP login password is required');
        }
        
        if (config.secure === undefined || typeof config.secure !== 'boolean') {
            throw new Error('config.secure is required and should be either true or false');
        }

        this.config = config;
        this.client = new Client();
        this.connected = false;
    }

    async connect() {
        if (!this.connected) {
            try {
                await this.client.access(this.config);
                this.connected = true;
            } catch (error) {
                console.error("Failed to connect to FTP Server:", error);
                throw new Error(error);
            }
        }
    }

    async disconnect() {
        try {
            this.client.close();
            this.connected = false;
        } catch (error) {
            console.error("Failed to disconnect from FTP Server:", error);
            throw new Error(error);
        }
    }

    async upload(file, remotePath) {

        if (!this.connected) {
            throw new Error("FTP Client is not connected. Call connect() first.");
        }

        try {
            await this.client.uploadFrom(file, remotePath);
        } catch (error) {
            console.error(error);
            throw new Error(error);
        } finally {
            this.disconnect();
        }
    }

    /**
     * Test the connection to the FTP server
     * Will use the verbose mode to log out all the commands and interactions
     * with the FTP server.
     * 
     */
    async test() {

        if (!this.connected) {
            throw new Error("FTP Client is not connected. Call connect() first.");
        }
        
        try {
            this.client.ftp.verbose = true;
            console.log("Present working dir:", await this.client.pwd());
            this.client.ftp.verbose = false;
        } catch (error) {
            throw new Error(error);
        } finally {
            this.disconnect();
        }
    }
}