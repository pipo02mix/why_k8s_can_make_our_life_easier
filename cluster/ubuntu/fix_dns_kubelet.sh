printf "[Service]\nEnvironment=\"KUBELET_DNS_ARGS=--cluster-domain=cluster.local --cluster-dns=%s\"\n" 192.168.219.66 > /etc/systemd/system/kubelet.service.d/20-dns-override.conf
systemctl daemon-reload
systemctl restart kubelet.service
