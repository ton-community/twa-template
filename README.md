# twa-template
> Starter template for a new TWA interacting with the TON blockchain 

# Overview
The project is highly-opinionated, and there are many other alternate routes it could have taken. Some examples:
- Supports Ton Connect 2 wallets
- Uses vite with react (alternative to create-react-app)
- Uses the `ton` npm package

# Prerequesities
* Node.js v16 (other versions may work, needs more testing)
* A TON Connect compatible wallet (e.g. [Tonkeeper](https://tonkeeper.com/))

# What does this repo contain?
* A react-based TWA-ready app, interacting with TON
* Github actions set to deploy app to github pages
* A script to connect a telegram bot to the deployed app

# How to use
1. Create a template from this repo with the "Use this template" button
   1. Choose a name for your repo
   2. Important! mark "Include all branches", otherwise github pages deployment will not work.
   ![image](https://user-images.githubusercontent.com/5641469/191731317-14e742fd-accb-47d4-a794-fad01148a377.png) 

2. Clone this repo and run `yarn`

3. Create a new bot with [botfather](https://t.me/botfather)
   1. Type `/newbot`
   2. Choose a name for your bot, e.g. `My Ton TWA`
   3. Choose a username for your bot, e.g. `my_ton_twa_482765_bot`
   4. Take note of the access token, e.g. `5712441624:AAHmiHvwrrju1F3h29rlVOZLRLnv-B8ZZZ`
   5. Run `yarn configbot` to link your bot to the webapp

# Development
1. Run `npm run dev` and edit the code as needed
2. On push to the `main` branch, the app will be automatically deployed via github actions.

# Roadmap
- [ ] Jetton transfer support

# License
MIT
