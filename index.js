import aStar from './a-star/a-star.js';
import aGreedy from './a-star/a-greedy-star.js';
import nba from './a-star/nba/index.js';

const pathFinders = {
  aStar,
  aGreedy,
  nba,
};

export { aStar, aGreedy, nba };
export default pathFinders;
