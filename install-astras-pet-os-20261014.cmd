@echo off
rem Double-click to install Astra's PetOS for this Windows user (no administrator rights needed).
rem It runs installer\install-astras-pet-os-20261014.ps1 from this folder, wherever you unzipped it.
rem A "Set up your farm" window opens: Astra's example pets, or from scratch with the pets you tick.
rem Extra options pass straight through, for example: install-astras-pet-os-20261014.cmd -Farm Scratch -Pets goldfish
title Astra's PetOS installer
echo Astra's PetOS is starting its installer. A "Set up your farm" window will open in a moment.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0installer\install-astras-pet-os-20261014.ps1" %*
if errorlevel 1 (
  echo.
  echo If this is a work or school computer, its security may not allow this installer. Do not try to get around it.
  echo Use Astra's PetOS with nothing to install: open the pets in a browser and give their Markdown files to an AI
  echo your organization allows: https://github.com/findastra/astras-pet-os/tree/main/markdown-pets
)
echo.
pause
