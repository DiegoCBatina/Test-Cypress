const report = require('multiple-cucumber-html-reporter');

const fs = require('fs');
const path = require('path');

const cucumberJsonDir = './cypress/cucumber-json/';
const cucumberReportFileMap = {};
const cucumberReportMap = {};
const jsonIndentLevel = 2;
const htmlReportDir = './cypress/test-results/html';
const screenshotsDir = './cypress/screenshots';

const getCucumberReportMaps = () => {
    if (fs.existsSync(cucumberJsonDir)) {
        const files = fs.readdirSync(cucumberJsonDir);
        files.forEach((file) => {
            const json = JSON.parse(
                fs.readFileSync(path.join(cucumberJsonDir, file)),
            );
            const [feature] = json[0].uri.split('/').reverse();
            cucumberReportFileMap[feature] = file;
            cucumberReportMap[feature] = json;
        });
    }
};

const addScreenshots = () => {
    if (fs.existsSync(screenshotsDir)) {
        const failingFeatures = fs.readdirSync(screenshotsDir);
        failingFeatures.forEach((feature) => {
            const screenshots = fs.readdirSync(path.join(screenshotsDir, feature));
            screenshots.forEach((screenshot) => {
                const scenarioName = screenshot
                    .match(/(?<=-- ).+?((?= \(example #\d+\))|(?= \(failed\)))/)[0]
                    .trim();
                const myScenarios = cucumberReportMap[feature][0].elements.filter(
                    (e) => e.name === scenarioName,
                );
                if (!myScenarios) { return; }
                myScenarios.forEach((myScenario) => {
                    const myStep = myScenario.steps.find(
                        (step) => step.result.status === 'failed',
                    );
                    if (!myStep) { return; }
                    const data = fs.readFileSync(
                        path.join(screenshotsDir, feature, screenshot),
                    );
                    if (data) {
                        const base64Image = Buffer.from(data, 'binary').toString('base64');
                        if (!myStep.embeddings) { myStep.embeddings = []; }
                        myStep.embeddings.push({ data: base64Image, mime_type: 'image/png' });
                    }
                    fs.writeFileSync(
                        path.join(cucumberJsonDir, cucumberReportFileMap[feature]),
                        JSON.stringify(cucumberReportMap[feature], null, jsonIndentLevel),
                    );
                });
            });
        });
    }
};

const generateReport = () => {
    report.generate({
        jsonDir: cucumberJsonDir,
        reportPath: htmlReportDir,
        displayDuration: true,
        launchReport: true,
        pageTitle: 'QA Report',
        reportName: `Teste - ${new Date().toLocaleString()}`,
        metadata: {
            browser: {
                name: 'chrome',
            },
            device: 'Browser',
            platform: {
                name: 'linux',
            },
        },
    });
};

getCucumberReportMaps();
addScreenshots();
generateReport();
