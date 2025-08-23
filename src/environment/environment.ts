import { environment as environmentStaging } from './environment.staging';
import { environment as environmentProd } from './environment.prod';

const environment = process.env.NODE_ENV === 'production' ? environmentProd : environmentStaging;
export { environment };
