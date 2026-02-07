const formatData = (data) => {
    return data.map(item => {
      return Object.fromEntries(Object.entries(item).map(([key, value]) => {
        if (typeof value === 'string' && value >= 1000 && value < 1000000) {
          return [key, (value / 1000).toFixed(0) + 'K'];
        } else if (typeof value === 'string' && value >= 1000000) {
          return [key, (value / 1000000).toFixed(0) + 'M'];
        } else {
          return [key, value];
        }
      }));
    });
}

module.exports = formatData