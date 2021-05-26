FROM node:14-slim AS make-bundle
# Create working directory as env variable
ENV WEB_APP=/home/app/webapp
# Move into working directory
WORKDIR $WEB_APP
# Copy app from local into the container 
COPY . $WEB_APP
# Install relevant packages and bundle JS files with webpack 
RUN npm install && \
    npm run webpack 

FROM python:3.7 
# Create working directory as env variable
# PYTHONDONTWRITEBYTECODE=1 This prevents Python from writing out pyc files 
# PYTHONUNBUFFERED=1 This keeps Python from buffering stdin/stdout
ENV WEB_APP=/home/app/webapp PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 
# Move into working directory 
WORKDIR $WEB_APP 
# Make sure pip is up to date 
RUN pip install --upgrade pip
# Copy and install requirements  
COPY ./requirements.txt $WEB_APP
RUN pip install -r requirements.txt
# Copy app from local into the container  
COPY . $WEB_APP
# Copy the bundled JS from previous build
COPY --from=make-bundle /home/app/webapp/static/dist/bundle.js $WEB_APP/static/dist/bundle.js 
# Create a user and make sure app is running with user (limited) privilages instead of root.
# So in case of a hack the hacker will not have root privilages allowing him to run other 
# root programs inside the container. 
RUN useradd user && \
    chown -R user:user $WEB_APP && \
    chmod -R 755 $WEB_APP
# Switch to user
USER user
# Expose port 8000
EXPOSE 8000  
# Run the app with Gunicorn, bind the container's 0.0.0.0 to port 8000
CMD gunicorn --bind 0.0.0.0:8000 project.wsgi
