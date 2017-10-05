
# Step 3

Check how deployment resource manage pods

+ Display deployment definition
```bash
cat deployment_back.yaml
cat deployment_front.yaml
```
+ Create the both deployments
```bash
kubectl create -f deployment_back.yaml
kubectl create -f deployment_front.yaml
```
+ Display deployment information
```bash
kubectl get deploy
kubectl get rs
kubectl get pod
```
+ Display the chat application
```bash
kubectl get po -o wide
ssh core@<NODE_IP> -L 8081:<BACK_POD_IP>:8081
ssh core@<NODE_IP> -L 8080:<FRONT_POD_IP>:8080
```
+ Release a new deployment
```bash
kubectl set image deploy/my-awesome-frontend-app front-app=172.17.4.1:5000/my-awesome-frontend-app:0.0.2 --record
kubectl rollout status deploy/my-awesome-frontend-app
ssh core@<NODE_IP> -L 8080:<NEW_FRONT_POD_IP>:8080
``` 
+ See the rollout history
```bash
kubectl rollout history deploy/my-awesome-frontend-app
```
+ Rollback to a previous version 
```bash
kubectl rollout undo deploy/my-awesome-frontend-app --to-revision=1
```
+ Delete deployment 
```bash
kubectl delete deploy my-awesome-frontend-app
kubectl delete deploy my-awesome-backend-app
```