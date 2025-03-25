import { RateCron } from './RateCron';

export const initializeCronJobs = () => {
  const rateCron = new RateCron();
  rateCron.start();
};
