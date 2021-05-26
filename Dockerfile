FROM node:14.16.1 AS make-bundle
ENV WEB_APP=/home/app/webapp
WORKDIR $WEB_APP
COPY . $WEB_APP
RUN npm install 
RUN npm run webpack 

# base image  
FROM python:3.7  
# setup environment variable  
ENV WEB_APP=/home/app/webapp  

# set work directory  
RUN mkdir -p $WEB_APP  

# where your code lives  
WORKDIR $WEB_APP  

# set environment variables  
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1  
# install dependencies  
RUN pip install --upgrade pip  
# copy whole project to your docker home directory. 
# COPY . $DockerHOME
COPY --from=make-bundle /home/app/webapp $WEB_APP 
# run this command to install all dependencies  
RUN pip install -r requirements.txt  
# port where the Django app runs  
EXPOSE 8000  
# start server  
# CMD python manage.py runserver 0.0.0.0:8000  
CMD gunicorn --bind 0.0.0.0:8000 project.wsgi