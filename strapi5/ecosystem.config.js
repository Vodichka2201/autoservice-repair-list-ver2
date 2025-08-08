module.exports = {
  apps: [{
    name: 'strapi5',
    cwd: '/home/rudin/autoservice-repair-list-ver2/strapi5',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 1337
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log', 
    log_file: './logs/combined.log',
    time: true
  }]
}
