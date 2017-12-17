
# Step 5

## Ingress or how we communicate with the world

Ingress help us to route out traffic to inside our cluster

Because ingress need some different pieces to work and also with the aim to show how helm works, we will use it to create our ingress correctly

Please install helm as we explained [here](https)

```bash
helm install stable/nginx-ingress --name first-version --set rbac.create=true
```

To expose nginx service in the host nodes we need to use NodePort as services or make a port foward irectly to the nginx controller pod
```bash
export INGRESS_POD=$(kubectl get pods -l app=nginx-ingress \                                      
    -o template --template '{{range .items}}{{.metadata.name}} {{.status.phase}}{{"\n"}}{{end}}' \
    | grep Running | head -1 | cut -f1 -d' ')
kubectl port-forward $INGRESS_POD 8080:443
```
Personally, I like more this approach
```bash
kubectl patch svc first-version-nginx-ingress-controller -p '{"spec":{"type":"NodePort"}}'
```

