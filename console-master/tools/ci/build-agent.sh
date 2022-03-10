#!/bin/sh

set -eux

CI_DOCKER_REGISTRY=${CI_DOCKER_REGISTRY:-ues-pipeline-su.devlab2k.testnet.rim.net}

eval `cat pipeline.env`

tag=${DOCKER_IMAGE_SHA}
imageBase="${CI_DOCKER_REGISTRY}/enterprise/ues/console/ci-agent:${DOCKER_BASE_IMAGE_SHA}"
imageName="${CI_DOCKER_REGISTRY}/enterprise/ues/console/ci-agent-nodejs"

eval `cat pipeline.env`

tar -cf - `git ls-files '**package.json' 'patches/*' yarn.lock .yarnrc.ci .yarn-registry.crt` | (rm -rf tmp; mkdir tmp; cd tmp; tar xf -)
mkdir -p tmp/node_modules/.cache/

if [ "${CI_TRIGGER_TARGET:-none}" != "codeceptjs" ]
then

  docker pull "${imageName}:${tag}" || true
  docker build --pull --build-arg "base_image=${imageBase}" --progress=plain --target=build -f tools/ci/agent-nodejs --tag ${imageName}:${tag} tmp

  docker pull "${imageName}-cypress:${tag}" || true
  docker build --pull --build-arg "base_image=${imageBase}" --progress=plain --target=cypress -f tools/ci/agent-nodejs --tag ${imageName}-cypress:${tag} tmp

  docker push ${imageName}:${tag}
  docker push ${imageName}-cypress:${tag}

  if [ "${CI_COMMIT_BRANCH:-}" = "${CI_DEFAULT_BRANCH}" ]
  then
    docker tag ${imageName}:${tag}" ${imageName}:master
    docker tag ${imageName}-cypress:${tag}" ${imageName}-cypress:master
    docker push ${imageName}:master
    docker push ${imageName}-cypress:master
  fi

else

  if [ "$(curl -ksI https://ues-pipeline-su.devlab2k.testnet.rim.net/v2/enterprise/ues/console/ci-agent-codeceptjs/manifests/${tag} -o /dev/null -w '%{http_code}')" == "200" ]
  then
    echo "Image cached"
    exit 0
  fi
  imageName="${CI_DOCKER_REGISTRY}/enterprise/ues/console/ci-agent-codeceptjs"
  docker pull "${imageName}:${tag}" || true
  docker build --pull --build-arg "base_image=${imageBase}" --progress=plain --target=codeceptjs -f tools/ci/agent-nodejs --tag ${imageName}:${tag} tmp
  docker push ${imageName}:${tag}

fi
