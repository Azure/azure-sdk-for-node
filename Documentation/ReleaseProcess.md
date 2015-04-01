## What We're Doing
The xplat CLI has a dependency on the Node SDK. In order to make sure that partners can easily keep their copies of the xplat CLI and Node SDK in sync, we need to finagle things a little as we get ready for release.

## At Code Complete

At code complete, we do the following:

### Node SDK repository
1. Create a new branch off the dev branch named "release-<version>", where version is the release number for the new release. So as we work towards releasing version 0.6.10, the branch will be "release-0.6.10". All work as part of this release process will be done on this new branch.

2. Update the package.json file with the upcoming version number.

3. Update the change log.

### XPlat CLI repository

1. Create a new branch off the dev branch named "release-<version>", where version is the release number for the new release. So as we work towards releasing version 0.6.10, the branch will be "release-0.6.10". All work as part of this release process will be done on this new branch.

2. Update the package.json file to the new version of the CLI.

3. Update the package.json dependency on the azure sdk to point to the release branch for the sdk on github. This allows those testing the new CLI bits to get the correct SDK via "npm install" even though we haven't published the new SDK to npm yet.

4. Create the mac and windows installers and Linux tarball

The entry in package.json looks like this:

```
 "dependencies": {
    "azure" : "git://github.com/WindowsAzure/azure-sdk-for-node.git#release-0.6.10",
    "xml2js" : "0.1.x",
```

### Both repositories

1. Send out email to partners saying the release is ready and how to get it.

## Stabilization

This is the phase after code complete where everyone's banging on the bits, looking for (and probably finding) bugs.

All issues will be fixed in the release branch of the appropriate repositories. We will decide if we need to rebuild packages and restart test passes on a case-by-case basis.

## Release

After we've completed stabilization, we will do the following steps to do the release.

1. Publish azure SDK from the release branch to npm
2. Change the xplat-cli package.json azure dependency back to npm (with the new version number)
3. Rebuild xplat-cli packages (msi, mac installer, tarball), do smoke testing.
4. Publish xplat-cli module to npm, other channels

## Post Release

After the release is done, we need to:

1. Add a git tag for the release commits in both repos.
2. Merge release branch into master
3. Merge master to dev
4. Delete release branch (we have the tag if we need to go back)

And we're ready for the next go round.
