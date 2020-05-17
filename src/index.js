/* import * as $ from 'jquery'; */
import Post from './post.js';
import './styles/index.css';
import './styles/index.less';
/* import yoda from './images/123.jpg'; */
import('lodash').then(_=> console.log('Lodash: ', _.random(0, 42, true)));

const post1 = new Post('Roman');

/* 
  console.log(yoda);
  console.log($); 
*/



console.log(post1.toString());
