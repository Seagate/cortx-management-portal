# Creating PODS

### Prerequisites
* Check and Create Docker Images Refer `Docker Image.md` for the same.

### Creating POD for CSM WEB 

* Create a file csm_web_pod.yaml and add following 
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: csm-web
spec:
  replicas: 1
  selector:
    matchLabels:
      app: csm-web
  template:
    metadata:
      labels:
        app: csm-web
    spec:
      containers:
      - name: csm-web
        image: ssc-vm-0665.colo.seagate.com:5000/csm-web
        env:
        - name: CSM_AGENT_HOST
          value: "csm-agent-svc"
        command: ["/opt/nodejs/node-v12.13.0-linux-x64/bin/node"]
        args: ["/opt/seagate/eos/csm/web/web-dist/server.js"]
        ports:
        - containerPort: 28100
```
* Note:  Change Value according to your config:
    * image
    * env:value
   
### Create CSM Web POD 
```bash
$ kubectl apply -f csm_web_pod.yaml
```
### Verify Pods
```bash
$ kubectl get pods
```
* Output 
```bash
NAME                       READY   STATUS              RESTARTS   AGE
csm-web-5455fdd7dc-rdtfm   0/1     ContainerCreating   0          38s
```

# Create Service File 

### Create a service file and add following in it.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: csm-web-svc
  labels:
    app: csm-web
spec:
  type: NodePort
  ports:
  - port: 28100
    nodePort: 32100
  selector:
    app: csm-web
```

### Create Service 
```bash
kubectl apply -f csm_web_service.yaml
```
### Verify Service file 

```bash
$ kubectl get services

NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)           AGE
csm-web-svc   NodePort    10.102.77.244   <none>        28100:32100/TCP   7s
kubernetes    ClusterIP   10.96.0.1       <none>        443/TCP           95m

```




