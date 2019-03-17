# Brainwaves_FS_Final
Repo for final version of Brainwaves Full Stack hackathon

# Overview

This repository is structured as a mono-repo, with several of the primary packages setup as direct micro-services.

The `packages/` folder contains each separate package of the mono-repo.

# Development

To install and run all local services, run the following two commands in the root/packages of the repository:

```
npm install
npm start
```

When the services have started successfully, the application may be accessed by opening the below URL:

```
http://localhost:4200/
```

# Services

The primary micro-services at the time of writing include:

- `Backend`: Provides the primary API
    - Service port: `3030`

- `Frontend`: Provides the primary angular UI
    - Service port: `4200`


# Mono-repo layout

The repository structure is in the format of the Lerna package system.  The packages are not linked into a workspace, instead each being handled as a separate micro-service.

This ensures that for micro-services which have a large dependency graph (such as React or Angular projects), that the install and package-add processing time will be the minimum required for each micro-service.
