
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

## 1. Security - transparent mutual tls

To verify it works as intendeed we can first intercept the traffic to the backend pod and see it is not encrypted (we uses http in port 80). We ssh to one Virtual box node and run a tcpdump
```
vagrant ssh node1

tcpdump -nXs 0 'src host <backend pod IP>' | grep ISTIO -B1
```
The backend pod IP can be get it running
`kubectl get pods --namespace default -l app=backend-app -o wide | tail -n 1 | awk '{print $6; }'`

The output you will see is something like
```
    0x00c0:  2267 7265 7474 696e 6773 223a 2248 6920  "grettings":"Hi.
	0x00d0:  5447 4e20 6d65 6574 7570 227d 0d0a 300d  ISTIO.WORKSHOP"}..0.
```

Now let's enable the sidecar injection, and make mutual tls automatic between services
In order to do so, first we add a label in the namespace so istio knows it has to inject the sidecar in the new created pod
`kubectl label ns default istio-injection=enabled`
If you want to disable the sidecar injection for default namespace then do 
`k label ns default istio-injection-`
Removing the label and deleting the pods in the namespace will do the trick.

Now delete pod and you will see they are recreated with 2 containers instead of 2.
```
kubectl delete pods -n default --all

kubectl get pods -n default
NAME                            READY     STATUS    RESTARTS   AGE
backend-app-74d95f7c4b-mxlhv    2/2       Running   0          52s
frontend-app-6d4888f8cb-wwlrd   2/2       Running   0          52s
```

Now ssh again to de node after taking the new backend pod IP and try to catch the request payload. You will not see anything, traffic is encripted. In order to reach the frontend from the browser you need to expose the service via a gateway. 
`k apply -f gateway_and_virtual_service.yaml`
After it you can access getting the host IP and the port of the gateway
`kubectl get po -l istio=ingressgateway -n istio-system -o 'jsonpath={.items[0].status.hostIP}'`
`kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}'`
Remember to add `/ui` path to the host and port.

We can also observed the certs generated and injected in the pod running 
`kubectl exec $(kubectl get pod -l app=frontend-app -o jsonpath={.items[0]..metadata.name}) -c istio-proxy -- ls /etc/certs`

Also interesting is check the cert valid dates.
`kubectl exec $(kubectl get pod -l app=backend-app -o jsonpath={.items[0]..metadata.name}) -c istio-proxy -- cat /etc/certs/cert-chain.pem | openssl x509 -text -noout  | grep Validity -A 2`

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
