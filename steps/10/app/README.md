
**Installing some apps using draft**

To install draft with Mac just run (or go [here](https://github.com/Azure/draft/releases))
`brew tap azure/draft && brew install draft`

Now configure the registry to use the internal one
`draft config set registry docker.for.mac.localhost:5000`

Run the applications. To do that inside each folder run
`draft up`

You can expose the app to check if it works with connect
`draft connect -p 8080:3000` (in case frontend)