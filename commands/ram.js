exports.run = ({ zSend }) => {
	zSend(`RSS: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`);
	zSend(`heapUsed: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
};
