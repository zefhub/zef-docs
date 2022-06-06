FROM nginx:1.19

# Configure nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/sites-enabled/default.conf /etc/nginx/conf.d/default.conf

# Add static files to be served
COPY build /usr/share/nginx/html

EXPOSE 80
