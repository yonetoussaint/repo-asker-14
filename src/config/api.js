const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3001'
  },
  production: {
    baseURL: 'https://your-render-app.onrender.com' // Your Render app URL
  }
};

export const API_BASE_URL = API_CONFIG[process.env.NODE_ENV || 'development'].baseURL;