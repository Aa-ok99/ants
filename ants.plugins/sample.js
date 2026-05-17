const logger = require('../src/utils/logger');

module.exports = (context) => {
  logger.info(`Sample plugin executed at ${new Date().toISOString()}`);
  console.log('🔌 Sample plugin ran successfully!');
};
