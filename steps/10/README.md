
Service Mesh - Istio

[Be sured to install helm and a private registry](/steps/1/README.md)
[Configure some apps before install the service mesh](/steps/10/app/README.md)

Now that we have run it out app in kubernetes, let's deploy istio into the cluster.

We need to create a namespace to allocate istio resources
`kubectl create ns istio-system`

And now just running the command
`kubectl apply -f istio/istio.yaml`
it creates all custom resources and services to manage the service mesh

Let's see now the powerness of istio.

1) Security - transparent mutual tls

To verify it works as intendeed we can first intercept the traffic to the backend pod and see it is not encrypted (we uses http in port 80). We ssh to one Virtual box node and run a tcpdump
```
vagrant ssh node1

tcpdump -nXs 0 'dst host <backend pod IP>' | grep TGN -B1
```
The backend pod Ip can be get it running
`kubectl get pods --namespace default -l app=backend-app -o wide | tail -n 1 | awk '{print $6; }'`

The output you will see is something like
````
    0x00c0:  2267 7265 7474 696e 6773 223a 2248 6920  "grettings":"Hi.
	0x00d0:  5447 4e20 6d65 6574 7570 227d 0d0a 300d  TGN.meetup"}..0.
```

Now let's enable the sidecar injection, and make mutual tls automatic between services
In order to do so, first we add a label in the namespace so istio knows if it has to inject the sidecar in the new created pod
`kubectl label ns default istio-injection=enabled`

Now delete pod and you will see they are recreated with 2 containers instead of 2.
```
kubectl delete pods -n default --all

kubectl get pods -n default
NAME                            READY     STATUS    RESTARTS   AGE
backend-app-74d95f7c4b-mxlhv    2/2       Running   0          52s
frontend-app-6d4888f8cb-wwlrd   2/2       Running   0          52s
```

Now ssh again to de node after taking the new backend pod IP and try to catch the request payload. You will not see anything, traffic is encripted.

We can also observed the certs generated and injected in the pod running 
` kubectl exec $(kubectl get pod -l app=frontend-app -o jsonpath={.items..metadata.name}) -c istio-proxy -- ls /etc/certs`
