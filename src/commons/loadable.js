
import Loadable from 'react-loadable';
import React from 'react';

function Loading() {
    return null;
}

export default Component => Loadable({
    loader: Component,
    loading: Loading
})
 