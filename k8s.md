# How I deployed a kubernetes cluster on aws

1. launch 3 ec2 instances
2. install docker and k8s on all of them
3. On each server, enable the use of iptables
   echo "net.bridge.bridge-nf-call-iptables=1" | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
4. On the Master server only, initialize the cluster
   sudo kubeadm init --pod-network-cidr=10.244.0.0/16
5. On the Master server only, set up the kubernetes configuration file for general usage
   mkdir -p $HOME/.kube
   sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
   sudo chown $(id -u):$(id -g) $HOME/.kube/config
6. kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
7. On the Worker servers only, join them to the cluster using the command you copied earlier.
   kubeadm join 172.31.37.80:6443 --token ... --discovery-token-ca-cert-hash ...
8. kubectl apply -f space-deployment.yml and space-ingress.yml
