#!/bin/bash
# Cara menjalankan command: ex : ./k6.sh /src/register.js

if [ -z "$1" ]; then
    echo "Error: Harap berikan path file yang akan di-exec. Contoh: ./k6.sh /src/register.js"
    exit 1
fi

# Menjalankan K6 dengan file yang diberikan sebagai parameter
docker run --rm --add-host=host.docker.internal:host-gateway -i -v $(pwd):/src grafana/k6 run "/src/$1"
