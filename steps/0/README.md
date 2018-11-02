
# Step 0

## Install a cluster

There are three kind of clusters.

- [One is using (coreOS and vagrant recipe). The problem is with new versions of coreOS
there are some problems because the recipe is no more maintained by CoreOS.](https://github.com/pipo02mix/why_k8s_can_make_our_life_easier/tree/master/cluster/coreos)

- [Now CoreOS encourages use Tectonic as installer and tool to run Kubernetes. There are a free 
version for less than 10 nodes clusters.](https://github.com/pipo02mix/why_k8s_can_make_our_life_easier/tree/master/cluster/tectonic)

- [Last one and recommended is use kubeadm, vagrant and Ubuntu as OS.](https://github.com/pipo02mix/why_k8s_can_make_our_life_easier/tree/master/cluster/ubuntu)

Check some default components in a bare cluster

+ Display the nodes
```bash
kubectl get node
kubectl get cs
```
+ Get components from kubernetes
```bash
kubectl get pod -n kube-system
```

## Install a self contained registry

We use  [registry.yaml](/cluster/registry.yaml) inside `cluster` folder to run  the registry. Inside there is a deployment
with one replica that define the actual registry container. Also, there is a service to make it available along
the cluster. Finally, a daemonset is deployed too for setting a registry proxy so every node can pull from it.

```
$ kubectl apply -f registry.yaml
```

Now we need to expose the registry outside the VMs in order to push the images we generate in our host.

```
$ export REGISTRY_POD=$(kubectl get pods --namespace kube-system -l k8s-app=kube-registry-upstream \
    -o template --template '{{range .items}}{{.metadata.name}} {{.status.phase}}{{"\n"}}{{end}}' \
    | grep Running | head -1 | cut -f1 -d' ')
```

Thanks to `port-forward` command we expose the registry in the port `5000`.
```
$ kubectl port-forward --namespace kube-system $REGISTRY_POD 5000:5000 > /dev/null 2>&1 &
```

Finally, you need to add `docker.for.mac.localhost:5000` (`localhost` in linux) in the insecure
registry list so docker daemon will know were the registry.

Let's push a iamge to the registry to verify everything works as expected.
```
$ docker pull busybox
$ docker tag busybox docker.for.mac.localhost:5000/busybox:latest
$ docker push docker.for.mac.localhost:5000/busybox:latest
```

__Note:__ If you are running on Linux, replace `docker.for.mac.localhost` for `localhost`. Docker in mac runs in a VM and expose it via DNS.

For Linux, it should work out of the box. 

[Open an issue](https://github.com/pipo02mix/why_k8s_can_make_our_life_easier/issues/new) in case something fails for you.

 ## Install helm
 
Use helm to install apps or tools in kubernetes cluster is a good idea. They are created by the community
with the best practices agreed by different contributors. Further, helm help to mantain version, run releases and rollbacks, and
use a central repository to save these receipts.

To install helm please [follow the official instructions](https://github.com/kubernetes/helm/blob/master/docs/install.md)

Since RBAC is enabled by default in new kubernetes versions we need to run helm with permissions.
Helm offers a client for run the actions and a server running as pod to interpret the commands. The
server is called Tiller and needs to run a [service account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) with the right permissions.
 
```
$ kubectl -n kube-system create sa tiller
$ kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller
$ helm init --service-account tiller
``` 

Helm client uses kubeconfig for connecting with kubernetes.
