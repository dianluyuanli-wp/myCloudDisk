import React from 'react';
import ReactDom from 'react-dom';
import Com from './component/content';
import Login from './component/login';
import { BrowserRouter as Router, Route } from "react-router-dom";
import StyleContext from 'isomorphic-style-loader/StyleContext';

//  : any[]
const insertCss = (...styles: any[]) => {
    const removeCss = styles.map(style => style._insertCss())
    return () => removeCss.forEach(dispose => dispose())
  }

//  挂载组件
const mountNode = document.getElementById('main');

//  原始前端渲染 在html的节点上挂载组件
// ReactDom.render((
//     <Com />
// ),mountNode);

ReactDom.render(
    <StyleContext.Provider value={{ insertCss }}>
      <Router>
          <Route path='/login.html' component={Login} />
          <Route path='/disk.html' component={Com} />
          <Route path='/' component={Login} />  
      </Router>
    </StyleContext.Provider>,
    mountNode
);