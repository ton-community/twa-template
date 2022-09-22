import axios from "axios";
import { createInterface } from "readline";
import fs from "fs";
import { promisify } from "util";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

function exitError(error) {
  console.error(`Error! ${error}`);
  process.exit(1);
}

const banner = `
░▀█▀░█▀█░█▀█░░░▀█▀░█░█░█▀█░░░█▀▀░▀█▀░█▀█░█▀▄░▀█▀░█▀▀░█▀▄
░░█░░█░█░█░█░░░░█░░█▄█░█▀█░░░▀▀█░░█░░█▀█░█▀▄░░█░░█▀▀░█▀▄
░░▀░░▀▀▀░▀░▀░░░░▀░░▀░▀░▀░▀░░░▀▀▀░░▀░░▀░▀░▀░▀░░▀░░▀▀▀░▀░▀
`;

console.log(banner);

let githubUsername, githubRepo, botUsername;

(async () => {
  try {
    const file = fs.readFileSync(".git/config").toString();
    const url = file.match(/url = (.*)/)[1];
    console.log(url);
    const params = url.match(/github.com[/:]([^/]*)\/(.*)\.git/);
    githubUsername = params[1];
    githubRepo = params[2];
  } catch (e) {}

  const accessToken = await question("Enter your bot access token: ");
  if (!accessToken?.length > 0) exitError("Token is required");

  const githubUsernameQ = await question(
    `Enter your github username${
      githubUsername ? ` (${githubUsername})` : ``
    }: `
  );
  githubUsername = githubUsernameQ || githubUsername;
  if (!githubUsername?.length > 0) exitError("Github username is required");

  const githubRepoQ = await question(
    `Enter your forked repo name${githubRepo ? ` (${githubRepo})` : ``}: `
  );
  githubRepo = githubRepoQ || githubRepo;
  if (!githubRepo?.length > 0) exitError("Repo name is required");

  const getBot = await axios.get(
    `https://api.telegram.org/bot${accessToken}/getMe`
  ).catch(exitError);

  botUsername = getBot.data.result.username;
  const url = `https://${githubUsername}.github.io/${githubRepo}`;

  console.log(`\n\nSetting bot ${botUsername} webapp url to ${url}`);

  const resp = await axios.post(
    `https://api.telegram.org/bot${accessToken}/setChatMenuButton`,
    {
      menu_button: {
        type: "web_app",
        text: "Launch Webapp",
        web_app: {
          url: url,
        },
      },
    }
  ).catch(exitError);

  if (resp.status === 200) {
    console.log(
      `\nYou're all set! Visit https://t.me/${botUsername} to interact with your bot`
    );
    process.exit();
  } else {
    exitError(`\nSomething went wrong! ${resp.error}`);
  }
})();
