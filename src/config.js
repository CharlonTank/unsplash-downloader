import fs from 'fs';
import path from 'path';
import os from 'os';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_DIR = path.join(os.homedir(), '.unsplash-downloader');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

export async function getConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
            return config;
        }
        console.log('No configuration found. Let\'s set up your Unsplash credentials.');
        console.log('\nTo get your Unsplash API credentials:');
        console.log('1. Go to https://unsplash.com/developers');
        console.log('2. Register/Login to your account');
        console.log('3. Create a new application');
        console.log('4. Copy your Access Key and Secret Key\n');

        return await setupConfig();
    } catch (error) {
        console.error('Error reading configuration:', error.message);
        return null;
    }
}

export async function setupConfig() {
    try {
        const questions = [
            {
                type: 'input',
                name: 'accessKey',
                message: 'Enter your Unsplash Access Key:',
                validate: input => input.length > 0 ? true : 'Access Key is required'
            },
            {
                type: 'input',
                name: 'secretKey',
                message: 'Enter your Unsplash Secret Key:',
                validate: input => input.length > 0 ? true : 'Secret Key is required'
            }
        ];

        const answers = await inquirer.prompt(questions);
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(answers, null, 2));
        console.log('Configuration saved successfully!');
        return answers;
    } catch (error) {
        console.error('Error during configuration:', error.message);
        console.log('Please make sure you have the latest version of the package installed.');
        process.exit(1);
    }
} 