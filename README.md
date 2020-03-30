# Twitter AAAPI Tester
A simple tester for Twitter Account Activity API.

## ✨ Features
- ✔ No port exposion needed
- ✔ No public web server needed
- ✔ Cross-platform supported

## 🚚 Prerequisites
- 📦 Node.js v12+
- 🌏 Internet connection
- 🐤 Twitter Developer Account with AAAPI access

## 🔧 Installation
1. Clone this repository, and enter the directory.
1. Install dependencies.

   ```console
   $ npm install
   ```

1. Configure HTTP server and Twitter API on `config.yaml` .

   ```console
   $ cp config.yaml.dist config.yaml
   $ vim config.yaml
   ```

1. Run the application.

   ```console
   $ npm start
   ```

## 🔖 Arguments
|Name|Description|
|---|---|
|-v|Enables detail output.|
|-vvv|Enables more detail output.|
