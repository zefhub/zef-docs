# ZefDB Docs

[This approach and talk](https://documentation.divio.com/) largely influenced the structure of this documentation.

Below is a proposal for how the ZefDB docs can be organized:

- Quickstart: step-by-step instructions to help new users get ZefDB (and ZefHub) up and running
- Tutorials: bite-sized end-to-end projects to help users learn new ways of using ZefDB
- How-to: step-by-step instructions answering a specific question or solving a common problem
- Reference: descriptions of each individual ZefDB "user tool" without any extended explanations or justifications
- Discussions: additional links for bug reporting and feature roadmaping

The above is designed for if/when ZefDB is full-fledged open source.

The current iteration of documents is designed for the very earliest private alpha test users, assuming they go through a guided demo and environment setup.

## Getting started

- Install Docusaurus:
  ```console
  yarn install
  ```

- Build the website for development:
  ```console
  yarn start
  ```
  This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

- Build the website for deployment:
  ```console
  yarn build
  ```
  Pushing to the `master` branch triggers a GitHub action which executes `yarn build` and deploys the updated website to `docs.zefdb.com`. `build` performs additional consistency checks compared to `start`, hence it is a good idea to run `yarn build` locally before pushing. 