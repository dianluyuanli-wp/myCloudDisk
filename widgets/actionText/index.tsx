import React from 'react';
import * as s from './index.css';
import withStyles from 'isomorphic-style-loader/withStyles';

interface AProps {
  text: string;
  [props: string]: any;
}

function ActionText(props: AProps) {
  const { text, ...rest } = props;
  return (
    <span {...rest} className={s.action}>
      {text}
    </span>
  );
};

export default withStyles(s)(ActionText)
