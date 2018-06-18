
// Initializes the `nedb2` service on path `/nedb-2`. (Can be re-generated.)
import { App } from '../../app.interface';

import createService from 'feathers-nedb';
import createModel from '../../models/nedb-2.model';
import hooks from './nedb-2.hooks';
// !code: imports // !end
// !code: init // !end

let moduleExports = function (app: App) {
  let Model = createModel(app);
  let paginate = app.get('paginate');
  // !code: func_init // !end

  let options = {
    name: 'nedb-2',
    Model,
    paginate,
    // !code: options_more // !end
  };
  // !code: options_change // !end

  // Initialize our service with any options it requires
  app.use('/nedb-2', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('nedb-2');

  service.hooks(hooks);
  // !code: func_return // !end
};

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
