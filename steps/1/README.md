
# Step 1

Play a bit with the pod resource

+ Display a basic pod definition 
```bash
cat single_pod_basic.yaml
```
Here you can see basic properties you should define to run a pod with a single container.

First there is the `apiVersion` which defines the version of the [Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-versioning)
for the current resource, in our case the Pod. 
Secondly, we specify the resource name to create `kind`.
The all the `metadata` like name, namespace, annotations.
The last field is `spec` and here is where the main configuration is done.  

Now it is time to create a container for running inside our kubernetes cluster.
We have a http server (I know it is not really revolutionary) in the app folder and we should create our image and push it
into the registry before use it in the pod.

```bash
cd app
docker build -t docker.for.mac.registry:5000/my-awesome-app:0.0.0 .
docker push docker.for.mac.localhost:5000/my-awesome-app:0.0.0
```
> Use localhost for Linux OS

Run the pod and observe the result
```bash
kubectl create -f single_pod_basic.yaml
kubectl get pods //Hopefully is should be Running
kubectl logs -f <pod_name> //You should see a message of server listening
```
Now we can try to test if it works running a pod to query the Node server pod
We need to know the IP of the pod
```bash
kubectl get pod -o wide
```
And now we run the temporary pod and make a request to our single pod
```bash
kubectl run -i --tty busybox --image=busybox -- sh
wget -qO- <pod_ip>:8080 //You should see the incoming message
```
Clean our mess
```bash
kubectl delete pod,deploy single-pod busybox
```

Now let's make it more interesting

We build a new app version which it reads a ini configuration file from a volume.
Why? because we will have another container with the same volume mounted which will
write configuration text. Two containers will shared the volume because they are
in the same pod living.

Let's create the new version
```bash
cd app_advanced
docker build -t docker.for.mac.localhost:5000/my-awesome-app:0.0.1 .
docker push docker.for.mac.localhost:5000/my-awesome-app:0.0.1
```

+ Display pod definition a bit more complex
```bash
cat single_pod.yaml
```
So we can observe there are three containers.
One with our known app. Second one, which only echo a text and stops.
And a curl container we will use to make a request checking the network sharing.

+ Create the pod resource with the three containers inside
```bash
kubectl create -f single_pod.yaml
```
+ List the pod created
```bash
kubectl get pod
```
+ See resource description
```bash
kubectl describe po/single-pod
``` 
+ Show app container logs
```bash
kubectl logs -f single-pod -c my-awesome-app
```
+ Ssh to curl container and make a request to app container
```bash
kubectl exec single-pod -c curl-container -ti sh
curl http://127.0.0.1:8080
```

Open localhost:8080
+ Delete pod 
```bash
kubectl delete po single-pod
```