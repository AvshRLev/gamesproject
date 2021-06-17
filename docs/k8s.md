# How I deployed a Kubernetes cluster on AWS

## I have used [This Video](https://www.youtube.com/watch?v=vpEDUmt_WKA) as a guide and followed along with thse steps

1. Launch 3 EC2 instances with latest Ubuntu image
2. Install Docker and Kubernetes on all of them

   [Docker Instalation Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

   [Kubernetes Instalation using kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)

3. On each server, enable the use of iptables

   ```shell
   echo "net.bridge.bridge-nf-call-iptables=1" | sudo tee -a /etc/sysctl.conf
   ```

   and then

   ```shell
   sudo sysctl -p
   ```

4. On the Master server only, initialize the cluster

   ```shell
   sudo kubeadm init --pod-network-cidr=10.244.0.0/16
   ```

   After this command finishes, copy kubeadm join provided

5. On the Master server only, set up the kubernetes configuration file for general usage

   ```shell
   mkdir -p $HOME/.kube
   ```

   ```shell
   sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
   ```

   ```shell
   sudo chown $(id -u):$(id -g) $HOME/.kube/config
   ```

6. On the Master server only, apply a common networking plugin. In this case, Flannel.

   ```shell
   kubectl apply -f [kubeflannel](https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml)
   ```

7. On the Worker servers only, join them to the cluster using the command you copied earlier.

   ```shell
   kubeadm join 172.31.37.80:6443 --token ... --discovery-token-ca-cert-hash ...
   ```

8. And eventually apply the deployment files I have imported from my machine

   ```shell
   kubectl apply -f space-deployment.yml space-ingress.yml
   ```
