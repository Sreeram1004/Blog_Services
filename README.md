How To RUN locally:  

  -First primarily you have to install Docker Desktop On your System
  
  -Now After it you clone this repositry into your local
  
  -Now comes the implementation of Docker 
  
    1) change directory to the folder
    
    2) Now run the command 
      ****docker-compose up --build***
    3)This will setup your docker Container locally 
    4) It first full Postegresql image from docker Hub 
    5)Creates images for Users,Blogs,Comments
    6)Now it runs Dockerfile inside each folder and install necessary libraries using npm
    7)It has 2 volumes 
      a)for data storage and integrity
      b)To create database and relations 
      c)And all this relations are network connected
    8)Now after connecting db to postegresql using docker You can run It locally 
    9)For testing You can use Postman for APIS
    10)To Check whether images created or not use
      ***docker ps***
      This shows the images
      a)Now after this take the contained id of postegresql
      and run
      ***docker exec -it <container-name-or-id> psql -U postgres***
      It directs u to postegresql shell
      Now using\c db 
      you can check collections-\d
      and write the querys to alter the tables.
How To Deploy:


    Create a AWS ec2 instance 
    connect to it create a key value .pem file 
    Now install docker in aws linux terminal
    ***sudo yarn install docker***
    ***sudo docker start***
    Now download docker-compose 
    ***sudo curl -L "https://github.com/docker/compose/releases/download/2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose***
    ***sudo chmod +x /usr/local/bin/docker-compose *** 
    Now install firewall and nginx
    Now pull the docker images pushed into docker hub
    *** docker pull <username>/image ***
    create the same yml file
    install cerbot for https
Use links : 
1)https://3.111.41.191/users/
2)https://3.111.41.191/blogs/
3)https://3.111.41.191/comments/

