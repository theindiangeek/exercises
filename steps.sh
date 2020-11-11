#Initialize the variables to be used in this script
export CLUSTERNAME=test
export REGION=blr1
export K8SVERSION="1.19.3-do.2"
export CLUSTERSIZE="s-2vcpu-2gb"
export NODECOUNT=1
export TOKEN=YOUR_DIGITAL_OCEAN_API_TOKEN_HERE
export PAT=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN_HERE

#Create resources via Terraform: (I'm using terraform 12 for this setup)
cd terraform
terraform init
terraform apply -var token=$TOKEN -var clustername="$CLUSTERNAME" -var region="$REGION" -var k8sversion="$K8SVERSION" -var size="$CLUSTERSIZE" -var nodecount="$NODECOUNT" -auto-approve

cd -

#Get k8s config in a file from digital ocean
#This step is being performed assuming you've setup your digital ocean api access on your machine.
doctl auth init --context testing #Enter your DO access token after this step
doctl auth switch --context testing
doctl account get
doctl kubernetes cluster kubeconfig show test > do-edjx.kubeconfig
export KUBECONFIG=do-edjx.kubeconfig

#Give 2 mins for the cluster to boot up completely:
sleep 120

#Initialise helm
helm init

#Wait until tiller pod comes up
kubectl wait --for=condition=Ready pods name=tiller --timeout=600s -n kube-system

#Create amdin clusterrolebinding for tiller pod
kubectl create clusterrolebinding default-clusteradmin --clusterrole=cluster-admin --serviceaccount=kube-system:default

#Deploy cert manager for letsencrypt certificates
kubectl create namespace cert-manager
helm install --name=cert-manager --version v0.14.1 --namespace cert-manager jetstack/cert-manager
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.14.1/cert-manager.crds.yaml
helm repo add jetstack https://charts.jetstack.io

#Deploy ingress controller for the cluster
helm install --name=nginx stable/nginx-ingress --namespace=nginx

#Wait until Kubernetes assigned an external IP to a LoadBalancer service
#https://stackoverflow.com/questions/35179410/how-to-wait-until-kubernetes-assigned-an-external-ip-to-a-loadbalancer-service
bash -c 'external_ip=""; while [ -z $external_ip ]; do echo "Waiting for end point..."; external_ip=$(kubectl get svc nginx-nginx-ingress-controller -n nginx --template="{{range .status.loadBalancer.ingress}}{{.ip}}{{end}}"); [ -z "$external_ip" ] && sleep 10; done; echo "End point ready-" && echo $external_ip; export endpoint=$external_ip'
IP=$(kubectl get svc nginx-nginx-ingress-controller -n nginx -o=custom-columns='DATA:status.loadBalancer.ingress[*].ip' | sed -n '2p')

#Make entries in the hosts file of your system. Since I have not hosted my own DNS, I'm using this hack:
sudo bash -c "echo $IP api.edjx.com web.edjx.com >> /etc/hosts"

#Create the github personal access token as a secret to be used by the runner pod:
kubectl create secret generic pat --from-literal="pat=$PAT"

#Deploy your runner as a container in the k8s environment:
kubectl apply -f runner.yaml

#Deploy your pipeline from this point onwards via github actions.
