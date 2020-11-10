#!/usr/bin/env bash

hugo

git add docs

git commit --allow-empty -m "New page"

git push origin main