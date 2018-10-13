
## Configure some apps 

To make easier the deployment and development I use draft (ctl) which speed the creation and update of the Kubernetes resources and at the same time build and deploy the resources to the linked cluster.

## Install draft

- To install draft with Mac just run (or go [here](https://github.com/Azure/draft/releases))
`brew tap azure/draft && brew install draft`
[Other OS check here](https://github.com/Azure/draft/releases/tag/v0.15.0)

- Now configure the registry to use the internal one
`draft config set registry docker.for.mac.localhost:5000`

## Simple app (frontend, backend , db)

- Deploy the backend to the cluster. Enter in `backend` folder and run
`draft up`
It will build the container (from Dockerfile), push the image to the registry and execute helm install in the cluster.

- Next, deploy the frontend too. Enter in `frontend` folder and run
`draft up`
It will do the same with the frontend application.

- Finally, verify it worked. You can expose the app to check if it works with connect
`draft connect -p 8080:3000` (frontend)
Open the browser and browse to localhost:8080
It will display the intro message
