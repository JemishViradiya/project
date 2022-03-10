# Windows Development

### Prerequisites

- You _must_ be on the latest supported Windows build. [Click here for latest requirements](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

  Current requirements:

  - For x64 systems: **Version 1903** or higher, with **Build 18362.1049+ or 18363.1049+**, with the **minor build # over .1049** or higher.
  - For ARM64 systems: **Version 2004** or higher, with **Build 19041** or higher.

- During the installation process, you will need to disable VPN and close CISCO
- The better way is using [GlobalProtect](https://wikis.rim.net/spaces/viewspace.action?key=gp) in this case installation way will be different

All commands use **powershell** Run as Administrator

## Windows Subsystem for Linux 2

Install Windows Subsystem for Linux (WSL) - see [this microsoft article](https://docs.microsoft.com/en-us/windows/wsl/install-win10) for more information.

    PS-Admin> Enable-windowsoptionalfeature -online -norestart -featurename Microsoft-Windows-Subsystem-Linux

    PS-Admin> Enable-windowsoptionalfeature -online -norestart -featurename VirtualMachinePlatform

- You may need to enable developer mode

Install [the wsl2 kernel](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi) and reboot your machine - see [this microsoft article](https://docs.microsoft.com/en-us/windows/wsl/wsl2-kernel) for more information.

Setup wsl2 as the default

    > wsl --set-default-version 2

## Ubuntu

Install the latest ubuntu (20.04 ltc) from [this microsoft article](https://docs.microsoft.com/en-us/windows/wsl/install-manual)

    PS> curl.exe -L -o Ubuntu.appx https://aka.ms/wslubuntu2004

    PS> Add-AppxPackage .\Ubuntu.appx

Launch Ubuntu from the start menu. Setup your username/password as desired from the prompt.

run command explorer.exe . and remove there resolv.conf

## Settings WSL2 and Ubuntu for working with Cisco

follow [the tutorial](https://wikis.rim.net/display/ESHelp/WSL2+on+Windows)

Setup your software: install node.js, yarn, build-essential, etc

    $ sudo apt install net-tools
    $ sudo apt install build-essential
    $ curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    $ sudo apt-get install -y nodejs
    $ sudo apt-get install gcc g++ make
    $ sudo apt-get update
    $ sudo apt-get install yarn

**Note:** WSL2 filesystem performance is very slow in `/mnt` https://github.com/microsoft/WSL/issues/4197. It is recommended that you clone the repo under `/~/<username>`.

## Setup VisualStudio Code in WSL2

1. Ensure vscode is installed in windows
1. Type `code` in ubuntu terminal

See [the VSCode documentation](https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode) for more information.
Alternatively, you can follow instructions provided in [VSCODE](./VSCODE.md)

## Windows Terminal Preview (optional)

1. Download from github [releases page](https://github.com/microsoft/terminal/releases)
1. Install the package with dism

   > DISM.EXE /Online /Add-ProvisionedAppxPackage /PackagePath:C:\Path\To\Package.msixbundle /SkipLicense

Also see [color theme details](https://aka.ms/terminal-color-schemes) and [terminal key-bindings](https://aka.ms/terminal-keybindings) and [profile settings](https://aka.ms/terminal-profile-settings). The raspberry color scheme is excellent.

## Running graphical Applications

See [this article](https://www.nextofwindows.com/how-to-enable-wsl2-ubuntu-gui-and-use-rdp-to-remote) or [this reddit thread](https://www.reddit.com/r/linux/comments/ig0cyn/wsl2_gui_setup_using_xrdp_with_additional_tips/) for information on how to setup xrdp and remote desktop client for windows.
