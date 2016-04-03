# WEBCASE
## Installing webcase
- Install webcase via npm

```
npm install webcase -g
```

## Usage
- Create a directory for your new environment
- mkdir ~/test-app && cd $_
- Run the webcase initialization command

```
webcase { template_name } init
```

Fill the required information during the setup, and the project will create an environment in your current directory.
- Let's see if the environment works, shall we?
- npm start
- or
- npm run start

## Creating a template for webcase
- In order to create a new template for webcase we run the command:

```
webcase template init
```

- This command will create a new template for webcase
- In order to add a new template to webcase, we need to install it globally:

```
npm i webcase-my-template -g
```

- We can now use the new template by running:

```
webcase my-template init
```

- Note that a template must have the prefix `webcase-` in the package.json name in order to be treated by webcase

## Additional help
- You can always see the available commands for a template by using `webcase { template_name }`
- If you want to see the available templates installed on your system, use `webcase template list`

## OS Support
- UBUNTU - tested
- OSX - tested
- WINDOWS - This package was never tested on Windows OS and it might not work due to path separator
