import Handlers from './handlers';
import { run, shutdown } from './ruuvitag-collector';

process.stdin.resume();

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

run(Handlers.discoveredHandler, Handlers.updatedHandler);
