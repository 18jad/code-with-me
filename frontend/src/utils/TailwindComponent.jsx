import { createElement, forwardRef } from "react";

// This work the same as Styled Components
// Basically you can created a styled component using tailwind classes and styling
// Just by typing => const Component = tw.htmlElement = ` @properties `
// and you can use it as a normal component => <Component />

function twFactory(element) {
  return ([className, ..._NULL]) => {
    const StyledComponent = forwardRef(({ additionalClasses, ...props }, ref) =>
      createElement(element, {
        ...props,
        className: [className, additionalClasses],
        ref,
      }),
    );
    return StyledComponent;
  };
}

export const tw = new Proxy(() => {}, {
  get: (_NULL, property) => twFactory(property), // get the element specified aftet tw | .e.g: tw.div, tw.h1, etc...
  apply: (_NULL, __NULL, [el]) => twFactory(el), // apply the classnames passed inside the template literal
});
