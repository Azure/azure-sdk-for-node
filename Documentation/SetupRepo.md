Setting up the Node SDK repo


* Create a fork from the [repo](https://github.com/Azure/azure-sdk-for-node)
* Clone the forked repo at a location say “D:\sdk”
```
git clone git@github.com:your-github-username/azure-sdk-for-node.git
cd azure-sdk-for-node
git checkout dev
git remote add upstream git@github.com:Azure/azure-sdk-for-node.git
git pull upstream dev
git push origin dev (if there are any updates)

Note: It is a best practice to create a separate branch for your feature from the dev branch. 
In this way the dev branch in your fork can always be synced easily with upstream and is 
not polluted with your current changes.

git checkout -b mybranch 
git push origin mybranch
```
* Setup the environment
  * On a Windows machine, open a cmd prompt as an Administrator and run the following command: ```npm run-script setup```
  * On a Mac or Linux machine, at the terminal run the following command: ```sudo npm run-script setup```

* Installing the required npm modules from the root directory```npm install```

Now, the Node SDK is ready for you to make a marvelous contribution :+1
