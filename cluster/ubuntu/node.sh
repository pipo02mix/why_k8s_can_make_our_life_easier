#Script to add the node to the cluster

kubeadm reset
kubeadm join --token $KUBETOKEN $MASTER_IP:6443
