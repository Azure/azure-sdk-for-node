# Windows Azure CLI tool for Mac and Linux

This project provide a cross platform command line tool for managing Windows Azure Websites and Virtual Machines.

With Windows Azure Websites you can deploy node.js applications to the cloud in just seconds using git. 

# CLI Features

* Websites
	* Create and manage WindowsAzure websites
    * Download site logs
    * Manage Deployments
    * Configure Github integration
* Virtual machines
    * Create and manage Windows and Linux Virtual machines
	* Create and manage VM endpoints
    * Create and manage Virtual Machine Images
    * Create and manage certificates

# Getting Started
## Download Source Code

To get the source code of the SDK via **git** just type:

    git clone https://github.com/WindowsAzure/azure-sdk-tools-xplat.git
    cd ./azure-sdk-tools-xplat
    npm install 

## Install the npm package

You can install the azure cli npm package directly. 

    npm install -g azure-cli

# Using the cli

The azure cli has several top level commands which correlate to different features of Windows Azure. Each top level command is then broken up into further sub commmands. Typing "azure" by itself or "azure --help" will list out each of the sub commands.

Below is a list of some of the more common commands and explanations on how to use them. 

## azure account - Managing Azure accounts

In order to use the CLI, you must first import credentials.

    azure account download
Download your credentials from Windows Azure. Logs you in to the Azure portal and downloads a publishsettings file.

    azure account import [file]
Imports previously downloaded credentials

### azure account storage - Manage Azure Storage accounts

You can create and manage store accounts for leveraging blobs, tables and queues within your applications.

    azure account storage list
Lists all your storage accounts

    azure account storage create [name]
Creates a new storage account

**--location** - Location for the storage account 

**--affinitygroup** - Affinity group for the storage account

**Note:** Either location or affinity group is required.

    azure account storage update [name]
Updates a storage account label, description, etc.

    azure account storage delete [name]
Removes the storage account

    azure account storage keys list [name]
Lists out storage account keys for the specified account

    azure account storage keys renew [name]
Renews storage account keys for the specified account

## azure site - Managing Windows Azure Websites

You can create websites for deploying static HTML, node.js, PHP, and .NET applications.

    azure site list
Lists all your websites

    azure site create [site]
Creates a new Windows Azure website. If run in a folder that has an app.js or a server.js, we will assume this is a node.js application and create an iisnode.yml file for configuring the node hosted environment. 

**--git** - create a git repo for deploying the application. Will call "git init" to initialize the local folder as repo and will add an "azure" remote for the remote repository. --publishingUsername can be used for scripting scenarios. If publishing user is not provider, you will be prompted. ex. "azure site create foo --git".

**--github** - connect this website to a github repo. If run in a local repo, will use the remotes present. --githubusername / --githubpassword / -- githubrepository can be used for scripting scenarios. If these are not provided, you will be prompted. ex. "azure site create foo --github"

    azure site show [site]
Lists the details for a specific website. 

    azure site browse [site]
Opens the website in the browser. 

    azure site delete [site]
Deletes the current site. Will prompt for deletion.

    azure site stop [site]
Stops the website

    azure site start [site]
Starts the website

    azure site restart [site]
Stops and starts the website

**--quiet** - overrides prompting for delete.

**Note:** Above [site] is not required if the command is run in the main app folder.

### azure site config - Managing site app settings

You can set application settings which will propagate to environment variables for your node and PHP applications. Changes are instant, and you do not need to stop/start the app to pick up the new variables.

    azure site config list [site]
Lists all application settings.

    azure site config add [keyvaluepair] [site]
Adds a new app setting. [keyvaluepair] is of the form "[key]=[value]" i.e. "foo=bar".

    azure site config clear [key] [site]
Removes the specified app setting.

    azure site config get [key] [site]
Retrieves the value for the selected key.

## azure vm - Managing Windows Azure virtual machines.

You can create and manage both Windows and Linux virtual machines in Windows Azure.

    azure vm list
List your virtual machines and their statuses

    azure vm location list
List available locations for hosting virtual machines.

    azure vm create [name] [image] [username] [password] [location]
Create a new virtual machine using the specific image and credentials. An image can be a base image or an custom image uploaded to your account ex. "azure create myvm SUSE__openSUSE-12-1-20120603-en-us-30GB.vhd user pa$$w0rd westus".

**--ssh [port]** - Enable a Linux VM to be remotely administered via ssh. By default port 22 is chosen.

**--rdp [port]** - Enable a Windows VM to be remotely administered via RDP. By default port 3389 is chosen.

    azure vm create-from [name] [rolefile]
Create a virtual machine from a previously exported rolefile.

    azure vm export [name] [file]
Export a virtual machine definition.

    azure vm show [name]
Display details about the VM.

    azure vm shutdown [name]
Stop the virtual machine

    azure vm start
Start a previously shutdown virtual machine

    azure vm restart [name]
Restart the virtual machine

    azure vm delete [name]
Delete the virtual machine

### azure vm image - Managing VM images

Windows Azure allows you to create virtual machines using a set of preconfigured based images or using your own custom images which you create either by uploaded, or saving an existing vm.

    azure vm image list
List base and custom vm images

    azure vm image show [image]
Show details about a specific image

    azure vm image create [name] [path]
Upload a new custom image. The path can point to a local file or a public hosted blob, including a secure blob.

**--os [os]** - specify the OS, "Linux" or "Windows"

**--basevhd [blob]** - Specify a base vhd blob url.

**--source-key [key]** - If the blob is secured, specifies the access key.

    azure vm image delete [name]
Deletes the specified image.

### azure vm disk - Managing VM data disks

You can create additional data disks which you mount within your virtual machines.

    azure vm disk list
Lists available data disks

    azure vm disk show [name]
Displays details on a specific disk

    azure vm disk create [name] [path]
Uploads and creates a new disk using the specified path. The path can point to a local file or a public hosted blob, including a secure blob.

**--source-key [key]** - If the blob is secured, specifies the access key.

    azure vm disk attach [vm-name] [image]
Attaches an image to an existing VM.

    azure vm disk detach [vm-name] [image]
Detaches an image from an existing VM.

**For more details on the commands, please see the [command line tool reference](http://go.microsoft.com/fwlink/?LinkId=252246&clcid=0x409) and this [How to Guide](http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/command-line-tools/)**

# Need Help?

Be sure to check out the Windows Azure [Developer Forums on Stack Overflow](http://go.microsoft.com/fwlink/?LinkId=234489) if you have trouble with the provided code.

# Contribute Code or Provide Feedback

If you would like to become an active contributor to this project please follow the instructions provided in [Windows Azure Projects Contribution Guidelines](http://windowsazure.github.com/guidelines.html).

If you encounter any bugs with the library please file an issue in the [Issues](https://github.com/WindowsAzure/azure-sdk-for-node/issues) section of the project.

# Learn More
For documentation on how to host Node.js applications on Windows Azure, please see the [Windows Azure Node.js Developer Center](http://www.windowsazure.com/en-us/develop/nodejs/).

For more extensive  documentation on the new cross platform CLI tool for Mac and Linux, please see this [reference](http://go.microsoft.com/fwlink/?LinkId=252246&clcid=0x409) and this [How to Guide](http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/command-line-tools/)

Check out our new IRC channel on freenode, node-azure.
