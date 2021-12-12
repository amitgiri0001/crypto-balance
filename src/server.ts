if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
}

import * as http from 'http';
import {app} from './app';

const port = process.env.PORT || '3000';

// Create HTTP server.
http.createServer(app).listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
