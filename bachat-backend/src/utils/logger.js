class Logger {
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaString}`.trim();
  }

  info(message, meta) {
    console.log(this.formatMessage('info', message, meta));
  }

  error(message, meta) {
    console.error(this.formatMessage('error', message, meta));
  }

  warn(message, meta) {
    console.warn(this.formatMessage('warn', message, meta));
  }

  logEvent(eventName, data) {
    this.info(`[${eventName}]`, data);
  }
}

export const logger = new Logger();
export default logger;
