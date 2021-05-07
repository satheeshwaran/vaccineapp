import * as React from 'react';

export const navigationRef = React.createRef();

export const customNavigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};
