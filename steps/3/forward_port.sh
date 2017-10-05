#!/usr/bin/env bash

i="0"
while [ $i -lt 2 ]; do
  PRO=$(ps -alef | grep "ssh -f" | awk '{ print $2;}')
  if [ "$PRO" ]
  then
    echo "ssh process corrected ${PRO}"
    kill -9 $PRO &> /dev/null 
    sleep 5
  fi
  i=$[$i+1]
done  
CLUSTER_IP="$(kubectl get po -o wide | grep fron | awk '{ print $6; }' | head -1)"
ssh -f -o ExitOnForwardFailure=yes core@172.17.4.202 -L 8080:$CLUSTER_IP:8080 sleep 10
CLUSTER_IP="$(kubectl get po -o wide | grep back | awk '{ print $6; }' | head -1)"
ssh -f -o ExitOnForwardFailure=yes core@172.17.4.202 -L 8081:$CLUSTER_IP:8081 sleep 10

