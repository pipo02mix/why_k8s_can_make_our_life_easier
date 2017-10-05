#!/usr/bin/env bash
kubectl delete deploy --all
kubectl delete rc --all
kubectl delete po --all
kubectl delete rs --all
kubectl delete svc --all
kubectl delete hpa --all 
