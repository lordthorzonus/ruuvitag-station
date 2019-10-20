import Handlers from './handlers';
import { run } from './ruuvitag-collector';

run(Handlers.discoveredHandler, Handlers.updatedHandler);
