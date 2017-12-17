
# Step 0

## Install a cluster

There are three kind of clusters.

- One is using (coreOS and vagrant recipe)[]. The problem is with new versions of coreOS
there are some problems because the recipe is no more maintained by CoreOS.

- Now CoreOS encourages use Tectonic as installer and tool to run Kubernetes. There are a free 
version for less than 10 nodes clusters.

- [Last one and recommended is use kubeadm, vagrant and Ubuntu as OS.](/)

Explain basics of a cluster

+ Display the nodes
```bash
kubectl get node
kubectl get cs
```
+ Get components from kubernetes
```bash
kubectl get pod --n kube-system
```

## Install a self contained registry

We use  registry.yaml inside templates folder to load  the registry. Inside there is a deployment
with one replica that define the actual registry container. There is a service to make it available along
the cluster. And also a daemon set with a registry proxy so every node will have endpoint to make forwarding works.

Now with this command we get the registry pod name

```
export REGISTRY_POD=$(kubectl get pods --namespace kube-system -l k8s-app=kube-registry-upstream \
    -o template --template '{{range .items}}{{.metadata.name}} {{.status.phase}}{{"\n"}}{{end}}' \
    | grep Running | head -1 | cut -f1 -d' ')
```

And now we forward the pod registry port to host machine.
```
kubectl port-forward --namespace kube-system $REGISTRY_POD 5000:5000 &
```

In case of using mac, please add `docker.for.mac.localhost:5000` in the insecure
registry list so docker daemon will run against the local interface.


Now we should be able to push form our host (local) and pull from
the nodes. Let's try it.

```
docker pull busybox
docker tag busybox docker.for.mac.localhost:5000/busybox:latest
docker push docker.for.mac.localhost:5000/busybox:latest
```
> localhost for Linux users

And now run a pod in the k8s cluster
```
 kubectl run -i --tty busybox --image=10.101.91.182:5000/busybox:latest --restart=Never -- sh 
```
> This is IP (10.101.91.182) is the fix cluster Ip assigned to the registry (check the yaml) 