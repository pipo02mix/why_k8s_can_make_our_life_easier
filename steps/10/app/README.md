
# Install draft

1. To install draft with Mac just run (or go [here](https://github.com/Azure/draft/releases))
`brew tap azure/draft && brew install draft`
[Other OS check here](https://github.com/Azure/draft/releases/tag/v0.15.0)

2. Now configure the registry to use the internal one
`draft config set registry docker.for.mac.localhost:5000`

3. Deploy the backend to the cluster. Enter in `backend` folder and run
`draft up`
It will build the container (from Dockerfile), push the image to the registry and execute helm install in the cluster.

4. Next, deploy the frontend too. Enter in `frontend` folder and run
`draft up`
It will do the same with the frontend application.

5. Finally, verify it worked. You can expose the app to check if it works with connect
`draft connect -p 8080:3000` (frontend)
Open the browser and browse to localhost:8080
It will display the intro message
