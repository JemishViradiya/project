#!/bin/bash

set -eux

version=${VERSION:-5.1.3}
url=https://storage.googleapis.com/workbox-cdn/releases/${version}

mkdir -p libs/pwa/assets/workbox/$version
cd libs/pwa/assets/workbox/$version

function dl()
{
  local file="$1"
  local env="$2"

  if ! [ -f "${file}.${env}.js" ]
  then
    curl -s --location --fail "${url}/${file}.${env}.js" -o "${file}.${env}.js" &
    curl -s --location --fail "${url}/${file}.${env}.js.map" -o "${file}.${env}.js.map" &
  fi
}

function entry_dl()
{
  local file="$1"

  if ! [ -f "${file}.js" ]
  then
    curl -s --location --fail "${url}/${file}.js" -o "${file}.js" &
    curl -s --location --fail "${url}/${file}.js.map" -o "${file}.js.map" &
    wait
    sed -i -e 's;https://storage.googleapis.com/workbox-cdn/releases/;pwa/workbox/;g' "${file}.js" "${file}.js.map"
  fi
}

entry_dl workbox-sw

for mod in core broadcast-update cacheable-response expiration offline-ga navigation-preload precaching range-requests routing strategies streams
do
  dl workbox-$mod dev
  dl workbox-$mod prod
done

wait
