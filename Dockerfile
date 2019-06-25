#Download base image ubuntu 18.04
FROM ubuntu:18.04
ENV PYTHONUNBUFFERED 1

# Install Essentials
RUN apt-get update && \
    apt install -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev wget && \
    apt install -y software-properties-common apt-transport-https bash && \
    apt-get install -y git-core && \
    apt install -y python3.6 python3-pip && \
    pip3 install virtualenv virtualenvwrapper gunicorn

RUN mkdir -p /gclipboard/web
COPY requirements.txt /gclipboard/web/
RUN pip3 install -r /gclipboard/web/requirements.txt

COPY web /gclipboard/web/
COPY start.sh /gclipboard/

WORKDIR /gclipboard/

# Make port 9000 available to the world outside this container
EXPOSE 9000

# Run start.sh when the container launches
# CMD ["./start.sh"]
CMD ["python3", "/gclipboard/web/manage.py", "runserver", "0.0.0.0:9000"]