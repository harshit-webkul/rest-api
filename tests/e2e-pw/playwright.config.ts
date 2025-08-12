import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TESTS_ROOT_PATH = __dirname;
export const STATE_DIR_PATH = `${ TESTS_ROOT_PATH }/.state/`;
export const ADMIN_AUTH_STATE_PATH = `${ STATE_DIR_PATH }/admin-auth.json`;

dotenv.config({ path: path.resolve(__dirname, "../../../../../.env") });



let token = '';
const tokenFile = path.resolve(__dirname, './.state/admin-token.json');
    if (fs.existsSync(tokenFile)) {
      const tokenData = JSON.parse(fs.readFileSync(tokenFile, 'utf-8'));
      token = tokenData.token || '';
}

export default defineConfig({
    testDir: "./tests",

    timeout: 30 * 1000,

    expect: { timeout: 20 * 1000 },

    outputDir: "./test-results",

    fullyParallel: false,

    workers: 1,

    forbidOnly: !!process.env.CI,

    retries: 0,

    reportSlowTests: null,

    reporter: [
        [
            "html",
            {
                outputFolder: "./playwright-report",
            },
        ],
    ],

    use: {
        baseURL: `${process.env.APP_URL}/`.replace(/\/+$/, "/"),
        screenshot: { mode: "only-on-failure", fullPage: true },
        video: "retain-on-failure",
        trace: "retain-on-failure",
        extraHTTPHeaders: {
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
    },

    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
