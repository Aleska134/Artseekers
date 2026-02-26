#!/usr/bin/env bash
# exit on error
set -o errexit

# Instalar dependencias de Node y construir el frontend
npm install
npm run build

pip install pipenv

pipenv install

pipenv run upgrade

# pipenv run pop_db