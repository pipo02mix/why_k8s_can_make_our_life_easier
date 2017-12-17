#!/bin/bash

# shellcheck disable=SC2086,SC2154
/usr/bin/rkt run \
  --trust-keys-from-https \
  --volume assets,kind=host,source="$(pwd)" \
  --mount volume=assets,target=/assets \
  quay.io/coreos/hyperkube:v1.7.1_coreos.0 \
  --net=host \
  --dns=host \
  --exec=/bin/bash -- /assets/tectonic.sh /assets/auth/kubeconfig /assets false
