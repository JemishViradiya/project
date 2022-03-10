#!/bin/sh

if [ -z "${DSM_AUTH_TOKEN}" ]
then
  echo "DSM_AUTH_TOKEN must be set" >&2
  exit 1
fi

cat <<EOF > .dsmrc
{
	"authToken": "${DSM_AUTH_TOKEN}",
	"dsmHost": "blackberry.invisionapp.com",
	"organization": "black-berry",
	"outputDir": ".dsm",
	"storyPath": "docs/**/*.stories.{tsx,jsx,js,ts}"
}
EOF

cat .dsmrc
cp .dsmrc libs/assets/.dsmrc
