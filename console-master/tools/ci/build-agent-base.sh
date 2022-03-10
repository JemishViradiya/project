#!/bin/sh

set -eu

CI_DOCKER_REGISTRY=${CI_DOCKER_REGISTRY:-ues-pipeline-su.devlab2k.testnet.rim.net}

eval `cat pipeline.env`

tag=${DOCKER_BASE_IMAGE_SHA}
imageName="enterprise/ues/console/ci-agent"
image="${CI_DOCKER_REGISTRY}/${imageName}:${tag}"

# sed -i -e 's;^image: .*$;image: '"${image}"';g' .gitlab-ci.yml

pull_image() {
  echo "+ docker pull ${image}"
  if ! docker pull ${image} 2>/dev/null; then
    echo '> No prebuilt image found'
    exit 1
  fi
}

if ! (pull_image) || [ -n "${FORCE_BUILD:-}" ]
then
  rm -rf tmp; mkdir -p tmp
  set -x
  docker build --cache-from "${image}" --pull --target ${CI_AGENT_TARGET:-build} --tag "${image}" -f Dockerfile.ci-agent tmp
  if [ "${CI_AGENT_TARGET:-build}" = "build" ]; then
    docker push "${image}"
  fi
  set +x
else
  echo "Image already exists for /${imageName}:${tag}"
fi
