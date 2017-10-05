
# Step 4

Create a mongo service to add persistence and shows how service
can help connecting pods

+ Display service and replicatset definition
```bash
cat mongo.yaml
```
+ Create the mongo pods and the service
```bash
kubectl create -f mongo.yaml
```
+ Display service information
```bash
kubectl get svc
kubectl describe svc mongo
```
+ Display the chat application
```bash
kubectl get po -o wide
ssh core@<NODE_IP> -L 8081:<BACK_POD_IP>:8081
ssh core@<NODE_IP> -L 8080:<FRONT_POD_IP>:8080
```
+ Delete service 
```bash
kubectl delete svc mongo
```