import nock from 'nock';
import demoURL from './url';


function nockNock() {
  nock(demoURL)
    .get('/api/tasks').reply(200, require('../fixtures/tasks-query.json'));

}

nockNock();

export default nockNock;
