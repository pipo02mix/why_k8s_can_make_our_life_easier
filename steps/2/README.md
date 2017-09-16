
# Step 2

Show how works a replicaSet resource


+ Display replicaSet definition
```bash
cat replica_set.yaml
```
+ Create the replicaSet resource with 3 replicas
```bash
kubectl create -f replica_set.yaml
```
+ List the replicaSets created
```bash
kubectl get rs
```
+ See resource description
```bash
kubectl describe rs/my-awesome-app
``` 
+ Kill a pod of replicaSet and see how creates a new one
```bash
kubectl delete po <POD_NAME>
```
+ Use horizontal auto scaling 
```bash
kubectl get po -o wide
ssh core@<NODE_IP> -L 8080:<POD_CLUSTER_IP>:8080
kubectl autoscale rs my-awesome-app --min=1 --max=6
kubectl get hpa

while true; do  
curl -s http://localhost:8080 > /dev/null; 
done

kubectl get hpa
```
+ Delete replicaset 
```bash
kubectl delete rs my-awesome-app
```