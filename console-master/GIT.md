### Setup

1.  Install Git and setup git properties

    ```
    sudo add-apt-repository ppa:git-core/ppa
    sudo apt update; sudo apt install git -y
    git config --global user.name "Your Full Name"
    git config --global user.email < email>
    ```

2.  Setup SSH key

    ```
    ssh-keygen -t rsa -b 4096 -C <email>
    ```

    Press Enter 3 times leaving each blank. You should see the following.

    ```
    Generating public/private rsa key pair.
    Enter file in which to save the key (/home/<username>/.ssh/id_rsa): #just hit enter
    Enter passphrase (empty for no passphrase): #just hit enter
    Enter same passphrase again: #just hit enter
    Your identification has been saved in /home/<username>/.ssh/id_rsa.
    Your public key has been saved in /home/<username>/.ssh/id_rsa.pub.
    ```

3.  Output the public key
    ```
    cat ~/.ssh/id_rsa.pub
    ```
    Copy the contents to https://gitlab.rim.net/profile/keys

### Common errors

1.  During the rebase you got conflicts in `.gitlab/ci/image-sha.yml`
    - Resolve all other merge conflicts.
    - Run `yarn install`.
    - Run `bash ./tools/ci/agent-refs.sh`
