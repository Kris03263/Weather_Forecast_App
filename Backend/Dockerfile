# Use an official Python runtime as a parent image
FROM python:alpine
# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Make port 8000 available outside the container
EXPOSE 8000

# Define environment variable
ENV FLASK_APP=app.py

# Run the application
CMD ["python3", "index.py"]
