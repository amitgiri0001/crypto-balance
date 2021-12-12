import * as http from 'http';
import {app} from './app';

const port = process.env.PORT || '3000';

// Create HTTP server.
http.createServer(app).listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
