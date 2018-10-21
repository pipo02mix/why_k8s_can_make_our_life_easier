
# Service Mesh - Istio

## Prerequisites

- [Install a multi node cluster in your machine](/cluster/ubuntu/README.md)
- [Be sured to have running and configured helm and a private registry](/steps/0#install-a-self-contained-registry)
- [Configure some apps before install the service mesh](/steps/10/app/README.md)

Afterwards you should have running a cluster of three nodes (one master and two workers), with Kubernetes installed on it. Also there is a registry running exposing an endpoint in every node to allow container runtime to pull images inside the cluster. We have port forward the registry to be able to push images to the aforementioned registry. At the same time, Helm has been configured in the cluster help maitain our application. Finally, we have used `draft` to build and deploy the example application. It means we are ready to start our journey through the Istio world.

## 0. Deploy Istio in our cluster

For the installation, we will leverage in helm to deploy Istio easily
```
# Get the latest version of the project 
$ curl -L https://git.io/getLatestIstio | sh -

# Install Custom Resources first
$ kubectl apply -f install/kubernetes/helm/istio/templates/crds.yaml

# Install Istio componentskubectl get validatingwebhookconfiguration -o yaml
$ helm install install/kubernetes/helm/istio --name istio --namespace istio-system 
```
It creates all custom resources and services to manage the service mesh

Let's check all components coming up correctly
```
$ kubectl get pod -n istio-system -w
```

Once all components are on good shape, we can said Istio is ready for playing!

Let's start to see the powerness of istio.

## Inject the sidecars

All the components have been deployed but the existing apps are not part of the mesh yet. To make it happens we need to inject eh sidecar which will proxy all traffic and apply the policies. There are two different ways to inject it, automated and manual.

### Automatic

The automated injection mechanism relies on the mutate admission controllers functionality offered by Kubernetes API. Just labelling the namespace that we want will make all deployments launch there will contain the sidecar.

```
$ kubectl label namespace default istio-injection=enabled
```

### Manual

For manual deployment we use the istio `ctl` which converts the resource deployment `yaml` injecting an extra container.

```
$ kubectl get deploy frontend-app -o yaml | istioctl kube-inject -f - | kubectl apply -f -
$ kubectl get deploy backend-app -o yaml | istioctl kube-inject -f - | kubectl apply -f -
```

### Verify sidecar status

Now the number of containers in the pod is two

```
$ k get po                                                                         
NAME                            READY     STATUS    RESTARTS   AGE
backend-app-5f4fd5c6f8-v2mlv    2/2       Running   0          1m
frontend-app-7fdf46cbbb-qm4hp   2/2       Running   0          2m
```

Another option is to take a look to the envoy admin panel which output information of the sidecar configuration and state.

```
$ kubectl port-forward $(kubectl get pod -l app=frontend-app -o jsonpath="{.items[0].metadata.name}")  15000:15000
```

Now in the browser go to `localhost:15000` and take a look at the configuration.

We can also observed the certs generated and injected in the pod running 
`kubectl exec $(kubectl get pod -l app=frontend-app -o jsonpath={.items[0]..metadata.name}) -c istio-proxy -- ls /etc/certs`

Or checking the cert valid dates.
`kubectl exec $(kubectl get pod -l app=backend-app -o jsonpath={.items[0]..metadata.name}) -c istio-proxy -- cat /etc/certs/cert-chain.pem | openssl x509 -text -noout  | grep Validity -A 2`

## 1. Security

### 1.1 Transparent mutual tls

One of the coolest features of Istio is letting us upgrade our security within our services without any change in our code. 

Thanks to having a sidecar set as a proxy next yo our apps, the traffic protocol can be encrypted and decrypted between the sidecars seamlessly. Further Istio implements its own version of SPIFFE, making sure the destination service is really which it supposed to be.

The authentication configuration is driven via policies. You can configure a policy at mesh, namespace or service level. For example, below we decide that backend will be accessed using mutual TLS.

```yaml
apiVersion: "authentication.istio.io/v1alpha1"
kind: "Policy"
metadata:
  name: "backend"
spec:
  targets:
  - name: backend
  peers:
  - mtls: {}
```

Before apply the policy, lets verify it works as intendeed. We can first intercept the traffic to the backend pod and see it is not encrypted (we uses http in port 80). We ssh to one Virtual box node and run a tcpdump

```
$ vagrant ssh node1

(node1) $ sudo tcpdump -nnXs 0 'src host <backend pod IP> and port 80' | grep Istio -B1
```

__Note:__ The backend pod IP can be get it running `kubectl get pods --namespace default -l app=backend-app -o wide | tail -n 1 | awk '{print $6; }'`

Then you can ssh to the other node a curl the endpoint
```
$ vagrant ssh node2

(node2) $ curl http://<backend pod IP>
```

The output you will see is something like
```
    0x00c0:  2267 7265 7474 696e 6773 223a 2248 6920  "grettings":"Hi.
	0x00d0:  5447 4e20 6d65 6574 7570 227d 0d0a 300d  Istio workshop from v1"}..0.
```

Now let's apply the policy

```
$ kubectl apply -f app/policy_mtls.yaml
```

Now try to run the curl command and it will not work because now our backend only accept tls connections.

The policy force the backend servece to be accessed using mutual tls. If we curl from a istio proxy it should work
```
$ kubectl exec $(kubectl get pod -l app=frontend-app -o jsonpath={.items..metadata.name}) -c istio-proxy -- curl https://backend-app -s --key /etc/certs/key.pem --cert /etc/certs/cert-chain.pem --cacert /etc/certs/root-cert.pem -k
```


## 2. Route shifting

First let's expose the frontend in istio ingress

```
istioctl create gateway.yaml
```

Now deploy the second version of the backend v2.
And configure the virtual service sharing the traffic between the services.

```
istioctl create virtual_service_50.yaml
```

## Troubleshoutting 

- Check always all components in the `istio-system` are running correctly. In case Pilot is `Pending` because of resources remove the limits, for our demo is enough.
