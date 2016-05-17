import _ from 'underscore';
import React from 'react';

function isRequiredUpdateObject(o) {
    return Array.isArray(o) || (o && o.constructor === Object.prototype.constructor);
}

function deepDiff(o1, o2, p) {
    const notify = (status) => {
        console.warn('Update %s', status);
        console.log('%cbefore', 'font-weight: bold', o1);
        console.log('%cafter ', 'font-weight: bold', o2);
    };
    if(!_.isEqual(o1, o2)) {
        console.group(p);
        if([o1,o2].every(_.isFunction)) {
            notify('avoidable?');
        } else if(![o1, o2].every(isRequiredUpdateObject)) {
            notify('required.');
        } else {
            const keys = _.union(_.keys(o1), _.keys(o2));
            for (const key of keys) {
                deepDiff(o1[key], o2[key], key);
            }
        }
        console.groupEnd();
    } else if(o1 !==o2) {
        console.group(p);
        notify('avoidable!');
        if(_.isObject(o1) && _.isObject(o2)) {
            const keys = _.union(_.keys(o1), _.keys(o2));
            for (const key of keys) {
                deepDiff(o1[key], o2[key], key);
            }
        }
        console.groupEnd();
    }
}

var ProfilerMixin = ComposedComponent => class extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState) {
        deepDiff({props: prevProps, state: prevState},
                {props: this.props, state: this.state},
                ComposedComponent.constructor.displayName);
    }

    render() {
        return <ComposedComponent {...this.props} {...this.state} />
    }
};

export default ProfilerMixin;
