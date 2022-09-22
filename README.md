# TON Starter Template - Telegram Web App (TWA)
> Starter template for a new TWA interacting with the TON blockchain 

# Overview
This project is part of a set of 3 typical repositories needed for a blockchain dapp running on TON blockchain:

[Smart contracts in FunC that are deployed on-chain](https://github.com/ton-defi-org/tonstarter-contracts)
Web frontend for interacting with the dapp from a web browser (coming soon)
Telegram bot for interacting with the dapp from inside Telegram messenger (this repo)

# What does this repo contain?
* A react-based TWA-ready app, interacting with TON
* Github actions set to deploy app to github pages
* A script to connect a telegram bot to the deployed app

# How to use
1. Create a template from this repo with the "Use this template" button
   1. Choose a name for your repo
   2. Important! mark "Include all branches", otherwise github pages deployment will not work.
   ![image](https://user-images.githubusercontent.com/5641469/191731317-14e742fd-accb-47d4-a794-fad01148a377.png) 

2. Clone this repo and run `npm install`

3. Create a new bot with [botfather](https://t.me/botfather)
   1. Type `/newbot`
   2. Choose a name for your bot, e.g. `My Ton TWA`
   3. Choose a username for your bot, e.g. `my_ton_twa_482765_bot`
   4. Take note of the access token, e.g. `5712441624:AAHmiHvwrrju1F3h29rlVOZLRLnv-B8ZZZ`
   5. Run `./configure_bot.js` to link your bot to the webapp

# Development
1. Run `npm run dev` and edit the code as needed
2. On push to the `main` branch, the app will be automatically deployed via github actions.