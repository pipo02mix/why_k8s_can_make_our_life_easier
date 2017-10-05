
# Step 1

Play a bit with the pod resource


+ Display pod definition
```bash
cat single_pod.yaml
```
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
curl http://localhost:8080
```
+ Show pod information with node information
```bash
kubectl get po -o wide
```
+ Create a ssh tunnel to display the website 
```bash
ssh core@<NODE_IP> -L 8080:<POD_CLUSTER_IP>:8080
```
Open localhost:8080
+ Delete pod 
```bash
kubectl delete po single-pod
```