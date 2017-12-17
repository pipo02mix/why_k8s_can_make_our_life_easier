
# Step 6

Play with nfs and volumes

In order to make it easy, lets create a nfs server on the master. This is thought to be a test scenario please 
read more documentation about how to make it secure if you want to run in real environment

```bash
sudo apt-get install nfs-kernel-server rpcbind -y
sudo mkdir -p /export //create a directory to share
sudo chmod -R 777 /export 
sudo vim /etc/exports (Add this line: /export       172.17.4.0/24(rw,fsid=0,insecure,no_subtree_check,async)
sudo vim /etc/hosts.allow (Add this line: rpcbind mountd nfsd statd lockd rquotad : ALL)
sudo service nfs-kernel-server restart
```

And voila, we have a nfs server (open to the world) to mount in our pods
Now lets add the config file here to be read for the app
```bash
echo "title=\"My nfs pv works\"" > /export/config.ini
```

In the nodes now we should install the client 
```bash
sudo apt-get install rpcbind nfs-common
sudo vim /etc/hosts.allow (Add this line: rpcbind : ALL)
```

Next step is add the PV with the server IP and the path, so
kubernetes will prepare it to be requested.
```bash
kubectl apply -f nfs-pv.yaml
kubectl get pv 
```
We should it has the correct status
Now we create a volume claim so the pod can request this storage
```bash
kubectl apply -f nfs-pvc.yaml
kubectl get pvc 
```
Here k8s should display the status bound after some seconds. Then we are ready to
create our pod with a nfs volume

Here we has change the spec to have a nfs volume with the correct pvc 
```bash
cat single_pod.yaml
```

Last step, is run it and check if our pod has mounted and we see the correct configuration
```bash
kubectl apply -f single_pod_basic.yaml
kubectl describe pod single-pod
kubectl exec single-pod -- curl localhost:8080
```
And you should see the correct message. Now this pod can be schedule to the other node or replicated and the volume will last
