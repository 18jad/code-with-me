<img src="./demo/readme/title1.svg"/>

<div align="center">

> Hello world! This is the project’s summary that describes the project plain and simple, limited to the space available.

**[PROJECT PHILOSOPHY](https://github.com/julescript/well_app#-project-philosophy) • [WIREFRAMES](https://github.com/julescript/well_app#-wireframes) • [TECH STACK](https://github.com/julescript/well_app#-tech-stack) • [IMPLEMENTATION](https://github.com/julescript/well_app#-impplementation) • [HOW TO RUN?](https://github.com/julescript/well_app#-how-to-run)**

</div>

<br><br>

<img src="./demo/readme/title2.svg"/>

> CodeWithMe is a website to help you code togther with your friends and be more creative and productive while chatting and talking about your idea, and the steps you gonna go through.

> Not only that, when you finish coding you can save your files and projectrs online on the servers, or by pushing it directly to github!

### User Stories

- As a user, I want to code and compile my code and see result online
- As a user, I want to code online with my friends while live sharing code editor
- As a user, I want to chat with my team mates while coding together
- As a user, I want to save my code online when i finish coding
- As a user, I want to push my code to github instantly when i finish coding

<br><br>

<img src="./demo/readme/title3.svg"/>

> This design was planned before on paper, then moved to Figma app for the fine details.
> Note that i didn't use any styling library or theme, all from scratch and using pure SCSS modules and TailwindCSS

| Landing                                                                     | Login                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [<img src="./demo/homepage_mockup.png" width="1500"/>](homepage_mockup.png) | [<img src="./demo/login_mockup.png" width="1360"/>](login_mockup.png) |

| Register                                                                | Profile                                                                   |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [<img src="./demo/signup_mockup.png" width="1500"/>](signup_mockup.png) | [<img src="./demo/profile_mockup.png" width="1540"/>](profile_mockup.png) |

| User search results                                            | IDE                                                               |
| -------------------------------------------------------------- | ----------------------------------------------------------------- |
| [<img src="./demo/guest_mockup.png" width="1500"/>](guest.png) | [<img src="./demo/ide_mockup.png" width="1500"/>](ide_mockup.png) |

<br><br>

<img src="./demo/readme/title4.svg"/>

Here's a brief high-level overview of the tech stack the Well app uses:

- This project uses the [Flutter app development framework](https://flutter.dev/). Flutter is a cross-platform hybrid app development platform which allows us to use a single codebase for apps on mobile, desktop, and the web.
- For persistent storage (database), the app uses the [Hive](https://hivedb.dev/) package which allows the app to create a custom storage schema and save it to a local database.
- To send local push notifications, the app uses the [flutter_local_notifications](https://pub.dev/packages/flutter_local_notifications) package which supports Android, iOS, and macOS.
  - 🚨 Currently, notifications aren't working on macOS. This is a known issue that we are working to resolve!
- The app uses the font ["Work Sans"](https://fonts.google.com/specimen/Work+Sans) as its main font, and the design of the app adheres to the material design guidelines.

<br><br>
<img src="./demo/readme/title5.svg"/>

> Uing the above mentioned tecch stacks and the wireframes build with figma from the user sotries we have, the implementation of the app is shown as below, these are screenshots from the real app

| Landing                                                                                | Home/Search                                                                               |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![Landing](https://github.com/julescript/spotifyndr/blob/master/demo/Landing_Page.jpg) | ![Home/Search](https://github.com/julescript/spotifyndr/blob/master/demo/Search_Page.jpg) |

<br><br>
<img src="./demo/readme/title6.svg"/>

> This is an example of how you may give instructions on setting up your project locally.
> To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = "ENTER YOUR API";
   ```
