import Authentication from "views/Authentication";
import Home from "views/Home";

/**
 * @type {Array}
 * @description The routes of the application
 * @property {String} path The path of the route
 * @property {React.Component} component The component of the route
 * @property {Boolean} isProtected If the route is protected
 * @property {Boolean} condition protected route condition
 * @property {React.Component} access The component to be rendered if the route is protected and the condition is met (true)
 * @property {String} redirect If the route is protected redirect to this path if condition not met (false)
 * @example Protected
 *
 * {
 *      path: "/profile",
 *      isProtected: true,
 *      condition: isAuthenticated,
 *      access: <Profile />,
 *      redirect: "/login"
 * }
 *
 * @example Not Protected
 * {
 *      path: "/",
 *      component: Home,
 *      isProtected: false
 * }
 *
 */

const routes = [
  {
    path: "/",
    component: <Home />,
    isProtected: false,
  },
  {
    path: "/auth",
    component: <Authentication />,
    isProtected: false,
  },
];

export default routes;
