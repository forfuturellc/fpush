#!/usr/bin/env bash

set -e

# variables
dl_url="https://download.pureftpd.org/pub/pure-ftpd/releases/pure-ftpd-1.0.43.tar.gz"
dl_dir="pure-ftp"
dl_tarball="${dl_dir}.tar.gz"

if [[ -d "${dl_dir}" ]]
then
    echo "! source already downloaded"
    echo "! rm the '${dl_dir}' directory to re-download and re-build"
    exit
fi

echo ""
echo "- updating apt sources"
sudo apt-get --quiet --yes update

echo "- installing build tools"
sudo apt-get install --quiet --yes build-essential wget

echo "- downloading pure-ftpd source"
wget "${dl_url}" --quiet --output-document="${dl_tarball}"

echo "- uncompressing tarball"
mkdir -p "${dl_dir}"
tar xvf "${dl_tarball}" -C "${dl_dir}" --strip-components=1 > /dev/null
cd "${dl_dir}"

echo "- configuring and building source"
./configure
make

echo "- adding 'ftp' user for anonymous logins"
sudo useradd --home /home/ftp --create-home --user-group ftp

echo "- starting the ftp server"
./src/pure-ftpd --anonymouscancreatedirs --allowdotfiles --daemonize --bind 8080
