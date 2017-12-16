#Script to add the node to the cluster

kubeadm reset
kubeadm join --discovery-token-unsafe-skip-ca-verification --token $KUBETOKEN $MASTER_IP:6443
